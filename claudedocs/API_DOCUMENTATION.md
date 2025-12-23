# Wanik-Sejong API Documentation

> **완익세종** - AI 기반 진로-교과목 로드맵 추천 시스템 API 명세서

**버전**: 1.0.0
**최종 업데이트**: 2025-12-23
**Base URL**: `http://localhost:8000` (개발) / `https://api.wanik-sejong.com` (프로덕션)

---

## 📋 목차

1. [개요](#개요)
2. [인증](#인증)
3. [공통 응답 형식](#공통-응답-형식)
4. [API 엔드포인트](#api-엔드포인트)
5. [데이터 모델](#데이터-모델)
6. [에러 코드](#에러-코드)

---

## 개요

### 시스템 아키텍처

```
프론트엔드 (Next.js)          백엔드 (Spring Boot)          OpenAI API
─────────────────────         ────────────────────          ──────────
http://localhost:3000         http://localhost:8000
│                             │
├─ React 컴포넌트             ├─ @RestController
├─ TypeScript                 ├─ @Service
│                             ├─ OpenAI Java SDK    ─────────> GPT-4o
└─ axios/fetch                └─ application.yml
                                 (openai.api.key)
```

### 기술 스택

- **Backend**: Spring Boot 3.x, Java 17+
- **AI**: OpenAI GPT-4o
- **Excel Parsing**: Apache POI
- **Build**: Gradle/Maven

---

## 인증

**현재 버전**: 인증 없음

향후 JWT 기반 인증 추가 예정

---

## 공통 응답 형식

### 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "message": "요청이 성공적으로 처리되었습니다"
}
```

### 실패 응답

```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE"
}
```

---

## API 엔드포인트

### 1. 성적표 파싱

Excel 성적표 파일을 업로드하여 과목 데이터를 추출합니다.

#### Endpoint

```
POST /api/parse-excel
```

#### Request Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Content-Type` | string | ✅ | `multipart/form-data` |

#### Request Body (multipart/form-data)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `file` | File | ✅ | Excel 성적표 파일 | `.xlsx`, `.xls` 형식만 허용 |

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "courseCode": "CSE201",
        "courseName": "데이터구조",
        "courseType": "전공필수",
        "physicalArea": null,
        "selectedArea": null,
        "credits": 3,
        "evaluationType": "절대평가",
        "grade": "A+",
        "gradePoint": 4.5,
        "departmentCode": "CSE"
      },
      {
        "courseCode": "CSE202",
        "courseName": "알고리즘",
        "courseType": "전공필수",
        "physicalArea": null,
        "selectedArea": null,
        "credits": 3,
        "evaluationType": "절대평가",
        "grade": "A",
        "gradePoint": 4.0,
        "departmentCode": "CSE"
      }
    ],
    "totalCredits": 75,
    "totalMajorCredits": 45,
    "totalGeneralCredits": 30,
    "averageGPA": 4.25
  },
  "message": "성적표 파싱 완료"
}
```

#### Error Responses

| Status Code | Error Code | Description | Example |
|-------------|------------|-------------|---------|
| 400 | `FILE_NOT_PROVIDED` | 파일이 업로드되지 않음 | `{ "success": false, "error": "파일이 업로드되지 않았습니다", "code": "FILE_NOT_PROVIDED" }` |
| 400 | `INVALID_FILE_TYPE` | 지원하지 않는 파일 형식 | `{ "success": false, "error": "엑셀 파일(.xlsx, .xls)만 업로드 가능합니다", "code": "INVALID_FILE_TYPE" }` |
| 400 | `EMPTY_FILE` | 빈 파일 | `{ "success": false, "error": "엑셀 파일에 데이터가 없습니다", "code": "EMPTY_FILE" }` |
| 500 | `PARSING_ERROR` | 파일 파싱 실패 | `{ "success": false, "error": "파일 파싱 중 오류가 발생했습니다", "code": "PARSING_ERROR" }` |

#### Example Request (cURL)

```bash
curl -X POST http://localhost:8000/api/parse-excel \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/transcript.xlsx"
```

---

### 2. AI 로드맵 생성

학생의 이수 과목과 희망 진로를 분석하여 맞춤형 학습 로드맵을 생성합니다.

#### Endpoint

```
POST /api/generate-roadmap
```

#### Request Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `Content-Type` | string | ✅ | `application/json` |

#### Request Body (application/json)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `transcript` | TranscriptData | ✅ | 성적표 데이터 (parse-excel 결과) |
| `careerGoal` | CareerGoal | ✅ | 희망 진로 정보 |

**Request Body Schema:**

```json
{
  "transcript": {
    "courses": [
      {
        "courseCode": "CSE201",
        "courseName": "데이터구조",
        "courseType": "전공필수",
        "physicalArea": null,
        "selectedArea": null,
        "credits": 3,
        "evaluationType": "절대평가",
        "grade": "A+",
        "gradePoint": 4.5,
        "departmentCode": "CSE"
      }
    ],
    "totalCredits": 75,
    "totalMajorCredits": 45,
    "totalGeneralCredits": 30,
    "averageGPA": 4.25
  },
  "careerGoal": {
    "careerPath": "백엔드 개발자",
    "interests": ["클라우드", "데이터베이스", "API 설계"],
    "additionalInfo": "대규모 트래픽 처리에 관심이 많습니다."
  }
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "careerSummary": "백엔드 개발자는 서버, 데이터베이스, API를 설계하고 구축하는 역할을 합니다. 대규모 트래픽 처리와 시스템 아키텍처 설계 능력이 중요합니다.",
    "currentSkills": {
      "strengths": [
        "자료구조 및 알고리즘 기초 탄탄",
        "데이터베이스 기본 개념 이해",
        "객체지향 프로그래밍 경험",
        "웹 프로그래밍 기초 보유",
        "문제 해결 능력 우수"
      ],
      "gaps": [
        "분산 시스템 설계 경험 부족",
        "클라우드 인프라 지식 부족",
        "대규모 데이터 처리 경험 부족",
        "RESTful API 설계 실무 경험 부족",
        "성능 최적화 및 모니터링 경험 부족"
      ]
    },
    "learningPath": [
      {
        "period": "2025년 겨울방학",
        "goal": "백엔드 개발 핵심 기술 습득 및 프로젝트 경험",
        "courses": [
          {
            "name": "Spring Boot 완전정복",
            "type": "외부강의",
            "reason": "실무에서 가장 많이 사용되는 Java 백엔드 프레임워크",
            "priority": "high",
            "prerequisites": ["Java 프로그래밍"]
          },
          {
            "name": "데이터베이스 시스템",
            "type": "전공필수",
            "reason": "고급 SQL 및 데이터베이스 설계 학습",
            "priority": "high",
            "prerequisites": ["데이터베이스 기초"]
          },
          {
            "name": "RESTful API 설계 패턴",
            "type": "자가학습",
            "reason": "API 설계 및 문서화 능력 향상",
            "priority": "medium",
            "prerequisites": []
          }
        ],
        "activities": [
          "GitHub에 Spring Boot 미니 프로젝트 3개 이상 업로드",
          "Medium 또는 개인 블로그에 학습 내용 정리"
        ],
        "effort": "주 20시간 (8주)"
      },
      {
        "period": "2025년 1학기",
        "goal": "클라우드 및 분산 시스템 이해",
        "courses": [
          {
            "name": "클라우드 컴퓨팅",
            "type": "전공선택",
            "reason": "AWS, GCP 등 클라우드 인프라 기초 학습",
            "priority": "high",
            "prerequisites": ["운영체제"]
          },
          {
            "name": "소프트웨어 아키텍처",
            "type": "전공선택",
            "reason": "대규모 시스템 설계 능력 배양",
            "priority": "medium",
            "prerequisites": ["데이터베이스 시스템"]
          }
        ],
        "activities": [
          "AWS Certified Cloud Practitioner 자격증 준비",
          "오픈소스 백엔드 프로젝트 기여"
        ],
        "effort": "주 15시간 (16주)"
      }
    ],
    "advice": "## 추가 조언\n\n### 학습 전략\n1. **이론과 실습의 균형**: 각 개념을 배운 후 반드시 미니 프로젝트로 적용하세요.\n2. **포트폴리오 구축**: GitHub에 모든 프로젝트를 체계적으로 관리하고, README를 상세히 작성하세요.\n\n### 취업 준비\n1. **코딩 테스트**: 백준, 프로그래머스에서 매일 1-2문제씩 풀이\n2. **오픈소스 기여**: 유명 백엔드 프레임워크나 라이브러리에 기여",
    "generatedAt": "2025-12-23T16:30:00Z"
  },
  "message": "AI 로드맵 생성 완료"
}
```

#### Error Responses

| Status Code | Error Code | Description | Example |
|-------------|------------|-------------|---------|
| 400 | `EMPTY_TRANSCRIPT` | 성적표 데이터 없음 | `{ "success": false, "error": "성적표 데이터가 없습니다", "code": "EMPTY_TRANSCRIPT" }` |
| 400 | `EMPTY_CAREER_PATH` | 희망 진로 미입력 | `{ "success": false, "error": "희망 진로를 입력해주세요", "code": "EMPTY_CAREER_PATH" }` |
| 500 | `OPENAI_API_KEY_MISSING` | OpenAI API 키 미설정 | `{ "success": false, "error": "OpenAI API 키가 설정되지 않았습니다", "code": "OPENAI_API_KEY_MISSING" }` |
| 500 | `OPENAI_API_ERROR` | OpenAI API 호출 실패 | `{ "success": false, "error": "로드맵 생성 중 오류가 발생했습니다", "code": "OPENAI_API_ERROR" }` |
| 429 | `RATE_LIMIT_EXCEEDED` | API 호출 제한 초과 | `{ "success": false, "error": "API 호출 제한을 초과했습니다. 잠시 후 다시 시도해주세요", "code": "RATE_LIMIT_EXCEEDED" }` |

#### Example Request (cURL)

```bash
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": {
      "courses": [
        {
          "courseCode": "CSE201",
          "courseName": "데이터구조",
          "courseType": "전공필수",
          "credits": 3,
          "evaluationType": "절대평가",
          "grade": "A+",
          "gradePoint": 4.5,
          "departmentCode": "CSE"
        }
      ],
      "totalCredits": 75,
      "totalMajorCredits": 45,
      "totalGeneralCredits": 30,
      "averageGPA": 4.25
    },
    "careerGoal": {
      "careerPath": "백엔드 개발자",
      "interests": ["클라우드", "데이터베이스"],
      "additionalInfo": "대규모 트래픽 처리에 관심이 있습니다."
    }
  }'
```

---

## 데이터 모델

### Course

과목 정보 (엑셀 파싱 결과)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `courseCode` | string | ✅ | 학수번호 |
| `courseName` | string | ✅ | 교과목명 |
| `courseType` | string | ✅ | 이수구분 (전공필수, 전공선택, 교양필수, 교양선택 등) |
| `physicalArea` | string | ❌ | 피직영역 |
| `selectedArea` | string | ❌ | 선택영역 |
| `credits` | number | ✅ | 학점 |
| `evaluationType` | string | ✅ | 평가방식 (절대평가, 상대평가 등) |
| `grade` | string | ✅ | 등급 (A+, A, B+ 등) |
| `gradePoint` | number | ✅ | 평점 (4.5, 4.0 등) |
| `departmentCode` | string | ❌ | 개설학과코드 |

**Example:**

```json
{
  "courseCode": "CSE101",
  "courseName": "데이터구조",
  "courseType": "전공필수",
  "physicalArea": null,
  "selectedArea": null,
  "credits": 3,
  "evaluationType": "절대평가",
  "grade": "A+",
  "gradePoint": 4.5,
  "departmentCode": "CSE"
}
```

---

### TranscriptData

성적표 전체 데이터

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `courses` | Course[] | ✅ | 이수 과목 리스트 (최소 1개) |
| `totalCredits` | number | ✅ | 총 이수 학점 |
| `totalMajorCredits` | number | ❌ | 전공 총 학점 |
| `totalGeneralCredits` | number | ❌ | 교양 총 학점 |
| `averageGPA` | number | ❌ | 평균 평점 (4.5 만점) |

**Example:**

```json
{
  "courses": [
    {
      "courseCode": "CSE201",
      "courseName": "데이터구조",
      "courseType": "전공필수",
      "physicalArea": null,
      "selectedArea": null,
      "credits": 3,
      "evaluationType": "절대평가",
      "grade": "A+",
      "gradePoint": 4.5,
      "departmentCode": "CSE"
    }
  ],
  "totalCredits": 75,
  "totalMajorCredits": 45,
  "totalGeneralCredits": 30,
  "averageGPA": 4.25
}
```

---

### CareerGoal

희망 진로 정보

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `careerPath` | string | ✅ | 희망 진로 (예: "백엔드 개발자", "데이터 사이언티스트") |
| `interests` | string[] | ❌ | 관심 분야 키워드 |
| `additionalInfo` | string | ❌ | 추가 정보 (자유 형식) |

**Example:**

```json
{
  "careerPath": "백엔드 개발자",
  "interests": ["클라우드", "데이터베이스", "API 설계"],
  "additionalInfo": "대규모 트래픽 처리에 관심이 많습니다."
}
```

---

### CurrentSkills

현재 역량 분석

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `strengths` | string[] | ✅ | 강점 리스트 (5개 권장) |
| `gaps` | string[] | ✅ | 보완 필요 영역 리스트 (5개 권장) |

**Example:**

```json
{
  "strengths": [
    "자료구조 및 알고리즘 기초 탄탄",
    "데이터베이스 기본 개념 이해",
    "객체지향 프로그래밍 경험"
  ],
  "gaps": [
    "분산 시스템 설계 경험 부족",
    "클라우드 인프라 지식 부족"
  ]
}
```

---

### RecommendedCourse

추천 과목 정보

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | 과목명 또는 강의명 |
| `type` | string | ✅ | 과목 유형 (`전공필수`, `전공선택`, `교양`, `외부강의`, `자가학습`) |
| `reason` | string | ✅ | 추천 이유 |
| `priority` | string | ❌ | 우선순위 (`high`, `medium`, `low`) |
| `prerequisites` | string[] | ❌ | 선수 과목 리스트 |

**Example:**

```json
{
  "name": "Spring Boot 완전정복",
  "type": "외부강의",
  "reason": "실무에서 가장 많이 사용되는 Java 백엔드 프레임워크",
  "priority": "high",
  "prerequisites": ["Java 프로그래밍"]
}
```

---

### RoadmapPhase

학습 로드맵 단계 (학기 또는 기간별)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `period` | string | ✅ | 기간 (예: "2025년 1학기", "여름방학") |
| `goal` | string | ✅ | 이 기간의 학습 목표 |
| `courses` | RecommendedCourse[] | ✅ | 추천 과목 리스트 (2-4개 권장) |
| `activities` | string[] | ❌ | 추가 활동 (프로젝트, 자격증 등) |
| `effort` | string | ❌ | 예상 학습량 (예: "주 20시간 (8주)") |

**Example:**

```json
{
  "period": "2025년 겨울방학",
  "goal": "백엔드 개발 핵심 기술 습득",
  "courses": [
    {
      "name": "Spring Boot 완전정복",
      "type": "외부강의",
      "reason": "실무 프레임워크 학습",
      "priority": "high",
      "prerequisites": ["Java 프로그래밍"]
    }
  ],
  "activities": [
    "GitHub에 프로젝트 업로드",
    "기술 블로그 운영"
  ],
  "effort": "주 20시간 (8주)"
}
```

---

### Roadmap

완성된 AI 학습 로드맵

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `careerSummary` | string | ✅ | 희망 진로 요약 설명 (2-3문장) |
| `currentSkills` | CurrentSkills | ✅ | 현재 역량 분석 |
| `learningPath` | RoadmapPhase[] | ✅ | 추천 학습 경로 (3-5개 기간) |
| `advice` | string | ❌ | 추가 조언 (Markdown 형식) |
| `generatedAt` | string | ✅ | 생성 일시 (ISO 8601 형식) |

**Example:**

```json
{
  "careerSummary": "백엔드 개발자는 서버, 데이터베이스, API를 설계하고 구축합니다.",
  "currentSkills": {
    "strengths": ["자료구조 기초 탄탄", "DB 이해"],
    "gaps": ["클라우드 경험 부족"]
  },
  "learningPath": [
    {
      "period": "2025년 겨울방학",
      "goal": "백엔드 핵심 기술 습득",
      "courses": [...],
      "activities": [...],
      "effort": "주 20시간"
    }
  ],
  "advice": "## 학습 전략\n1. 이론과 실습 균형...",
  "generatedAt": "2025-12-23T16:30:00Z"
}
```

---

## 에러 코드

### 클라이언트 에러 (4xx)

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| `FILE_NOT_PROVIDED` | 400 | 파일이 업로드되지 않음 |
| `INVALID_FILE_TYPE` | 400 | 지원하지 않는 파일 형식 (.xlsx, .xls만 허용) |
| `EMPTY_FILE` | 400 | 빈 엑셀 파일 |
| `EMPTY_TRANSCRIPT` | 400 | 성적표 데이터가 비어있음 |
| `EMPTY_CAREER_PATH` | 400 | 희망 진로 미입력 |
| `INVALID_REQUEST_BODY` | 400 | 잘못된 요청 본문 형식 |

### 서버 에러 (5xx)

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| `PARSING_ERROR` | 500 | Excel 파일 파싱 실패 |
| `OPENAI_API_KEY_MISSING` | 500 | OpenAI API 키 미설정 |
| `OPENAI_API_ERROR` | 500 | OpenAI API 호출 실패 |
| `INTERNAL_SERVER_ERROR` | 500 | 예상치 못한 서버 오류 |

### Rate Limiting

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| `RATE_LIMIT_EXCEEDED` | 429 | API 호출 제한 초과 |

---

## 환경 설정

### Backend (Spring Boot)

**application.yml** 또는 **application.properties** 설정:

```yaml
# application.yml
openai:
  api:
    key: ${OPENAI_API_KEY}
    model: gpt-4o
    temperature: 0.7
    max-tokens: 2000

spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
  port: 8000
```

**환경 변수**:

| 변수명 | 필수 여부 | 설명 | 예시 |
|--------|-----------|------|------|
| `OPENAI_API_KEY` | ✅ | OpenAI API 키 | `sk-proj-xxxxxxxxxx` |
| `SERVER_PORT` | ❌ | 서버 포트 (기본값: 8000) | `8000` |

### Frontend (Next.js)

**.env.local** 설정:

```bash
# Mock 모드 활성화 (개발 환경)
NEXT_PUBLIC_USE_MOCK=false

# Spring Boot API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**환경 변수**:

| 변수명 | 필수 여부 | 설명 | 예시 |
|--------|-----------|------|------|
| `NEXT_PUBLIC_USE_MOCK` | ✅ | Mock 모드 (false = 실제 API 호출) | `false` |
| `NEXT_PUBLIC_API_URL` | ✅ | Spring Boot API Base URL | `http://localhost:8000` |

---

## 개발 가이드

### 로컬 개발 환경

1. **백엔드 실행** (Spring Boot):
   ```bash
   cd backend
   ./gradlew bootRun
   # 또는
   mvn spring-boot:run
   ```

2. **프론트엔드 실행** (Next.js):
   ```bash
   cd frontend
   npm run dev
   ```

3. **API 테스트**:
   - Postman Collection 사용
   - Swagger UI: `http://localhost:8000/swagger-ui.html`

### CORS 설정

Spring Boot에서 CORS 허용:

```yaml
# application.yml
cors:
  allowed-origins:
    - http://localhost:3000
    - http://127.0.0.1:3000
```

---

## 추가 리소스

- **Swagger UI**: `http://localhost:8000/swagger-ui.html` (향후 추가)
- **OpenAPI Spec**: `http://localhost:8000/v3/api-docs`
- **Health Check**: `http://localhost:8000/actuator/health`

---

**문서 버전**: 1.0.0
**마지막 업데이트**: 2025-12-23
**작성자**: Claude Code (AI Assistant)
