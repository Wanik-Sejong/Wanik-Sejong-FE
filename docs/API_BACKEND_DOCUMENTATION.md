# 백엔드 API 문서

**Base URL**: `https://hackathon.yeo-li.com`
**API Version**: v0
**OpenAPI**: 3.1

---

## 📋 목차

1. [API 개요](#api-개요)
2. [인증](#인증)
3. [엔드포인트](#엔드포인트)
   - [POST /api/parse-excel](#post-apiparse-excel)
   - [POST /api/generate-roadmap](#post-apigenerate-roadmap)
4. [데이터 모델](#데이터-모델)
5. [에러 처리](#에러-처리)

---

## API 개요

완익세종 백엔드 API는 성적표 파싱과 AI 기반 로드맵 생성을 제공합니다.

### 주요 기능
- ✅ 엑셀 성적표 파싱 및 구조화
- ✅ AI 기반 맞춤형 학습 로드맵 생성
- ✅ RESTful API 설계
- ✅ JSON 응답 형식

---

## 인증

현재 버전에서는 별도의 인증이 필요하지 않습니다.

---

## 엔드포인트

### POST /api/parse-excel

엑셀 파일(.xlsx, .xls)을 업로드하여 성적표 데이터를 파싱합니다.

#### Request

**HTTP Method**: `POST`
**Content-Type**: `multipart/form-data`

**Parameters**:

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| file | file (binary) | ✅ | 엑셀 성적표 파일 (.xlsx, .xls) |

**Example Request**:
```bash
curl -X POST "https://hackathon.yeo-li.com/api/parse-excel" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@transcript.xlsx"
```

#### Response

**HTTP Status**: `200 OK`
**Content-Type**: `application/json`

**Response Schema**:
```json
{
  "success": boolean,
  "data": {
    "courses": [
      {
        "courseCode": "string",        // 학수번호
        "courseName": "string",        // 교과목명
        "courseType": "string",        // 이수구분 (전필, 전선, 교필, 교선 등)
        "teachingArea": "string",      // 교직영역
        "selectedArea": "string",      // 선택영역
        "credits": integer,            // 학점
        "evaluationType": "string",    // 평가방식
        "grade": "string",             // 등급 (A+, A, B+ 등)
        "gradePoint": number,          // 평점 (0.0 ~ 4.5)
        "departmentCode": "string"     // 개설학과코드
      }
    ]
  }
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "courseCode": "CS101",
        "courseName": "C프로그래밍및실습",
        "courseType": "전필",
        "teachingArea": null,
        "selectedArea": null,
        "credits": 3,
        "evaluationType": "상대평가",
        "grade": "A+",
        "gradePoint": 4.5,
        "departmentCode": "CSE"
      },
      {
        "courseCode": "CS201",
        "courseName": "자료구조",
        "courseType": "전필",
        "teachingArea": null,
        "selectedArea": null,
        "credits": 3,
        "evaluationType": "상대평가",
        "grade": "A",
        "gradePoint": 4.0,
        "departmentCode": "CSE"
      }
    ]
  }
}
```

---

### POST /api/generate-roadmap

성적표 데이터와 진로 목표를 바탕으로 AI 기반 맞춤형 학습 로드맵을 생성합니다.

#### Request

**HTTP Method**: `POST`
**Content-Type**: `application/json`

**Request Body Schema**:
```typescript
{
  "transcript": {
    "courses": Course[],           // 이수 과목 목록
    "totalCredits": number,         // 총 학점
    "totalMajorCredits": number,    // 전공 학점
    "totalGeneralCredits": number,  // 교양 학점
    "averageGPA": number            // 평균 평점
  },
  "careerGoal": {
    "careerPath": string,           // 희망 진로
    "interests": string[],          // 관심 분야 (optional)
    "additionalInfo": string        // 추가 정보 (optional)
  }
}
```

**Example Request**:
```bash
curl -X POST "https://hackathon.yeo-li.com/api/generate-roadmap" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": {
      "courses": [
        {
          "courseCode": "CS101",
          "courseName": "C프로그래밍및실습",
          "courseType": "전필",
          "teachingArea": null,
          "selectedArea": null,
          "credits": 3,
          "evaluationType": "상대평가",
          "grade": "A+",
          "gradePoint": 4.5,
          "departmentCode": "CSE"
        }
      ],
      "totalCredits": 60,
      "totalMajorCredits": 36,
      "totalGeneralCredits": 24,
      "averageGPA": 4.2
    },
    "careerGoal": {
      "careerPath": "백엔드 개발자",
      "interests": ["Spring Boot", "데이터베이스", "클라우드"],
      "additionalInfo": "대기업 취업을 목표로 하고 있습니다."
    }
  }'
```

#### Response

**HTTP Status**: `200 OK`
**Content-Type**: `*/*` (JSON)

**Response Schema**:
```typescript
{
  "success": boolean,
  "data": {
    "careerSummary": string,        // 진로 요약 설명
    "currentSkills": {
      "strengths": string[],        // 현재 강점
      "gaps": string[]              // 보완이 필요한 부분
    },
    "learningPath": [
      {
        "period": string,           // 기간 (예: "2025년 1학기")
        "goal": string,             // 이 기간의 학습 목표
        "courses": Course[],        // 추천 과목 목록
        "activities": string[],     // 추가 활동
        "effort": string            // 예상 학습량 (예: "주 10시간")
      }
    ],
    "advice": string,               // 추가 조언
    "generatedAt": string           // 생성 일시
  }
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "careerSummary": "백엔드 개발자는 서버 측 로직, 데이터베이스, API 설계를 담당하는 직무입니다.",
    "currentSkills": {
      "strengths": [
        "C프로그래밍 기초 탄탄함",
        "논리적 사고력 우수",
        "높은 학업 성취도"
      ],
      "gaps": [
        "웹 프레임워크 경험 부족",
        "데이터베이스 실무 경험 필요",
        "클라우드 인프라 지식 부족"
      ]
    },
    "learningPath": [
      {
        "period": "2025년 1학기",
        "goal": "웹 개발 기초 및 Spring Framework 학습",
        "courses": [
          {
            "courseCode": "CS301",
            "courseName": "웹프로그래밍",
            "courseType": "전선",
            "teachingArea": null,
            "selectedArea": null,
            "credits": 3,
            "evaluationType": "상대평가",
            "grade": null,
            "gradePoint": null,
            "departmentCode": "CSE"
          },
          {
            "courseCode": "CS302",
            "courseName": "데이터베이스",
            "courseType": "전필",
            "teachingArea": null,
            "selectedArea": null,
            "credits": 3,
            "evaluationType": "상대평가",
            "grade": null,
            "gradePoint": null,
            "departmentCode": "CSE"
          }
        ],
        "activities": [
          "Spring Boot 토이 프로젝트 구현",
          "MySQL 실습 및 쿼리 최적화 연습",
          "GitHub 포트폴리오 구축"
        ],
        "effort": "주 15시간 (12주)"
      },
      {
        "period": "2025년 여름방학",
        "goal": "실전 프로젝트 및 클라우드 경험",
        "courses": [],
        "activities": [
          "인턴십 지원 및 참여",
          "AWS 기초 자격증 취득",
          "개인 프로젝트 배포 경험"
        ],
        "effort": "주 20시간 (8주)"
      }
    ],
    "advice": "백엔드 개발자로 성장하기 위해서는 이론뿐만 아니라 실제 프로젝트 경험이 중요합니다. 학습과 병행하여 포트폴리오를 구축하세요.",
    "generatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

## 데이터 모델

### Course (과목 정보)

```typescript
interface Course {
  courseCode: string;        // 학수번호
  courseName: string;        // 교과목명
  courseType: string;        // 이수구분 (전필, 전선, 교필, 교선 등)
  teachingArea: string | null;  // 교직영역
  selectedArea: string | null;  // 선택영역
  credits: number;           // 학점 (integer)
  evaluationType: string;    // 평가방식
  grade: string;             // 등급 (A+, A, B+ 등)
  gradePoint: number;        // 평점 (0.0 ~ 4.5, double)
  departmentCode: string;    // 개설학과코드
}
```

### Transcript (성적표)

```typescript
interface Transcript {
  courses: Course[];              // 이수 과목 목록
  totalCredits: number;           // 총 학점
  totalMajorCredits: number;      // 전공 학점
  totalGeneralCredits: number;    // 교양 학점
  averageGPA: number;             // 평균 평점 (0.0 ~ 4.5)
}
```

### CareerGoal (진로 목표)

```typescript
interface CareerGoal {
  careerPath: string;      // 희망 진로 (필수)
  interests: string[];     // 관심 분야 배열 (선택)
  additionalInfo: string;  // 추가 정보 (선택)
}
```

### CurrentSkills (현재 역량)

```typescript
interface CurrentSkills {
  strengths: string[];  // 강점 목록
  gaps: string[];       // 보완 필요 영역
}
```

### LearningPath (학습 경로 단계)

```typescript
interface LearningPath {
  period: string;         // 기간 (예: "2025년 1학기")
  goal: string;           // 이 기간의 목표
  courses: Course[];      // 추천 과목 목록
  activities: string[];   // 추가 활동 (프로젝트, 자격증 등)
  effort: string;         // 예상 학습량 (예: "주 10시간")
}
```

### RoadmapAiResponseDTO (AI 로드맵 응답)

```typescript
interface RoadmapAiResponseDTO {
  careerSummary: string;        // 진로 요약
  currentSkills: CurrentSkills; // 현재 역량 분석
  learningPath: LearningPath[]; // 학습 경로 (단계별)
  advice: string;               // 추가 조언
  generatedAt: string;          // 생성 일시 (ISO 8601)
}
```

### ApiResponse (공통 응답 래퍼)

```typescript
interface ApiResponse<T> {
  success: boolean;  // 성공 여부
  data: T;          // 응답 데이터
}
```

---

## 에러 처리

### 에러 응답 형식

```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE"
}
```

### 주요 에러 코드

| HTTP Status | 설명 |
|-------------|------|
| 400 Bad Request | 잘못된 요청 (파일 형식 오류, 필수 파라미터 누락 등) |
| 500 Internal Server Error | 서버 내부 오류 (AI 처리 실패, 데이터베이스 오류 등) |

---

## 사용 예시

### 전체 워크플로우

```typescript
// 1. 엑셀 파일 업로드 및 파싱
const formData = new FormData();
formData.append('file', excelFile);

const parseResponse = await fetch('https://hackathon.yeo-li.com/api/parse-excel', {
  method: 'POST',
  body: formData
});

const { data: transcript } = await parseResponse.json();

// 2. 로드맵 생성 요청
const roadmapResponse = await fetch('https://hackathon.yeo-li.com/api/generate-roadmap', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    transcript: {
      ...transcript,
      totalCredits: 60,
      totalMajorCredits: 36,
      totalGeneralCredits: 24,
      averageGPA: 4.2
    },
    careerGoal: {
      careerPath: '백엔드 개발자',
      interests: ['Spring Boot', 'AWS'],
      additionalInfo: '대기업 취업 희망'
    }
  })
});

const { data: roadmap } = await roadmapResponse.json();
console.log(roadmap);
```

---

## 참고사항

### API 제한사항
- 파일 크기 제한: 최대 10MB (추정)
- 요청 빈도 제한: 별도 제한 없음 (추정)

### 지원 파일 형식
- ✅ `.xlsx` (Excel 2007 이상)
- ✅ `.xls` (Excel 97-2003)

### 권장사항
- 성적표 파일은 세종대학교 표준 양식 사용 권장
- 진로 목표는 구체적으로 작성할수록 정확한 로드맵 생성 가능
- `interests` 배열에 3-5개의 키워드 포함 권장

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-01-15
**작성자**: Claude Code
