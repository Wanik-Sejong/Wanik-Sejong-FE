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
        "teachingArea": null,
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
        "teachingArea": null,
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
        "teachingArea": null,
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
| `courseCode` | string | ✅ | **학수번호**: 과목 고유 코드 (예: CSE101, GEN201, EDU301) |
| `courseName` | string | ✅ | **교과목명**: 과목 이름 (예: 데이터구조, 영어작문, 교육학개론) |
| `courseType` | string | ✅ | **이수구분**: 과목 유형<br/>- `전공필수`: 졸업 필수 전공 과목<br/>- `전공선택`: 선택 가능한 전공 과목<br/>- `교양필수`: 졸업 필수 교양 과목<br/>- `교양선택`: 선택 가능한 교양 과목<br/>- `교직`: 교직 이수 과목 |
| `teachingArea` | string | ❌ | **교직영역**: 교직 과목의 세부 영역 구분 (교직 과목이 아니면 `null`)<br/>※ 예시: "교직이론", "교직소양", "교육실습" 등<br/>※ 교사 자격증 취득을 위한 교직 과정 이수 시 사용 |
| `selectedArea` | string | ❌ | **선택영역**: 특정 영역 선택 구분 (대부분 `null`)<br/>※ 학교별 세부 분류 체계에 따라 사용 |
| `credits` | number | ✅ | **학점**: 과목의 학점 수 (예: 3, 2) |
| `evaluationType` | string | ✅ | **평가방식**: 성적 평가 방법<br/>- `절대평가`: 절대 기준으로 평가<br/>- `상대평가`: 상대 기준으로 평가<br/>- `P/F`: Pass/Fail 평가 |
| `grade` | string | ✅ | **등급**: 받은 성적 등급 (예: A+, A, B+, P) |
| `gradePoint` | number | ✅ | **평점**: 등급의 수치화된 점수<br/>- A+ = 4.5<br/>- A = 4.0<br/>- B+ = 3.5<br/>- B = 3.0<br/>- C+ = 2.5<br/>- C = 2.0<br/>- D+ = 1.5<br/>- D = 1.0<br/>- F = 0.0 |
| `departmentCode` | string | ❌ | **개설학과코드**: 과목을 개설한 학과 코드 (예: CSE, GEN) |

**Example:**

```json
{
  "courseCode": "CSE101",
  "courseName": "데이터구조",
  "courseType": "전공필수",
  "teachingArea": null,
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
| `courses` | Course[] | ✅ | **이수 과목 리스트**: 학생이 수강한 모든 과목의 배열 (최소 1개 필요) |
| `totalCredits` | number | ✅ | **총 이수 학점**: 모든 과목의 학점 합계<br/>※ 계산식: `Σ(각 과목의 credits)` |
| `totalMajorCredits` | number | ❌ | **전공 총 학점**: 전공 과목만의 학점 합계<br/>※ `courseType`에 "전공"이 포함된 과목들의 합 |
| `totalGeneralCredits` | number | ❌ | **교양 총 학점**: 교양 과목만의 학점 합계<br/>※ `courseType`에 "교양"이 포함된 과목들의 합 |
| `averageGPA` | number | ❌ | **평균 평점**: 전체 과목의 평균 평점 (4.5 만점)<br/>※ 계산식: `Σ(gradePoint × credits) / totalCredits`<br/>※ 소수점 둘째 자리까지 (예: 3.97) |

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

희망 진로 정보 (사용자 입력)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `careerPath` | string | ✅ | **희망 진로**: 원하는 직업 또는 진로<br/>※ 예시: "백엔드 개발자", "데이터 사이언티스트", "AI 엔지니어" |
| `interests` | string[] | ❌ | **관심 분야 키워드**: 구체적인 관심사 배열 (선택사항)<br/>※ 예시: `["클라우드", "데이터베이스", "API 설계"]`<br/>※ AI 로드맵 생성 시 이 키워드를 반영하여 맞춤형 추천 제공 |
| `additionalInfo` | string | ❌ | **추가 정보**: 진로에 대한 자유로운 설명 (선택사항)<br/>※ 예시: "대규모 트래픽 처리에 관심이 많습니다"<br/>※ AI가 더 세밀한 로드맵을 생성하는 데 활용 |

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

현재 역량 분석 (AI 생성)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `strengths` | string[] | ✅ | **강점 리스트**: 이수 과목 기반으로 AI가 분석한 현재 보유 역량<br/>※ 권장 개수: 5개<br/>※ 예시: "자료구조 및 알고리즘 기초 탄탄", "웹 프로그래밍 실력 우수" |
| `gaps` | string[] | ✅ | **보완 필요 영역 리스트**: 희망 진로 달성을 위해 보완해야 할 부분<br/>※ 권장 개수: 5개<br/>※ 예시: "클라우드 인프라 지식 부족", "대규모 데이터 처리 경험 부족"<br/>※ 로드맵의 학습 과목 추천 근거가 됨 |

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

추천 과목 정보 (AI 생성 로드맵 내 개별 과목)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | **과목명 또는 강의명**<br/>※ 예시: "Spring Boot 완전정복", "클라우드 컴퓨팅", "Python 데이터 분석" |
| `type` | string | ✅ | **과목 유형**: 어디서 수강할 수 있는지 구분<br/>- `전공필수`: 학교의 졸업 필수 전공 과목<br/>- `전공선택`: 학교의 선택 가능한 전공 과목<br/>- `교양`: 학교의 교양 과목<br/>- `외부강의`: 온라인 강의 플랫폼 (Coursera, Udemy 등)<br/>- `자가학습`: 독학으로 학습 가능한 내용 |
| `reason` | string | ✅ | **추천 이유**: 왜 이 과목을 들어야 하는지 설명<br/>※ 예시: "실무에서 가장 많이 사용되는 Java 백엔드 프레임워크" |
| `priority` | string | ❌ | **우선순위**: 수강 시급성 (선택사항)<br/>- `high`: 필수적으로 들어야 함<br/>- `medium`: 가능하면 들으면 좋음<br/>- `low`: 여유가 있으면 들어도 좋음 |
| `prerequisites` | string[] | ❌ | **선수 과목 리스트**: 이 과목을 듣기 전에 필요한 과목들 (선택사항)<br/>※ 예시: `["Java 프로그래밍", "데이터베이스 기초"]` |

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

학습 로드맵 단계 (학기 또는 기간별 계획)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `period` | string | ✅ | **기간**: 언제 학습할 것인지<br/>※ 예시: "2025년 1학기", "2025년 여름방학", "2026년 겨울방학" |
| `goal` | string | ✅ | **이 기간의 학습 목표**: 이번 단계에서 달성할 것<br/>※ 예시: "백엔드 개발 핵심 기술 습득", "클라우드 및 분산 시스템 이해" |
| `courses` | RecommendedCourse[] | ✅ | **추천 과목 리스트**: 이 기간에 들을 과목들<br/>※ 권장 개수: 2-4개 (너무 많으면 부담)<br/>※ `전공필수`, `전공선택`, `교양`, `외부강의`, `자가학습` 혼합 가능 |
| `activities` | string[] | ❌ | **추가 활동**: 과목 외 병행할 활동 (선택사항)<br/>※ 예시: "GitHub 프로젝트 업로드", "기술 블로그 운영", "AI 경진대회 참가"<br/>※ 실무 역량 강화에 도움이 되는 활동 추천 |
| `effort` | string | ❌ | **예상 학습량**: 필요한 시간 투자 (선택사항)<br/>※ 예시: "주 20시간 (8주)", "학기 중 주 15시간"<br/>※ 학생이 현실적인 계획을 세우는 데 도움 |

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

완성된 AI 학습 로드맵 (최종 출력)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `careerSummary` | string | ✅ | **희망 진로 요약 설명**: 선택한 진로가 무엇인지 간단히 설명<br/>※ 길이: 2-3문장<br/>※ 예시: "백엔드 개발자는 서버, 데이터베이스, API를 설계하고 구축하는 역할을 합니다. 대규모 트래픽 처리와 시스템 아키텍처 설계 능력이 중요합니다." |
| `currentSkills` | CurrentSkills | ✅ | **현재 역량 분석**: 학생의 강점과 보완점<br/>※ `strengths`: 현재 가진 강점 5개<br/>※ `gaps`: 보완이 필요한 영역 5개 |
| `learningPath` | RoadmapPhase[] | ✅ | **추천 학습 경로**: 시간 순서대로 정렬된 학습 계획<br/>※ 권장 개수: 3-5개 기간 (학기/방학 단위)<br/>※ 각 Phase는 기간, 목표, 과목, 활동, 예상 학습량 포함<br/>※ 순차적으로 따라가면 희망 진로 달성 가능하도록 구성 |
| `advice` | string | ❌ | **추가 조언**: AI가 주는 학습 전략 및 팁 (선택사항)<br/>※ Markdown 형식 지원<br/>※ 예시: 학습 전략, 포트폴리오 구축 방법, 네트워킹 팁 등<br/>※ 진로 달성을 위한 실용적인 조언 제공 |
| `generatedAt` | string | ✅ | **생성 일시**: 로드맵이 생성된 시각<br/>※ ISO 8601 형식 (예: "2025-12-23T16:30:00Z")<br/>※ 타임스탬프로 활용 가능 |

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
