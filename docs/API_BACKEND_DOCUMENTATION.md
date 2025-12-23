# Backend API Documentation

**완익세종 (Wanik-Sejong)** 백엔드 API 문서

**Base URL**: `https://hackathon.yeo-li.com`
**API Version**: v0
**OpenAPI**: 3.1

---

## 목차

1. [개요](#개요)
2. [인증](#인증)
3. [API 엔드포인트](#api-엔드포인트)
   - [POST /api/parse-excel](#post-apiparse-excel)
   - [POST /api/generate-roadmap](#post-apigenerate-roadmap)
   - [POST /api/weight-hints](#post-apiweight-hints)
   - [POST /api/subjects/score](#post-apisubjectsscore)
4. [데이터 모델](#데이터-모델)
5. [에러 처리](#에러-처리)
6. [사용 예시](#사용-예시)

---

## 개요

완익세종 백엔드 API는 학생의 성적표 파싱, AI 기반 로드맵 생성, 과목 추천 및 가중치 힌트 제공 기능을 제공합니다.

### 주요 기능

- **성적표 파싱**: Excel 파일 업로드를 통한 성적 데이터 추출
- **AI 로드맵 생성**: 학생의 이수 과목과 진로 목표를 기반으로 맞춤형 학습 로드맵 생성
- **과목 추천**: 진로 목표에 맞는 과목 추천 및 점수 부여
- **가중치 힌트**: 진로별 과목 평가 가중치 규칙 제공

---

## 인증

현재 버전(v0)은 인증이 필요하지 않습니다.

---

## API 엔드포인트

### POST /api/parse-excel

Excel 파일(성적표)을 업로드하여 이수 과목 데이터를 파싱합니다.

#### Request

**Content-Type**: `multipart/form-data`

**Parameters**:
- `file` (required, binary): Excel 파일 (.xlsx, .xls)

**Example**:
```bash
curl -X POST "https://hackathon.yeo-li.com/api/parse-excel" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@transcript.xlsx"
```

#### Response

**Status**: 200 OK
**Content-Type**: `application/json`

**Schema**:
```typescript
{
  success: boolean;
  data?: ExcelParseResponseDTO;
}
```

**ExcelParseResponseDTO**:
```typescript
{
  courses: Course[];           // 이수 과목 목록
  totalCredits: number;        // 총 학점 (double)
  totalGeneralCredits: number; // 교양 총 학점 (double)
  totalMajorCredits: number;   // 전공 총 학점 (double)
  averageGPA: number;          // 평균 평점 (double)
}
```

**Course**:
```typescript
{
  completedYear: number;       // 이수 연도 (int32)
  completedSemester: number;   // 이수 학기 (int32)
  courseCode: string;          // 학수번호
  courseName: string;          // 교과목명
  courseType: string;          // 이수구분
  teachingArea: string;        // 교직영역
  selectedArea: string;        // 선택영역
  credits: number;             // 학점 (double)
  evaluationType: string;      // 평가방식
  grade: string;               // 등급
  gradePoint: number;          // 평점 (double)
  departmentCode: string;      // 개설학과코드
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "completedYear": 2023,
        "completedSemester": 1,
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
    "totalGeneralCredits": 15.0,
    "totalMajorCredits": 50.0,
    "averageGPA": 4.2
  }
}
```

---

### POST /api/generate-roadmap

학생의 이수 과목 데이터와 진로 목표를 기반으로 AI 맞춤형 학습 로드맵을 생성합니다.

#### Request

**Content-Type**: `application/json`

**Schema**:
```typescript
{
  transcript: Transcript;      // 이수 과목 데이터
  careerGoal: string;         // 희망 진로 (프롬프트 형식)
}
```

**Transcript**:
```typescript
{
  courses: Course[];           // 이수 과목 목록 (Course 스키마 참조)
  totalCredits: number;        // 총 학점 (double)
  totalMajorCredits: number;   // 전공 총 학점 (int32)
  totalGeneralCredits: number; // 교양 총 학점 (int32)
  averageGPA: number;          // 평균 평점 (double)
}
```

**Example Request**:
```json
{
  "transcript": {
    "courses": [
      {
        "completedYear": 2023,
        "completedSemester": 1,
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

#### Response

**Status**: 200 OK
**Content-Type**: `application/json` or `*/*`

**Schema**:
```typescript
{
  success: boolean;
  data?: RoadmapAiResponseDTO;
}
```

**RoadmapAiResponseDTO**:
```typescript
{
  careerSummary: string;                      // 진로 요약
  currentSkills: CurrentSkills;               // 현재 역량 분석
  coursePlan: CoursePlan[];                   // 학기별 수강 계획
  extracurricularPlan: ExtracurricularPlan[]; // 비교과 활동 계획
  recommendedTechStack: string[];             // AI 추천 기술스택 목록
  advice: string;                             // 추가 조언
  generatedAt: string;                        // 생성 일시
  subjectRecommendations: SubjectRecommendations; // 과목 추천
  weightHints: WeightHints;                   // 가중치 힌트
}
```

**CurrentSkills**:
```typescript
{
  strengths: string[];  // 강점
  gaps: string[];       // 부족한 부분
}
```

**CoursePlan**:
```typescript
{
  period: string;       // 기간 (예: "2025년 1학기")
  goal: string;         // 목표
  courses: Course[];    // 추천 과목 목록
  effort: string;       // 예상 학습량
}
```

**ExtracurricularPlan**:
```typescript
{
  period: string;       // 기간
  goal: string;         // 목표
  activities: string[]; // 추천 활동
  effort: string;       // 예상 학습량
}
```

**SubjectRecommendations**:
```typescript
{
  matchedSectors: string[];    // 매칭된 분야
  topN: number;                // 추천 과목 수 (int32)
  subjects: ScoredSubject[];   // 점수가 매겨진 과목 목록
}
```

**ScoredSubject**:
```typescript
{
  subject: SubjectSummary;     // 과목 정보
  score: number;               // 점수 (int32)
  reasons: string[];           // 추천 이유
}
```

**SubjectSummary**:
```typescript
{
  courseCode: string;          // 학수번호
  courseName: string;          // 교과목명
  courseType: string;          // 이수구분
  selectedArea: string;        // 선택영역
  credits: number;             // 학점 (double)
  gradeLevel: number;          // 학년 (int32)
  offeringDepartmentMajor: string; // 개설학과전공
  hostDepartment: string;      // 주관학과
  lectureLanguage: string;     // 강의언어
  courseFormat: string;        // 수업형태
  schedule: string;            // 요일/교시
  classroom: string;           // 강의실
}
```

**WeightHints**:
```typescript
{
  matchedSectors: string[];                    // 매칭된 분야
  sectorKeywords: { [key: string]: string[] }; // 분야별 키워드
  weightRules: WeightRule[];                   // 가중치 규칙
  defaultN: number;                            // 기본 추천 수 (int32)
  notes: string;                               // 참고사항
}
```

**WeightRule**:
```typescript
{
  rule: string;    // 규칙
  score: number;   // 점수 (int32)
  reason: string;  // 이유
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "careerSummary": "백엔드 개발자는 서버 측 애플리케이션을 설계하고 구현하는 전문가입니다.",
    "currentSkills": {
      "strengths": ["프로그래밍 기초", "자료구조 이해"],
      "gaps": ["클라우드 경험", "대규모 시스템 설계"]
    },
    "coursePlan": [
      {
        "period": "2025년 1학기",
        "goal": "백엔드 핵심 기술 습득",
        "courses": [
          {
            "completedYear": 0,
            "completedSemester": 0,
            "courseCode": "CS301",
            "courseName": "데이터베이스",
            "courseType": "전공필수",
            "teachingArea": null,
            "selectedArea": null,
            "credits": 3.0,
            "evaluationType": "절대평가",
            "grade": "",
            "gradePoint": 0.0,
            "departmentCode": "COMP"
          }
        ],
        "effort": "주 15시간"
      }
    ],
    "extracurricularPlan": [
      {
        "period": "2025년 여름방학",
        "goal": "실무 경험 축적",
        "activities": ["백엔드 개발 인턴십", "오픈소스 프로젝트 기여"],
        "effort": "주 20시간"
      }
    ],
    "recommendedTechStack": [
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Docker",
      "AWS EC2",
      "Jenkins",
      "JUnit 5",
      "Git"
    ],
    "advice": "Spring Boot 공식 문서를 참고하여 실습 프로젝트를 진행하세요.",
    "generatedAt": "2025-12-24T10:30:00Z",
    "subjectRecommendations": {
      "matchedSectors": ["백엔드", "서버"],
      "topN": 5,
      "subjects": [
        {
          "subject": {
            "courseCode": "CS401",
            "courseName": "클라우드 컴퓨팅",
            "courseType": "전공선택",
            "selectedArea": "IT융합",
            "credits": 3.0,
            "gradeLevel": 4,
            "offeringDepartmentMajor": "컴퓨터공학",
            "hostDepartment": "공과대학",
            "lectureLanguage": "한국어",
            "courseFormat": "이론+실습",
            "schedule": "월/수 3-4교시",
            "classroom": "공학관 301"
          },
          "score": 95,
          "reasons": ["클라우드 기술 습득", "AWS/Azure 실습 포함"]
        }
      ]
    },
    "weightHints": {
      "matchedSectors": ["백엔드", "서버"],
      "sectorKeywords": {
        "백엔드": ["Spring", "API", "데이터베이스"],
        "서버": ["클라우드", "배포", "인프라"]
      },
      "weightRules": [
        {
          "rule": "데이터베이스 관련 과목 우선",
          "score": 20,
          "reason": "백엔드 필수 역량"
        }
      ],
      "defaultN": 5,
      "notes": "전공필수 과목을 우선적으로 이수하세요."
    }
  }
}
```

---

### POST /api/weight-hints

진로 목표에 따른 과목 평가 가중치 규칙을 제공합니다.

#### Request

**Content-Type**: `application/json`

**Schema**:
```typescript
{
  careerGoal: string;  // 희망 진로
}
```

**Example Request**:
```json
{
  "careerGoal": "백엔드 개발자"
}
```

#### Response

**Status**: 200 OK
**Content-Type**: `application/json`

**Schema**:
```typescript
{
  success: boolean;
  data?: WeightHintResponseDTO;
}
```

**WeightHintResponseDTO**: (WeightHints와 동일한 구조)

---

### POST /api/subjects/score

과목 목록에 대해 진로 목표 기반 점수를 부여합니다.

#### Request

**Content-Type**: `application/json`

**Schema**:
```typescript
{
  careerGoal: string;          // 희망 진로
  subjects: SubjectSummary[];  // 평가할 과목 목록
  topN?: number;               // 상위 N개 반환 (선택)
}
```

#### Response

**Status**: 200 OK
**Content-Type**: `application/json`

**Schema**:
```typescript
{
  success: boolean;
  data?: SubjectScoreResponseDTO;
}
```

**SubjectScoreResponseDTO**:
```typescript
{
  matchedSectors: string[];    // 매칭된 분야
  subjects: ScoredSubject[];   // 점수가 매겨진 과목 목록
}
```

---

## 데이터 모델

### 공통 응답 래퍼

모든 API 응답은 다음 구조를 따릅니다:

```typescript
interface ApiResponse<T> {
  success: boolean;  // 성공 여부
  data?: T;          // 응답 데이터 (성공 시)
  error?: string;    // 에러 메시지 (실패 시)
}
```

### Course (과목 정보)

```typescript
interface Course {
  completedYear: number;       // 이수 연도 (int32)
  completedSemester: number;   // 이수 학기 (int32, 1 또는 2)
  courseCode: string;          // 학수번호
  courseName: string;          // 교과목명
  courseType: string;          // 이수구분 (전공필수, 전공선택, 교양필수, 교양선택 등)
  teachingArea: string | null; // 교직영역
  selectedArea: string | null; // 선택영역
  credits: number;             // 학점 (double)
  evaluationType: string;      // 평가방식
  grade: string;               // 등급 (A+, A, B+ 등)
  gradePoint: number;          // 평점 (double, 0.0 ~ 4.5)
  departmentCode: string;      // 개설학과코드
}
```

### Transcript (성적표)

```typescript
interface Transcript {
  courses: Course[];           // 이수 과목 목록
  totalCredits: number;        // 총 학점 (double)
  totalMajorCredits: number;   // 전공 총 학점 (int32)
  totalGeneralCredits: number; // 교양 총 학점 (int32)
  averageGPA: number;          // 평균 평점 (double)
}
```

### SubjectSummary (과목 요약 정보)

```typescript
interface SubjectSummary {
  courseCode: string;              // 학수번호
  courseName: string;              // 교과목명
  courseType: string;              // 이수구분
  selectedArea: string;            // 선택영역
  credits: number;                 // 학점 (double)
  gradeLevel: number;              // 학년 (int32)
  offeringDepartmentMajor: string; // 개설학과전공
  hostDepartment: string;          // 주관학과
  lectureLanguage: string;         // 강의언어
  courseFormat: string;            // 수업형태
  schedule: string;                // 요일/교시
  classroom: string;               // 강의실
}
```

### ScoredSubject (점수가 매겨진 과목)

```typescript
interface ScoredSubject {
  subject: SubjectSummary;  // 과목 정보
  score: number;            // 점수 (int32)
  reasons: string[];        // 추천 이유
}
```

---

## 에러 처리

### 에러 응답 형식

```typescript
{
  success: false;
  error: string;  // 에러 메시지
}
```

### 일반적인 HTTP 상태 코드

- `200 OK`: 요청 성공
- `400 Bad Request`: 잘못된 요청 (필수 파라미터 누락, 유효하지 않은 데이터)
- `500 Internal Server Error`: 서버 내부 오류

---

## 사용 예시

### 1. 성적표 업로드 → AI 로드맵 생성 플로우

```typescript
// Step 1: 성적표 업로드
const formData = new FormData();
formData.append('file', transcriptFile);

const parseResponse = await fetch('https://hackathon.yeo-li.com/api/parse-excel', {
  method: 'POST',
  body: formData,
});

const parseResult = await parseResponse.json();
// parseResult.data => ExcelParseResponseDTO

// Step 2: AI 로드맵 생성
const roadmapResponse = await fetch('https://hackathon.yeo-li.com/api/generate-roadmap', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    transcript: parseResult.data,
    careerGoal: '백엔드 개발자를 목표로 하고 있습니다. Spring Boot, 데이터베이스, 클라우드에 관심이 있으며, 대기업 취업을 희망합니다.',
  }),
});

const roadmapResult = await roadmapResponse.json();
// roadmapResult.data => RoadmapAiResponseDTO
```

### 2. 과목 점수 평가

```typescript
const scoreResponse = await fetch('https://hackathon.yeo-li.com/api/subjects/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    careerGoal: '백엔드 개발자',
    subjects: [
      {
        courseCode: 'CS401',
        courseName: '클라우드 컴퓨팅',
        courseType: '전공선택',
        // ... 기타 필드
      },
    ],
    topN: 5,
  }),
});

const scoreResult = await scoreResponse.json();
// scoreResult.data => SubjectScoreResponseDTO
```

---

## 변경 이력

- **2025-12-24**: Swagger 기반 완전 재작성 - 실제 백엔드 API 스키마 반영
  - `/api/parse-excel`: 성적표 파싱 엔드포인트 추가
  - `/api/generate-roadmap`: 요청/응답 스키마 업데이트 (careerGoal: string, subjectRecommendations, weightHints 추가)
  - `/api/weight-hints`: 가중치 힌트 엔드포인트 추가
  - `/api/subjects/score`: 과목 점수 평가 엔드포인트 추가
  - Course 모델에 `completedYear`, `completedSemester` 필드 추가
  - 모든 데이터 타입을 실제 백엔드 스키마에 맞게 조정 (int32, double 등)
  - **recommendedTechStack 필드 추가**: AI가 추천하는 기술스택 목록 (string[])

---

**문의**: 백엔드 API 관련 문의는 프로젝트 팀에 연락하세요.
