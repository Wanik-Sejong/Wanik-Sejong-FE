# 완익세종 (Wanik-Sejong)

> AI 기반 진로-교과목 로드맵 추천 서비스

세종대학교 학생들을 위한 맞춤형 학습 로드맵 생성 시스템입니다. 성적표와 희망 진로를 입력하면 AI가 개인화된 학습 경로를 추천합니다.

---

## 🎯 주요 기능

1. **📊 성적표 업로드** - Excel 파일 드래그 앤 드롭 지원
2. **🎓 진로 입력** - 희망 진로 및 관심 분야 입력
3. **🤖 AI 로드맵 생성** - GPT-4o 기반 맞춤형 학습 경로 추천
4. **📈 역량 분석** - 현재 강점과 보완 필요 영역 분석
5. **🗓️ 타임라인 뷰** - 학기별 추천 과목 및 활동 제시

---

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```bash
# Development Mode (Mock Data)
NEXT_PUBLIC_USE_MOCK=true

# Production Mode (OpenAI API Required)
# NEXT_PUBLIC_USE_MOCK=false
# OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 🔧 개발/프로덕션 모드

### 개발 모드 (Mock Data)

- **설정**: `NEXT_PUBLIC_USE_MOCK=true`
- **특징**: 로컬에서 완전 독립 실행
- **데이터**: [src/mocks/](src/mocks/) 디렉토리의 JSON 파일 사용
- **API**: Mock 서비스 ([src/lib/mock-service.ts](src/lib/mock-service.ts))

### 프로덕션 모드 (Real API)

- **설정**: `NEXT_PUBLIC_USE_MOCK=false`
- **필수**: OpenAI API 키 필요
- **데이터**: 실제 Excel 파싱 및 AI 로드맵 생성
- **API**: Next.js API Routes ([src/app/api/](src/app/api/))

---

## 📁 프로젝트 구조

```
wanik-sejong/
├── src/
│   ├── app/                       # Next.js 16 App Router
│   │   ├── page.tsx              # 홈페이지 (업로드 + 진로 입력)
│   │   ├── roadmap/page.tsx      # 로드맵 결과 페이지
│   │   ├── showcase/page.tsx     # UI 컴포넌트 쇼케이스
│   │   └── api/                  # API Routes (프로덕션용)
│   │       ├── parse-excel/route.ts
│   │       └── generate-roadmap/route.ts
│   ├── components/
│   │   ├── FileUpload.tsx        # 성적표 업로드 컴포넌트
│   │   ├── CareerInput.tsx       # 진로 입력 컴포넌트
│   │   ├── RoadmapDisplay.tsx    # 로드맵 표시 컴포넌트
│   │   └── ui/                   # shadcn 스타일 UI 라이브러리
│   ├── lib/
│   │   ├── config.ts             # 환경 설정
│   │   ├── types.ts              # TypeScript 타입 정의
│   │   ├── api-client.ts         # API 클라이언트 (모드 전환)
│   │   └── mock-service.ts       # Mock 서비스
│   ├── mocks/
│   │   ├── courses.json          # Mock 성적표 데이터
│   │   └── roadmap.json          # Mock 로드맵 데이터
│   └── styles/
│       └── colors.ts             # 세종대 브랜드 컬러 시스템
├── docs/
│   ├── PRD.md                    # 프로덕트 요구사항 문서
│   ├── Simple-PRD.md             # 간소화된 PRD (MVP)
│   ├── WORKFLOW.md               # 48시간 해커톤 워크플로우
│   ├── WORKFLOW-SIMPLE.md        # 24시간 MVP 워크플로우
│   └── COMPONENTS.md             # UI 컴포넌트 문서
└── public/
    └── images/logos/             # 세종대 로고 등 이미지
```

---

## 🎨 UI 컴포넌트 라이브러리

shadcn/ui 스타일의 재사용 가능한 컴포넌트:

- **Layout**: Card, Hero, ProcessFlow, Timeline
- **Form**: Input, Textarea, Select, Button
- **Data Display**: DonutChart, BarChart, ProgressBar
- **Badge**: Badge, Tag, StatusBadge

자세한 사용법: [docs/COMPONENTS.md](docs/COMPONENTS.md)

컴포넌트 쇼케이스: [http://localhost:3000/showcase](http://localhost:3000/showcase)

---

## 🔄 워크플로우

### 사용자 플로우

1. **성적표 업로드** → 2. **진로 입력** → 3. **AI 로드맵 확인**

### 기술 플로우 (개발 모드)

```
FileUpload → parseExcel (mock) → CareerInput → generateRoadmap (mock) → RoadmapDisplay
```

### 기술 플로우 (프로덕션 모드)

```
FileUpload → /api/parse-excel (xlsx) → CareerInput → /api/generate-roadmap (OpenAI) → RoadmapDisplay
```

---

## 🧪 테스트

### 개발 모드에서 테스트

1. 서버 실행: `npm run dev`
2. Mock 모드 확인: 홈페이지 상단에 "개발 모드 (Mock Data)" 뱃지 표시
3. 아무 Excel 파일이나 업로드 (파일 내용 무시, mock 데이터 사용)
4. 진로 입력: 예) "AI/ML 엔지니어"
5. 로드맵 확인: [src/mocks/roadmap.json](src/mocks/roadmap.json) 데이터 표시

### 프로덕션 모드 테스트

1. `.env.local` 수정:
   ```
   NEXT_PUBLIC_USE_MOCK=false
   OPENAI_API_KEY=sk-...
   ```
2. 서버 재시작: `npm run dev`
3. 실제 세종대 성적표 Excel 파일 업로드
4. 진로 입력 후 AI 로드맵 생성 (10-20초 소요)

---

## 📦 빌드 & 배포

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

### Vercel 배포

1. GitHub에 푸시
2. Vercel에 프로젝트 import
3. 환경 변수 설정:
   - `NEXT_PUBLIC_USE_MOCK=false`
   - `OPENAI_API_KEY=your_key`
4. 자동 배포

---

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: OpenAI GPT-4o
- **Excel Parsing**: xlsx
- **Markdown**: react-markdown, remark-gfm
- **File Upload**: react-dropzone
- **State**: React useState, sessionStorage

---

## 🎯 브랜드 컬러

세종대학교 공식 브랜드 컬러:

- **Primary**: #C31632 (Sejong Crimson)
- **Secondary**: #51626F (Sejong Gray)
- **Gold**: #8B6F4E (Sejong Gold)

자세한 컬러 시스템: [src/styles/colors.ts](src/styles/colors.ts)

---

## 📝 API 문서

### 완전한 API 문서

프로덕션 모드로 전환하거나 API를 통합할 때 필요한 상세 문서:

- **[API Documentation](claudedocs/API_DOCUMENTATION.md)** - 완전한 API 스펙, Request/Response 예제, 에러 처리
- **[GitHub Actions Secrets 설정](claudedocs/GITHUB_ACTIONS_SECRETS.md)** - CI/CD 환경 변수 설정 가이드

### 빠른 참조: API 엔드포인트

#### POST /api/parse-excel

성적표 Excel 파일을 파싱하여 과목 데이터 추출

**Request**:
- Content-Type: `multipart/form-data`
- Body: `file` (Excel)

**Response**:
```json
{
  "success": true,
  "data": {
    "courses": [...],
    "totalCredits": 34
  }
}
```

#### POST /api/generate-roadmap

AI 기반 맞춤형 학습 로드맵 생성

**Request**:
```json
{
  "transcript": {...},
  "careerGoal": {
    "careerPath": "AI/ML 엔지니어",
    "interests": ["AI/ML", "백엔드 개발"],
    "additionalInfo": "..."
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "careerSummary": "...",
    "currentSkills": {...},
    "learningPath": [...],
    "advice": "...",
    "generatedAt": "2025-12-23T10:30:00Z"
  }
}
```

**상세 정보**: [API Documentation](claudedocs/API_DOCUMENTATION.md) 참조

---

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

© 2025 Sejong University. All rights reserved.

---

## 📞 문의

- **프로젝트**: 완익세종 (Wanik-Sejong)
- **목적**: 세종대학교 해커톤 프로젝트
- **팀**: [Your Team Name]

---

## ✨ 개발 팁

### Mock 데이터 수정

[src/mocks/courses.json](src/mocks/courses.json)와 [src/mocks/roadmap.json](src/mocks/roadmap.json)를 수정하여 다양한 시나리오 테스트 가능

### 새 컴포넌트 추가

```bash
src/components/ui/MyComponent.tsx
```

생성 후 [src/components/ui/index.ts](src/components/ui/index.ts)에 export 추가

### OpenAI 프롬프트 커스터마이징

[src/app/api/generate-roadmap/route.ts](src/app/api/generate-roadmap/route.ts)의 `createRoadmapPrompt` 함수 수정

---
