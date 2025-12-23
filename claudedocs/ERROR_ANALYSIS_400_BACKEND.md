# Error Analysis: 400 Bad Request from Backend API

**Date**: 2025-12-24
**Error**: `POST https://hackathon.yeo-li.com/api/generate-roadmap 400 (Bad Request)`
**Environment**: Backend Mode (NEXT_PUBLIC_API_URL=https://hackathon.yeo-li.com)

---

## 🔍 Root Cause Analysis

### Symptom
Frontend sends roadmap generation request to backend API and receives `400 Bad Request` with minimal error information:

```json
{
  "timestamp": "2025-12-24T03:27:25.967+09:00",
  "status": 400,
  "error": "Bad Request",
  "path": "/api/generate-roadmap"
}
```

### Root Cause

**The frontend is sending the request to the backend API with the LOCAL API payload format instead of the BACKEND API format.**

#### What's Happening

1. **Environment Configuration** (`.env.local`):
   ```bash
   NEXT_PUBLIC_USE_MOCK=false
   NEXT_PUBLIC_API_URL=https://hackathon.yeo-li.com
   ```

2. **Config Detection** ([src/lib/config.ts](../src/lib/config.ts)):
   - ✅ Correctly detects `config.backend.enabled = true`
   - ✅ Correctly detects external URL

3. **API Client Flow** ([src/lib/api-client.ts:157-262](../src/lib/api-client.ts)):
   - ✅ Backend mode is enabled
   - ✅ Calls `fetchBackendGenerateRoadmap()` (line 184)
   - ❌ **Problem**: `fetchBackendGenerateRoadmap()` **throws an error**
   - ❌ **Critical Issue**: Falls back to "Local API" mode (line 207-209)
   - ❌ **Bug**: "Local API" mode uses `config.api.baseUrl` which is **still pointing to the backend URL**
   - ❌ Sends **frontend format payload** to **backend URL** → 400 Bad Request

### Code Analysis

**Line 180-210** in `api-client.ts`:

```typescript
// 2. Backend mode: Call external Spring Boot API
if (config.backend.enabled) {
  console.log('🌐 Calling Backend API:', config.backend.baseUrl);
  try {
    const backendResult = await fetchBackendGenerateRoadmap(
      transcript,
      typeof careerGoal === 'string' ? careerGoal : careerGoal
    );

    // ... success handling ...
  } catch (error) {
    console.error('❌ Backend API error, falling back to local API:', error);
    // ⚠️ BUG: Falls through to "Local API" mode below
  }
}

// 3. Local mode: Call Next.js API Routes
console.log('🌐 Calling Local API');  // ⚠️ This is misleading
try {
  const apiUrl = `${config.api.baseUrl}/api/generate-roadmap`;
  // ⚠️ BUG: config.api.baseUrl is https://hackathon.yeo-li.com
  // ⚠️ Sends frontend format payload to backend URL!

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript,  // ❌ Frontend format
      careerGoal:  // ❌ Frontend format (object)
        typeof careerGoal === 'string'
          ? { careerPath: careerGoal }
          : careerGoal,
    }),
  });
  // ...
}
```

### Payload Format Mismatch

#### Frontend Payload (What's Being Sent)
```json
{
  "transcript": {
    "courses": [...],
    "totalCredits": 65.0,
    "totalMajorCredits": 50,
    "totalGeneralCredits": 15,
    "averageGPA": 4.2
  },
  "careerGoal": {
    "careerPath": "백엔드 개발자...",
    "interests": ["Spring Boot", "Database"],
    "additionalInfo": "대기업 취업 희망"
  }
}
```

#### Backend API Expects ([API_BACKEND_DOCUMENTATION.md](../docs/API_BACKEND_DOCUMENTATION.md))
```json
{
  "transcript": {
    "courses": [
      {
        "completedYear": 2023,        // ⚠️ Required in backend
        "completedSemester": 1,        // ⚠️ Required in backend
        "courseCode": "CS101",
        "courseName": "프로그래밍 기초",
        "courseType": "전공필수",
        "teachingArea": null,
        "selectedArea": null,
        "credits": 3.0,
        "evaluationType": "절대평가",
        "grade": "A+",
        "gradePoint": 4.5,
        "departmentCode": "COMP"
      }
    ],
    "totalCredits": 65.0,
    "totalMajorCredits": 50,
    "totalGeneralCredits": 15,
    "averageGPA": 4.2
  },
  "careerGoal": "백엔드 개발자를 목표로 하고 있습니다. Spring Boot, 데이터베이스, 클라우드에 관심이 있으며, 대기업 취업을 희망합니다."
}
```

### Key Differences

1. **`careerGoal` format**:
   - Frontend sends: `{ careerPath, interests, additionalInfo }` (object)
   - Backend expects: `"백엔드 개발자..."` (string)

2. **`courses` fields**:
   - Frontend courses: Missing `completedYear` and `completedSemester`
   - Backend courses: Requires `completedYear` and `completedSemester`

3. **Adapter NOT being used**:
   - `toBackendTranscript()` and `toBackendCareerGoal()` exist but are NOT called in fallback path
   - Only used in `fetchBackendGenerateRoadmap()` which throws before reaching backend

---

## 🐛 Why `fetchBackendGenerateRoadmap()` Throws

Looking at [api-client.ts:268-313](../src/lib/api-client.ts):

```typescript
async function fetchBackendGenerateRoadmap(
  transcript: TranscriptData,
  careerGoal: CareerGoal | string
): Promise<BackendGenerateRoadmapResponse> {
  const apiUrl = `${config.backend.baseUrl}/api/generate-roadmap`;
  console.log('🌐 Backend API 요청:', { method: 'POST', url: apiUrl });

  // ... timeout logic ...

  try {
    // ✅ Convert frontend data to backend format
    const backendTranscript = toBackendTranscript(transcript);
    const backendCareerGoal =
      typeof careerGoal === 'string' ? careerGoal : toBackendCareerGoal(careerGoal);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript: backendTranscript,
        careerGoal: backendCareerGoal,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend API 에러:', errorText);
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const result: BackendGenerateRoadmapResponse = await response.json();
    return result;
  } catch (error) {
    // ...
    throw error;  // ⚠️ This throw causes fallback to "Local API" mode
  }
}
```

**This function should work correctly**, BUT there could be:
1. **CORS errors** (browser blocks the request)
2. **Network errors** (DNS, SSL, firewall)
3. **Timeout errors** (slow backend response)
4. **Actual backend errors** (backend returns 400/500)

Without seeing the actual network request in browser DevTools, we can't confirm which error is occurring FIRST.

---

## 🔧 Fix Strategy

### Option 1: Remove Fallback (Recommended)

**When in Backend Mode, DO NOT fallback to Local API.**

```typescript
// 2. Backend mode: Call external Spring Boot API
if (config.backend.enabled) {
  console.log('🌐 Calling Backend API:', config.backend.baseUrl);
  const backendResult = await fetchBackendGenerateRoadmap(
    transcript,
    typeof careerGoal === 'string' ? careerGoal : careerGoal
  );

  if (backendResult.success && backendResult.data) {
    validateBackendRoadmap(backendResult.data);
    console.log('✅ Backend API Success');
    return {
      success: true,
      data: fromBackendRoadmap(backendResult.data),
      message: '백엔드 API: 로드맵 생성 완료',
    };
  }

  return {
    success: false,
    error: backendResult.error || '백엔드 API 오류',
  };
}

// 3. Local mode: Call Next.js API Routes
// ... (only reached if config.backend.enabled === false)
```

**Benefits**:
- Clear separation: Backend Mode → Backend API only
- Errors are properly caught and returned to user
- No confusing fallback behavior

**Drawbacks**:
- No automatic fallback if backend is down

### Option 2: Fix Fallback URL Detection

**Make "Local API" actually point to localhost when falling back.**

```typescript
// 3. Local/Fallback mode: Call Next.js API Routes
const isFallback = config.backend.enabled;  // True if we fell back from backend
const localApiUrl = isFallback
  ? 'http://localhost:3000'  // Fallback to actual local API
  : config.api.baseUrl;       // Normal local mode

console.log(isFallback ? '🔄 Fallback to Local API' : '🌐 Calling Local API');
const apiUrl = `${localApiUrl}/api/generate-roadmap`;
```

**Benefits**:
- Maintains fallback behavior for resilience
- Falls back to Gemini AI on localhost

**Drawbacks**:
- More complex logic
- May hide backend connectivity issues
- Requires Gemini API key setup

### Option 3: Fix Adapter in Fallback Path (Not Recommended)

**Use backend adapters even in fallback path.**

This doesn't make sense because if we're falling back, we should fall back to the LOCAL API on localhost, not send backend-formatted requests to the backend URL again.

---

## ✅ Recommended Fix

**Implement Option 1: Remove fallback when in Backend Mode.**

Changes needed in `src/lib/api-client.ts`:

1. Remove `try-catch` fallback in Backend Mode section
2. Return error directly if backend fails
3. Ensure "Local API" section is only reached when `config.backend.enabled === false`

---

## 📊 Testing Checklist

After fix:

- [ ] Backend Mode: Request goes to `https://hackathon.yeo-li.com` with correct payload
- [ ] Backend Mode: 400 errors are properly logged and returned to user
- [ ] Local Mode: Request goes to `http://localhost:3000` with Gemini API
- [ ] Mock Mode: Uses mock data, no API calls
- [ ] Error messages are user-friendly (not just "HTTP error! status: 400")

---

## 🔗 Related Files

- **Issue**: [src/lib/api-client.ts:180-262](../src/lib/api-client.ts)
- **Documentation**: [docs/API_BACKEND_DOCUMENTATION.md](../docs/API_BACKEND_DOCUMENTATION.md)
- **Adapters**: [src/lib/adapters/backend-adapter.ts](../src/lib/adapters/backend-adapter.ts)
- **Config**: [src/lib/config.ts](../src/lib/config.ts)
- **Environment**: [.env.local](../.env.local)

---

**Conclusion**: The 400 error is caused by sending frontend-formatted payload to the backend API due to incorrect fallback behavior. Fix by removing fallback in Backend Mode or properly detecting fallback scenario.
