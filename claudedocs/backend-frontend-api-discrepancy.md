# 백엔드-프론트엔드 API 불일치 분석 보고서

**작성일**: 2024-12-23
**분석 대상**: 완익세종 (Wanik-Sejong) 프로젝트
**분석자**: Claude Code
**문서 버전**: 1.0

---

## 📋 목차

1. [개요](#개요)
2. [분석 환경](#분석-환경)
3. [주요 불일치 사항](#주요-불일치-사항)
4. [상세 분석](#상세-분석)
5. [영향 범위](#영향-범위)
6. [해결 방안](#해결-방안)
7. [우선순위 및 로드맵](#우선순위-및-로드맵)
8. [권장 사항](#권장-사항)

---

## 개요

### 배경
백엔드 API 문서(`docs/API_BACKEND_DOCUMENTATION.md`)와 현재 프론트엔드 코드베이스를 비교 분석한 결과, 데이터 구조 및 응답 형식에서 **심각한 불일치**가 발견되었습니다.

### 핵심 문제
- 백엔드 API는 **Course 객체** (학수번호, 학점 등 포함)를 반환
- 프론트엔드는 **RecommendedCourse** (이름, 타입만)를 사용 중
- AI 프롬프트가 백엔드 API 명세와 다른 구조 요구

### 영향도
- **🔴 CRITICAL**: 로드맵 생성 기능 전체에 영향
- **데이터 손실**: 학점, 과목 코드 등 중요 정보 미표시
- **UI 렌더링**: 잘못된 필드명 사용으로 정보 누락

---

## 분석 환경

### 프로젝트 정보
```yaml
프로젝트명: 완익세종 (Wanik-Sejong)
프로젝트 타입: Next.js 16 App Router
프레임워크: React 19.2.3
언어: TypeScript 5
스타일: Tailwind CSS 4
백엔드 API: https://hackathon.yeo-li.com
```

### 분석 범위
```
docs/
  └── API_BACKEND_DOCUMENTATION.md  ← 백엔드 API 명세

src/
  ├── lib/
  │   ├── types.ts                  ← 타입 정의
  │   └── api-client.ts             ← API 클라이언트
  ├── app/api/
  │   ├── parse-excel/route.ts      ← 엑셀 파싱 API
  │   └── generate-roadmap/route.ts ← 로드맵 생성 API
  └── components/
      ├── RoadmapDisplay.tsx        ← 로드맵 렌더링
      ├── FileUpload.tsx            ← 파일 업로드
      └── CareerInput.tsx           ← 진로 입력
```

---

## 주요 불일치 사항

### 1. 🔴 로드맵 과목 데이터 구조 (CRITICAL)

| 항목 | 백엔드 API | 프론트엔드 타입 | 상태 |
|------|-----------|----------------|------|
| **데이터 타입** | `Course[]` | `RecommendedCourse[]` | ❌ 불일치 |
| **학수번호** | ✅ `courseCode` | ❌ 없음 | 🔴 누락 |
| **과목명** | ✅ `courseName` | ⚠️ `name` (다른 필드명) | 🔴 불일치 |
| **학점** | ✅ `credits` (number) | ❌ 없음 | 🔴 누락 |
| **이수구분** | ✅ `courseType` | ⚠️ `type` (다른 필드명) | 🔴 불일치 |
| **등급** | ✅ `grade` (null 가능) | ❌ 없음 | 🟡 정보 누락 |
| **평점** | ✅ `gradePoint` (null 가능) | ❌ 없음 | 🟡 정보 누락 |
| **추천 이유** | ❌ 없음 | ✅ `reason` | 🟡 백엔드 미지원 |
| **우선순위** | ❌ 없음 | ✅ `priority` (high/medium/low) | 🟡 백엔드 미지원 |
| **선수과목** | ❌ 없음 | ✅ `prerequisites` | 🟡 백엔드 미지원 |

### 2. ✅ 기술스택 데이터 구조 (일치)

| 항목 | 백엔드 API | 프론트엔드 타입 | 상태 |
|------|-----------|----------------|------|
| **데이터 타입** | `RecommendedTechStack[]` | `RecommendedTechStack[]` | ✅ 일치 |
| **모든 필드** | 동일 | 동일 | ✅ 일치 |

### 3. ✅ 성적표 파싱 구조 (대부분 일치)

| 항목 | 백엔드 API | 프론트엔드 타입 | 상태 |
|------|-----------|----------------|------|
| **응답 구조** | `{ success, data: { courses } }` | `{ success, data: TranscriptData }` | 🟡 확장됨 |
| **Course 필드** | 모든 필드 필수 | 일부 선택적 (?) | 🟢 호환 가능 |

---

## 상세 분석

### A. Course vs RecommendedCourse 구조 비교

#### 백엔드 API 명세 (docs/API_BACKEND_DOCUMENTATION.md:241-265)

```typescript
// POST /api/generate-roadmap 응답의 learningPath
{
  "learningPath": [
    {
      "period": "2025년 1학기",
      "goal": "웹 개발 기초 및 Spring Framework 학습",
      "courses": [
        {
          "courseCode": "CS301",        // 학수번호
          "courseName": "웹프로그래밍",  // 교과목명
          "courseType": "전선",          // 이수구분
          "teachingArea": null,
          "selectedArea": null,
          "credits": 3,                  // 학점
          "evaluationType": "상대평가",
          "grade": null,                 // 추천 과목이므로 null
          "gradePoint": null,
          "departmentCode": "CSE"
        }
      ],
      "activities": ["Spring Boot 토이 프로젝트"],
      "effort": "주 15시간 (12주)"
    }
  ]
}
```

#### 프론트엔드 타입 정의 (src/lib/types.ts:92-121)

```typescript
export interface RoadmapPhase {
  period: string;
  goal: string;
  courses: RecommendedCourse[];  // ❌ Course[] 아님!
  techStacks?: RecommendedTechStack[];
  activities?: string[];
  effort?: string;
}

export interface RecommendedCourse {
  name: string;              // ← courseName이 아님
  type: string;              // ← courseType이 아님
  reason: string;            // ← 백엔드 API에 없는 필드
  priority?: 'high' | 'medium' | 'low';  // ← 백엔드 API에 없는 필드
  prerequisites?: string[];  // ← 백엔드 API에 없는 필드
}
```

#### Course 정의 비교

```typescript
// 백엔드 API Course (docs:298-310)
interface Course {
  courseCode: string;        // ✅ 필수
  courseName: string;        // ✅ 필수
  courseType: string;        // ✅ 필수
  teachingArea: string | null;
  selectedArea: string | null;
  credits: number;           // ✅ 필수 (integer)
  evaluationType: string;
  grade: string;             // ✅ 필수 (null 가능)
  gradePoint: number;        // ✅ 필수 (0.0~4.5)
  departmentCode: string;    // ✅ 필수
}

// 프론트엔드 Course (src/lib/types.ts:9-30) - 실제로는 동일
export interface Course {
  courseCode: string;
  courseName: string;
  courseType: string;
  teachingArea?: string | null;  // 선택적
  selectedArea?: string | null;
  credits: number;
  evaluationType: string;
  grade: string;
  gradePoint: number;
  departmentCode?: string | null;  // 선택적
}
```

**결론**: 프론트엔드에 `Course` 타입은 정의되어 있지만, **로드맵에서는 `RecommendedCourse`를 사용** 중

---

### B. AI 프롬프트 구조 분석

#### 현재 AI 프롬프트 (src/app/api/generate-roadmap/route.ts:244-265)

```typescript
{
  "learningPath": [
    {
      "period": "2025년 겨울방학",
      "goal": "이 기간의 학습 목표",
      "courses": [
        {
          "name": "과목명 또는 강의명",           // ❌ courseName 아님
          "type": "전공필수|전공선택|교양",      // ❌ courseType 아님
          "reason": "추천 이유",                 // ❌ 백엔드 API에 없음
          "priority": "high|medium|low",        // ❌ 백엔드 API에 없음
          "prerequisites": ["선수과목1"]         // ❌ 백엔드 API에 없음
        }
      ]
    }
  ]
}
```

**문제점**:
1. AI가 생성하는 JSON 구조가 백엔드 API 명세와 **완전히 다름**
2. `courseCode`, `credits` 등 **필수 필드 누락**
3. 백엔드가 지원하지 않는 `reason`, `priority` 필드 포함

---

### C. UI 렌더링 영향 분석

#### RoadmapDisplay.tsx 문제 코드

##### 1. 과목 리스트 렌더링 (라인 86-100)

```typescript
// ❌ 현재 코드
{phase.courses.map((course, idx) => (
  <li key={idx} className="text-gray-700">
    • {course.name} ({course.type})
    {/* ↑ course.courseName, course.credits 사용 불가 */}
    {course.priority && ` - ${PRIORITY_LABELS[course.priority]}`}
  </li>
))}
```

**실제 백엔드 데이터로 렌더링 시도 시**:
```typescript
// 백엔드 응답: course.courseName = "웹프로그래밍"
course.name          // ❌ undefined
course.type          // ❌ undefined
course.priority      // ❌ undefined
```

##### 2. 상세 과목 카드 (라인 432-473)

```typescript
// ❌ 현재 코드
<div className="p-4 bg-gray-50 rounded-lg">
  <h4 className="font-semibold text-gray-800">
    {course.name}  {/* ❌ undefined */}
  </h4>
  <Badge variant="secondary" size="sm">
    {course.type}  {/* ❌ undefined */}
  </Badge>
  <p className="text-sm text-gray-600">
    {course.reason}  {/* ❌ undefined (백엔드 API에 없음) */}
  </p>
</div>
```

**표시되지 않는 정보**:
- ❌ 학수번호 (`courseCode`)
- ❌ 학점 (`credits`)
- ❌ 평가 방식 (`evaluationType`)

---

### D. 통계 계산 영향

#### 현재 통계 계산 (src/components/RoadmapDisplay.tsx:40-76)

```typescript
const stats = useMemo(() => {
  const totalCourses = learningPath.reduce(
    (sum, phase) => sum + phase.courses.length,
    0
  );

  // ❌ 학점 합계 계산 불가
  // course.credits 필드가 없음

  // ❌ 우선순위 카운트
  const priorityCount = { high: 0, medium: 0, low: 0 };
  learningPath.forEach(phase => {
    phase.courses.forEach(course => {
      if (course.priority) {  // 백엔드 API에 없는 필드
        priorityCount[course.priority]++;
      }
    });
  });

  return { totalCourses, priorityCount };
}, [learningPath]);
```

**계산 불가능한 통계**:
- ❌ 총 학점 수
- ❌ 이수구분별 학점 분포 (전공 vs 교양)
- ❌ 과목 코드 기반 중복 체크

---

## 영향 범위

### 🔴 CRITICAL - 즉시 수정 필요

#### 1. 데이터 구조 불일치
- **파일**: `src/lib/types.ts`
- **문제**: `RoadmapPhase.courses`가 `RecommendedCourse[]` 타입
- **영향**: 백엔드 API 응답 데이터 파싱 실패

#### 2. AI 프롬프트 오류
- **파일**: `src/app/api/generate-roadmap/route.ts`
- **문제**: AI가 잘못된 JSON 구조 생성
- **영향**: 백엔드 API 호출 실패 또는 검증 오류

#### 3. UI 렌더링 오류
- **파일**: `src/components/RoadmapDisplay.tsx`
- **문제**: 존재하지 않는 필드 참조 (course.name, course.type)
- **영향**: 사용자에게 빈 데이터 표시

### 🟡 MEDIUM - 기능 개선 필요

#### 4. 학점 정보 미표시
- **문제**: `credits` 필드 미사용
- **영향**: 사용자가 학점 정보를 확인할 수 없음

#### 5. 과목 코드 미표시
- **문제**: `courseCode` 필드 미사용
- **영향**: 수강 신청 시 과목 식별 어려움

### 🟢 LOW - 선택적 개선

#### 6. 추가 메타데이터 누락
- **문제**: `reason`, `priority`, `prerequisites` 백엔드 미지원
- **영향**: UX 개선 기회 상실 (우선순위 표시 등)

---

## 해결 방안

### 방안 1: 백엔드 API 명세 완전 준수 (권장 ⭐)

#### 장점
- ✅ API 명세와 100% 일치
- ✅ 백엔드 팀과의 혼란 최소화
- ✅ 데이터 무결성 보장

#### 단점
- ⚠️ 현재 프론트엔드 기능 일부 제거 (`reason`, `priority`)
- ⚠️ UI 컴포넌트 대폭 수정 필요

#### 구현 방법

##### Step 1: 타입 정의 수정
```typescript
// src/lib/types.ts
export interface RoadmapPhase {
  period: string;
  goal: string;
  courses: Course[];  // ← RecommendedCourse[] → Course[] 변경
  techStacks?: RecommendedTechStack[];
  activities?: string[];
  effort?: string;
}

// RecommendedCourse 인터페이스 제거
```

##### Step 2: AI 프롬프트 수정
```typescript
// src/app/api/generate-roadmap/route.ts (라인 244-265)
{
  "learningPath": [
    {
      "period": "2025년 1학기",
      "goal": "웹 개발 기초",
      "courses": [
        {
          "courseCode": "CS301",
          "courseName": "웹프로그래밍",
          "courseType": "전공선택",
          "teachingArea": null,
          "selectedArea": null,
          "credits": 3,
          "evaluationType": "상대평가",
          "grade": null,
          "gradePoint": null,
          "departmentCode": "CSE"
        }
      ],
      "techStacks": [/* 기존 구조 유지 */],
      "activities": ["Spring Boot 토이 프로젝트"],
      "effort": "주 15시간"
    }
  ]
}
```

##### Step 3: UI 컴포넌트 수정
```typescript
// src/components/RoadmapDisplay.tsx (라인 93-98)
<li key={idx} className="text-gray-700">
  • [{course.courseCode}] {course.courseName}
  ({course.credits}학점, {course.courseType})
</li>
```

---

### 방안 2: 하이브리드 접근 (메타데이터 별도 관리)

#### 장점
- ✅ 백엔드 API 호환성 유지
- ✅ 프론트엔드 UX 기능 보존 (`reason`, `priority`)
- ✅ 점진적 마이그레이션 가능

#### 단점
- ⚠️ 복잡도 증가
- ⚠️ AI 프롬프트에 추가 지시 필요

#### 구현 방법

##### Step 1: 확장 타입 정의
```typescript
// src/lib/types.ts
export interface EnhancedCourse extends Course {
  // 프론트엔드 전용 메타데이터
  _metadata?: {
    reason?: string;
    priority?: 'high' | 'medium' | 'low';
    prerequisites?: string[];
  };
}

export interface RoadmapPhase {
  period: string;
  goal: string;
  courses: EnhancedCourse[];  // ← 확장 타입 사용
  techStacks?: RecommendedTechStack[];
  activities?: string[];
  effort?: string;
}
```

##### Step 2: AI 프롬프트 수정
```typescript
{
  "courses": [
    {
      "courseCode": "CS301",
      "courseName": "웹프로그래밍",
      "courseType": "전공선택",
      "credits": 3,
      // ... 필수 필드
      "_metadata": {
        "reason": "Spring Framework 기초 학습",
        "priority": "high",
        "prerequisites": ["Java 프로그래밍"]
      }
    }
  ]
}
```

##### Step 3: UI 렌더링 수정
```typescript
<li>
  [{course.courseCode}] {course.courseName}
  ({course.credits}학점, {course.courseType})
  {course._metadata?.priority && ` - ${PRIORITY_LABELS[course._metadata.priority]}`}
</li>
```

---

### 방안 3: 백엔드 API 명세 변경 요청

#### 장점
- ✅ 프론트엔드 코드 최소 수정
- ✅ UX 기능 완전 보존

#### 단점
- ⚠️ 백엔드 팀 협의 필요
- ⚠️ API 버전 관리 필요
- ⚠️ 다른 클라이언트에 영향 가능

#### 제안 내용
```typescript
// 백엔드 API에 추가 요청할 필드
interface Course {
  // ... 기존 필드

  // 추가 요청 필드
  recommendationReason?: string;     // 추천 이유
  recommendationPriority?: string;   // 우선순위
  prerequisites?: string[];          // 선수과목
}
```

---

## 우선순위 및 로드맵

### Phase 1: 긴급 수정 (1-2일)

#### 🔴 CRITICAL 이슈 해결
- [ ] **타입 정의 수정** (`RoadmapPhase.courses: Course[]`)
  - 파일: `src/lib/types.ts`
  - 예상 시간: 30분

- [ ] **AI 프롬프트 수정** (백엔드 API 구조 준수)
  - 파일: `src/app/api/generate-roadmap/route.ts`
  - 예상 시간: 1-2시간

- [ ] **UI 컴포넌트 필드명 수정**
  - 파일: `src/components/RoadmapDisplay.tsx`
  - 변경: `course.name` → `course.courseName`
  - 변경: `course.type` → `course.courseType`
  - 예상 시간: 1시간

#### 테스트
- [ ] Mock 데이터로 렌더링 확인
- [ ] 실제 API 연동 테스트

### Phase 2: 기능 개선 (3-5일)

#### 🟡 MEDIUM 개선 사항
- [ ] **학점 정보 시각화**
  - 총 학점 수 표시
  - 이수구분별 학점 분포 차트
  - 예상 시간: 2-3시간

- [ ] **과목 코드 표시**
  - 과목 카드에 학수번호 추가
  - 수강 신청 링크 생성 (선택)
  - 예상 시간: 1-2시간

- [ ] **통계 계산 개선**
  - 학점 기반 통계 추가
  - 과목 타입별 분포 시각화
  - 예상 시간: 2-3시간

### Phase 3: UX 향상 (선택적)

#### 🟢 LOW 개선 사항
- [ ] **백엔드와 메타데이터 협의**
  - `reason`, `priority` 필드 추가 협의
  - API 버전 관리 계획 수립

- [ ] **프론트엔드 임시 메타데이터 관리**
  - AI 프롬프트에 `_metadata` 추가
  - UI에서 메타데이터 활용

- [ ] **Mock 데이터 업데이트**
  - `src/mocks/roadmap-*.json` 파일 수정
  - 백엔드 API 구조와 일치시킴

---

## 권장 사항

### 즉시 실행
1. **백엔드 팀과 긴급 회의**
   - `reason`, `priority`, `prerequisites` 필드 지원 가능 여부 확인
   - API 명세 최종 확정

2. **타입 정의 우선 수정**
   - `Course` 기반으로 통일
   - `RecommendedCourse` 제거 또는 확장 타입으로 변경

3. **AI 프롬프트 수정**
   - 백엔드 API 구조에 맞게 조정
   - 필수 필드 누락 방지

### 중기 계획
1. **UI/UX 개선**
   - 학점, 과목 코드 등 추가 정보 표시
   - 통계 시각화 강화

2. **테스트 코드 작성**
   - API 응답 파싱 테스트
   - UI 렌더링 테스트

3. **문서화**
   - API 변경 이력 관리
   - 프론트엔드 타입 가이드 작성

### 장기 비전
1. **API 버전 관리**
   - Semantic Versioning 도입
   - Backward Compatibility 보장

2. **타입 안정성 강화**
   - Zod 또는 Yup 스키마 검증 도입
   - Runtime Type Checking

3. **E2E 테스트**
   - 파일 업로드 → 로드맵 생성 전체 플로우 테스트

---

## 부록

### A. 파일별 수정 체크리스트

#### `src/lib/types.ts`
- [ ] `RoadmapPhase.courses` 타입 변경 (`Course[]`)
- [ ] `RecommendedCourse` 제거 또는 `EnhancedCourse`로 변경
- [ ] JSDoc 주석 추가

#### `src/app/api/generate-roadmap/route.ts`
- [ ] AI 프롬프트 JSON 구조 수정 (라인 237-279)
- [ ] 응답 검증 로직 추가
- [ ] 에러 핸들링 개선

#### `src/components/RoadmapDisplay.tsx`
- [ ] 과목 리스트 렌더링 수정 (라인 86-100)
- [ ] 상세 과목 카드 수정 (라인 432-473)
- [ ] 통계 계산 로직 수정 (라인 40-76)
- [ ] 학점 정보 시각화 추가

#### `src/mocks/roadmap-*.json`
- [ ] Mock 데이터 구조 업데이트
- [ ] `courses` 필드를 `Course` 타입으로 변경

### B. 테스트 시나리오

#### 단위 테스트
```typescript
describe('RoadmapPhase', () => {
  it('Course 타입의 courses 배열을 가져야 함', () => {
    const phase: RoadmapPhase = {
      period: "2025년 1학기",
      goal: "테스트 목표",
      courses: [{
        courseCode: "CS101",
        courseName: "테스트 과목",
        courseType: "전공필수",
        credits: 3,
        // ... 필수 필드
      }]
    };

    expect(phase.courses[0].courseCode).toBe("CS101");
    expect(phase.courses[0].credits).toBe(3);
  });
});
```

#### 통합 테스트
```typescript
describe('Roadmap Generation E2E', () => {
  it('백엔드 API 응답을 올바르게 파싱해야 함', async () => {
    const response = await generateRoadmap(mockTranscript, mockCareerGoal);

    expect(response.success).toBe(true);
    expect(response.data.learningPath[0].courses[0]).toHaveProperty('courseCode');
    expect(response.data.learningPath[0].courses[0]).toHaveProperty('credits');
  });
});
```

### C. 참고 자료

#### 백엔드 API 문서
- 위치: `docs/API_BACKEND_DOCUMENTATION.md`
- Base URL: `https://hackathon.yeo-li.com`
- API 버전: v0

#### 관련 이슈
- [ ] #001: 로드맵 과목 정보 표시 오류
- [ ] #002: 학점 정보 누락
- [ ] #003: AI 프롬프트 응답 구조 불일치

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0 | 2024-12-23 | Claude Code | 초안 작성 |

---

**문서 끝**
