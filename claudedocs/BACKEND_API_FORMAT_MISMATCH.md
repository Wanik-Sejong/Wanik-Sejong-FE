# Backend API Format Mismatch Analysis

**Issue Date**: 2025-12-24
**Severity**: 🔴 CRITICAL
**Impact**: ALL courses filtered out, empty roadmap displayed to users

## Problem Summary

The Spring Boot backend API at `https://hackathon.yeo-li.com/api/v1/roadmap` is returning course data in **frontend format** instead of the **backend format** specified in the API contract. This causes the frontend adapter to receive undefined values for all required fields, resulting in 100% of courses being filtered out.

## Evidence

### 1. API Specification (Expected Format)

According to the backend API specification, the response should contain:

```json
{
  "coursePlan": [
    {
      "period": "string",
      "goal": "string",
      "effort": "string",
      "courses": [
        {
          "courseName": "string",      // ← Expected field name
          "courseType": "string",      // ← Expected field name
          "courseCode": "string",
          "teachingArea": "string",
          "selectedArea": "string",
          "credits": 0,
          "grade": "string",
          "completedYear": 0,
          "completedSemester": 0
        }
      ]
    }
  ]
}
```

### 2. Actual API Response (Wrong Format)

Debug logs from `src/lib/api-client.ts` show the actual response:

```json
{
  "coursePlan": [
    {
      "period": "1학년 1학기",
      "goal": "전공 기초 다지기",
      "effort": "주당 15시간",
      "courses": [
        {
          "name": "세종인을위한전공탐색",    // ← Wrong: should be "courseName"
          "type": "공필",                    // ← Wrong: should be "courseType"
          "reason": "전공 탐색...",
          "priority": "필수"
        }
      ]
    }
  ]
}
```

### 3. Frontend Adapter Code (Correct per Specification)

`src/lib/adapters/backend-adapter.ts` correctly implements the specification:

```typescript
const recommendedCourses: RecommendedCourse[] = coursePlan.courses
  .filter((course) => {
    if (!course.courseType) {  // ← Looking for courseType (correct)
      console.warn('⚠️ [Backend Adapter] courseType 누락된 과목:', {
        period: coursePlan.period,
        courseName: course.courseName || '(이름 없음)',
        courseCode: course.courseCode,
      });
      return false;
    }
    return true;
  })
  .map((course) => ({
    name: course.courseName || '과목명 없음',  // ← Accessing courseName (correct)
    type: course.courseType,                    // ← Accessing courseType (correct)
    reason: `${course.courseType} 과목`,
    priority: 'medium',
  }));
```

### 4. Result: 100% Courses Filtered Out

Debug logs from adapter conversion:

```
🐛 [DEBUG] Converting CoursePlan for period: 1학년 1학기
{
  totalCourses: 2,
  allCourses: [
    {
      index: 0,
      courseName: undefined,     // ← course.courseName is undefined
      courseType: undefined,     // ← course.courseType is undefined
      courseCode: undefined,
      hasCourseName: false,
      hasCourseType: false       // ← Triggers filter
    }
  ]
}

🐛 [DEBUG] Conversion result for 1학년 1학기:
{
  originalCount: 2,
  validCount: 0,        // ← All courses filtered out
  filtered: 2           // ← No courses pass validation
}
```

## Root Cause Analysis

### Backend API Contract Violation

The Spring Boot backend is serializing course objects with field names from the **frontend TypeScript interface** instead of the **backend DTO specification**.

**Hypothesis**: Backend code is likely:
1. Using incorrect DTO field mappings in the controller/service layer
2. Misconfigured Jackson serialization (wrong property names)
3. Accidentally using frontend-compatible DTOs instead of backend DTOs
4. Not following its own OpenAPI/Swagger specification

### Impact Chain

```
Backend sends {name, type}
  ↓
Frontend adapter looks for {courseName, courseType}
  ↓
Finds undefined values
  ↓
Validation filters out ALL courses
  ↓
User sees empty roadmap (0 courses displayed)
```

## Comparison Table

| Field Purpose | API Specification (Expected) | Actual Response (Wrong) | Frontend Adapter Expects |
|---------------|------------------------------|-------------------------|--------------------------|
| Course name   | `courseName`                 | `name`                  | `courseName` ✅          |
| Course type   | `courseType`                 | `type`                  | `courseType` ✅          |
| Course code   | `courseCode`                 | ❌ Missing              | `courseCode` ✅          |
| Teaching area | `teachingArea`               | ❌ Missing              | `teachingArea` ✅        |
| Credits       | `credits`                    | ❌ Missing              | `credits` ✅             |
| Grade         | `grade`                      | ❌ Missing              | `grade` ✅               |
| Reason        | ❌ Not in spec               | `reason` ✅             | ❌ Not expected          |
| Priority      | ❌ Not in spec               | `priority` ✅           | ❌ Not expected          |

## Required Backend Fix

### Backend Team Must Change

**From (Current - Wrong)**:
```java
// Spring Boot DTO (likely incorrect)
public class CourseResponse {
    private String name;        // ← Wrong field name
    private String type;        // ← Wrong field name
    private String reason;      // ← Not in specification
    private String priority;    // ← Not in specification
}
```

**To (Correct per Specification)**:
```java
// Spring Boot DTO (correct)
public class CourseResponse {
    private String courseName;      // ✅ Match specification
    private String courseType;      // ✅ Match specification
    private String courseCode;      // ✅ Include required fields
    private String teachingArea;
    private String selectedArea;
    private Integer credits;
    private String grade;
    private Integer completedYear;
    private Integer completedSemester;
}
```

## Temporary Frontend Workaround

While waiting for backend fix, frontend can implement compatibility layer:

```typescript
// In backend-adapter.ts
const recommendedCourses: RecommendedCourse[] = coursePlan.courses
  .map((course: any) => {
    // ✅ Accept both formats temporarily
    const courseName = course.courseName || course.name || '과목명 없음';
    const courseType = course.courseType || course.type;

    if (!courseType) {
      console.warn('⚠️ courseType 완전 누락:', course);
      return null;
    }

    return {
      name: courseName,
      type: courseType,
      reason: course.reason || `${courseType} 과목`,
      priority: course.priority || 'medium',
    };
  })
  .filter((course): course is RecommendedCourse => course !== null);
```

## Action Items

### For Backend Team (CRITICAL - BLOCKER)
- [ ] Fix DTO field names to match API specification
- [ ] Add `courseCode`, `teachingArea`, `credits`, `grade` fields
- [ ] Remove `reason` and `priority` from backend response (frontend-only fields)
- [ ] Validate response against OpenAPI/Swagger schema
- [ ] Test with frontend integration

### For Frontend Team (TEMPORARY)
- [x] Document issue comprehensively
- [ ] Implement compatibility layer (accept both formats)
- [ ] Add monitoring/alerts for format inconsistencies
- [ ] Remove compatibility layer after backend fix confirmed

## Testing Checklist

After backend fix:
- [ ] Verify all courses have `courseName` and `courseType` fields
- [ ] Confirm `courseCode`, `teachingArea`, `credits`, `grade` are present
- [ ] Validate no courses are filtered out (validCount > 0)
- [ ] Test roadmap display shows all recommended courses
- [ ] Confirm backend adheres to API specification
- [ ] Remove frontend compatibility workaround

## Related Files

- `src/lib/adapters/backend-adapter.ts` - Conversion logic (correct implementation)
- `src/lib/types/backend.types.ts` - API type definitions (correct specification)
- `src/lib/api-client.ts` - Debug logging (revealed mismatch)
- `src/components/RoadmapDisplay.tsx` - UI component (defensive filtering added)
- `docs/API_BACKEND_DOCUMENTATION.md` - API specification reference

## Conclusion

This is a **backend API contract violation** causing **100% data loss** in the frontend. The backend must fix field names to match its own specification. Frontend has implemented defensive measures to prevent crashes, but cannot display data until backend sends correct format.

**Priority**: CRITICAL
**Blocker**: Yes - prevents core functionality
**Owner**: Backend Team
**Workaround Available**: Yes (frontend compatibility layer)
**Permanent Fix Required**: Backend DTO serialization correction
