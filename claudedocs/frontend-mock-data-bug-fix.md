# Frontend Mock Data Bug Fix

## Issue
When user inputs "프론트엔드 개발자" as career path, the system was returning backend mock data instead of frontend mock data.

## Root Cause
The `mockGenerateRoadmap()` function in [src/lib/mock-service.ts](../src/lib/mock-service.ts) was hardcoded to always return `roadmapBackend` regardless of the career path input.

```typescript
// ❌ Previous buggy code
const customizedRoadmap: Roadmap = {
  ...roadmapBackend,  // Always backend!
  careerSummary: `${careerGoal.careerPath}는 ${roadmapBackend.careerSummary.split('는 ')[1]}`,
  generatedAt: new Date().toISOString(),
} as Roadmap;
```

## Architecture Context
The app has two paths for mock data:

**Path 1: Client-side mock** (was broken)
- `api-client.ts` checks `config.useMock`
- If true, calls `mockGenerateRoadmap()` from `mock-service.ts` directly
- Bypasses API route entirely
- ❌ Was returning only backend data

**Path 2: Server-side mock** (was working)
- `api-client.ts` calls `/api/generate-roadmap`
- API route checks `process.env.NEXT_PUBLIC_USE_MOCK`
- If true, uses `getMockRoadmap()` with career path normalization
- ✅ Was working correctly

## Solution
Added career path normalization logic to `mock-service.ts` to match the API route implementation:

1. **Added imports** for all three roadmap types:
   - `roadmapBackend` (AI/Backend/Data Science)
   - `roadmapFrontend` (Frontend/Web/Mobile)
   - `roadmapServer` (DevOps/Infrastructure)

2. **Added `normalizeCareerPath()` function**:
   - Maps Korean career names to English keys
   - Examples:
     - "프론트엔드 개발자" → "frontend"
     - "백엔드 개발자" → "backend"
     - "DevOps 엔지니어" → "server"

3. **Added `getMockRoadmap()` function**:
   - Uses normalized career path to select correct mock data
   - Returns appropriate roadmap based on career input

4. **Updated `mockGenerateRoadmap()`**:
   - Now calls `getMockRoadmap(careerGoal.careerPath)` instead of hardcoded `roadmapBackend`
   - Dynamically selects correct mock data based on career path

## Code Changes

### Before
```typescript
const customizedRoadmap: Roadmap = {
  ...roadmapBackend,  // Always backend
  // ...
};
```

### After
```typescript
const baseMockRoadmap = getMockRoadmap(careerGoal.careerPath);  // Dynamic selection

const customizedRoadmap: Roadmap = {
  ...baseMockRoadmap,  // Uses correct roadmap
  // ...
};
```

## Career Path Mapping Rules

| Input Pattern | Normalized Key | Mock Data |
|---------------|----------------|-----------|
| "프론트엔드", "frontend", "웹", "모바일", "앱" | `frontend` | roadmap-frontend.json |
| "백엔드", "backend", "AI", "ML", "데이터" | `backend` | roadmap-backend.json |
| "DevOps", "인프라", "클라우드", "서버 운영" | `server` | roadmap-server.json |
| "풀스택", "fullstack" | `frontend` | roadmap-frontend.json |
| "게임" | `backend` | roadmap-backend.json |
| Default | `backend` | roadmap-backend.json |

## Testing
1. Input "프론트엔드 개발자" → Should return React, Tailwind CSS, Vite tech stacks
2. Input "백엔드 개발자" → Should return Python, NumPy, Pandas tech stacks
3. Input "DevOps 엔지니어" → Should return Linux, Docker, Bash tech stacks

## Files Modified
- [src/lib/mock-service.ts](../src/lib/mock-service.ts)
  - Added imports for roadmapFrontend and roadmapServer
  - Added normalizeCareerPath() function (lines 29-86)
  - Added getMockRoadmap() function (lines 91-100)
  - Updated mockGenerateRoadmap() to use getMockRoadmap() (lines 160-168)
  - Renamed public export from getMockRoadmap to getSampleRoadmap to avoid confusion

## Related Files
- [src/app/api/generate-roadmap/route.ts](../src/app/api/generate-roadmap/route.ts) - Contains identical logic for server-side mock
- [src/mocks/roadmap-frontend.json](../src/mocks/roadmap-frontend.json) - Frontend developer roadmap data
- [src/mocks/roadmap-backend.json](../src/mocks/roadmap-backend.json) - Backend/AI developer roadmap data
- [src/mocks/roadmap-server.json](../src/mocks/roadmap-server.json) - DevOps/Server engineer roadmap data

## Verification
✅ TypeScript compilation passes: `npx tsc --noEmit`
✅ All three career paths now return correct mock data
✅ Tech stacks are career-specific (React for frontend, Python for backend, Docker for DevOps)
