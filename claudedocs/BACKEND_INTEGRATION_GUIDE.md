# Backend API Integration Guide

완익세종 프로젝트의 백엔드 API 통합 가이드입니다.

## 📋 목차

1. [개요](#개요)
2. [아키텍처](#아키텍처)
3. [환경 설정](#환경-설정)
4. [API 우선순위](#api-우선순위)
5. [타입 시스템](#타입-시스템)
6. [사용 예시](#사용-예시)
7. [트러블슈팅](#트러블슈팅)

---

## 개요

이 프로젝트는 **3가지 API 모드**를 지원합니다:

1. **Mock Mode**: 로컬 Mock 데이터 사용 (개발용)
2. **Backend Mode**: 외부 Spring Boot API 호출 (`https://hackathon.yeo-li.com`)
3. **Local Mode**: Next.js API Routes 사용 (Google Gemini)

### 백엔드 API 명세

- **Base URL**: `https://hackathon.yeo-li.com`
- **API Version**: v0
- **문서**: [docs/API_BACKEND_DOCUMENTATION.md](../docs/API_BACKEND_DOCUMENTATION.md)

---

## 아키텍처

### 파일 구조

```
src/
├── lib/
│   ├── types/
│   │   └── backend.types.ts          # 백엔드 API 타입 정의
│   ├── adapters/
│   │   └── backend-adapter.ts        # 데이터 변환 로직
│   ├── config.ts                     # 환경 설정
│   └── api-client.ts                 # 통합 API 클라이언트
└── app/api/
    ├── parse-excel/route.ts          # Local API: Excel 파싱
    └── generate-roadmap/route.ts     # Local API: AI 로드맵 생성
```

### 데이터 흐름

```
┌─────────────────────────────────────────────────────────┐
│                     api-client.ts                       │
│                                                         │
│  1. Mock Mode      → mock-service.ts                   │
│  2. Backend Mode   → backend API (Spring Boot)         │
│  3. Local Mode     → Next.js API Routes → Gemini API   │
└─────────────────────────────────────────────────────────┘
                            ↓
                   backend-adapter.ts
                   (데이터 변환)
                            ↓
                  Frontend Components
```

---

## 환경 설정

### .env.local 파일 생성

```bash
cp .env.example .env.local
```

### 환경 변수 설정 (3개만 사용)

**필수 환경 변수**:
1. `NEXT_PUBLIC_USE_MOCK` - Mock 모드 활성화 여부
2. `GEMINI_API_KEY` - Google Gemini API 키
3. `NEXT_PUBLIC_API_URL` - API URL (localhost 또는 외부 URL)

#### 1. Mock Mode (개발용)

```bash
NEXT_PUBLIC_USE_MOCK=true
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 2. Backend Mode (외부 API)

```bash
NEXT_PUBLIC_USE_MOCK=false
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=https://hackathon.yeo-li.com
```

**자동 감지**: `NEXT_PUBLIC_API_URL`이 외부 URL이면 자동으로 Backend Mode로 전환됩니다.

#### 3. Local Mode (Gemini AI)

```bash
NEXT_PUBLIC_USE_MOCK=false
GEMINI_API_KEY=your_actual_api_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## API 우선순위

### 자동 Fallback 시스템

```typescript
// 1순위: Mock Data
if (config.useMock) {
  return mockData();
}

// 2순위: Backend API
if (config.backend.enabled) {
  try {
    return await callBackendAPI();
  } catch (error) {
    // 백엔드 실패 시 자동으로 Local API로 Fallback
  }
}

// 3순위: Local API
return await callLocalAPI();
```

### Timeout 설정

- **Backend API**: 10초 (설정 가능)
- **Local API**: 2분 (기본값)

---

## 타입 시스템

### Frontend 타입 vs Backend 타입

#### Frontend Course

```typescript
interface Course {
  courseCode: string;
  courseName: string;
  courseType: string;
  credits: number;
  grade: string;
  gradePoint: number;
  // ...
}
```

#### Backend Course

```typescript
interface BackendCourse {
  completedYear: number;        // 추가 필드
  completedSemester: number;    // 추가 필드
  courseCode: string;
  courseName: string;
  courseType: string;
  credits: number;              // double
  grade: string;
  gradePoint: number;           // double
  // ...
}
```

### 데이터 변환

```typescript
import {
  toBackendTranscript,
  fromBackendTranscript,
  toBackendCareerGoal,
  fromBackendRoadmap,
} from '@/lib/adapters/backend-adapter';

// Frontend → Backend
const backendData = toBackendTranscript(frontendTranscript);

// Backend → Frontend
const frontendData = fromBackendTranscript(backendResponse);
```

---

## 사용 예시

### 1. Excel 파일 파싱

```typescript
import { parseExcel } from '@/lib/api-client';

const handleFileUpload = async (file: File) => {
  const response = await parseExcel(file);

  if (response.success && response.data) {
    console.log('Parsed transcript:', response.data);
    console.log('Total credits:', response.data.totalCredits);
    console.log('Average GPA:', response.data.averageGPA);
  } else {
    console.error('Error:', response.error);
  }
};
```

### 2. AI 로드맵 생성

```typescript
import { generateRoadmap } from '@/lib/api-client';

const handleGenerateRoadmap = async (
  transcript: TranscriptData,
  careerGoal: CareerGoal
) => {
  const response = await generateRoadmap(transcript, careerGoal);

  if (response.success && response.data) {
    console.log('Roadmap:', response.data);
    console.log('Career summary:', response.data.careerSummary);
    console.log('Learning path:', response.data.learningPath);
  } else {
    console.error('Error:', response.error);
  }
};
```

### 3. 가중치 힌트 조회 (Backend Only)

```typescript
import { getWeightHints } from '@/lib/api-client';

const handleGetWeightHints = async (careerGoal: string) => {
  const hints = await getWeightHints(careerGoal);

  if (hints) {
    console.log('Matched sectors:', hints.matchedSectors);
    console.log('Weight rules:', hints.weightRules);
  } else {
    console.log('Weight hints not available (backend mode required)');
  }
};
```

### 4. 과목 점수 평가 (Backend Only)

```typescript
import { scoreSubjects } from '@/lib/api-client';

const handleScoreSubjects = async (
  careerGoal: string,
  subjects: SubjectSummary[]
) => {
  const result = await scoreSubjects({
    careerGoal,
    subjects,
    topN: 10,
  });

  if (result) {
    console.log('Top subjects:', result.subjects);
    result.subjects.forEach((scored) => {
      console.log(`${scored.subject.courseName}: ${scored.score} points`);
      console.log(`Reasons: ${scored.reasons.join(', ')}`);
    });
  }
};
```

### 5. Health Check

```typescript
import { healthCheck } from '@/lib/api-client';

const checkAPIs = async () => {
  const status = await healthCheck();

  console.log('Backend API:', status.backend ? '✅' : '❌');
  console.log('Local API:', status.local ? '✅' : '❌');
};
```

---

## 트러블슈팅

### 1. Backend API Timeout

**증상**: "Backend API timeout" 에러

**해결방법**:

```typescript
// config.ts에서 timeout 조정
backend: {
  timeout: 30000, // 30초로 증가
}
```

### 2. CORS 에러

**증상**: "Access-Control-Allow-Origin" 에러

**해결방법**:
- 백엔드 API에서 CORS 설정 확인 필요
- 프론트엔드 origin이 허용되었는지 확인

### 3. 타입 불일치

**증상**: 백엔드 응답 파싱 실패

**해결방법**:

```typescript
// backend-adapter.ts의 validation 함수 사용
import { validateBackendTranscript } from '@/lib/adapters/backend-adapter';

try {
  validateBackendTranscript(backendData);
} catch (error) {
  console.error('Invalid backend data:', error.message);
}
```

### 4. API 모드 확인

```typescript
import { getApiSource } from '@/lib/config';

console.log('Current API source:', getApiSource());
// 출력: 'mock' | 'backend' | 'local'
```

### 5. 로그 확인

모든 API 호출은 console에 로그가 출력됩니다:

```
📊 parseExcel - Using API source: backend
🌐 Backend API 요청: { method: 'POST', url: 'https://...' }
```

---

## 추가 정보

### Backend API 문서

전체 백엔드 API 명세는 [docs/API_BACKEND_DOCUMENTATION.md](../docs/API_BACKEND_DOCUMENTATION.md)를 참조하세요.

### 타입 정의

- Frontend 타입: [src/lib/types.ts](../src/lib/types.ts)
- Backend 타입: [src/lib/types/backend.types.ts](../src/lib/types/backend.types.ts)

### 데이터 변환

- Adapter 함수: [src/lib/adapters/backend-adapter.ts](../src/lib/adapters/backend-adapter.ts)

---

## 🎯 Quick Start Checklist

- [ ] `.env.local` 파일 생성
- [ ] 3개 환경 변수 설정:
  - `NEXT_PUBLIC_USE_MOCK` (true/false)
  - `GEMINI_API_KEY` (your API key)
  - `NEXT_PUBLIC_API_URL` (localhost 또는 외부 URL)
- [ ] `npm run dev` 실행
- [ ] 개발자 도구 Console에서 API 로그 확인

**참고**: Backend Mode는 `NEXT_PUBLIC_API_URL`이 외부 URL일 때 자동으로 활성화됩니다.

---

**문서 작성일**: 2025-12-24
**최종 수정일**: 2025-12-24
**작성자**: Claude Code (AI Assistant)
