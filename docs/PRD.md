# 완익세종 (完益世宗)

## AI 기반 진로-교과목 로드맵 추천 시스템

> **Product Requirements Document (PRD) v1.0**  
> 작성일: 2025년 12월 23일  
> 프로젝트 유형: 해커톤 / 웹 애플리케이션  
> 타겟 사용자: 세종대학교 재학생

---

## 목차

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [데이터 구조 분석](#3-데이터-구조-분석)
4. [핵심 기능 명세](#4-핵심-기능-명세)
5. [AI API 사용 명세](#5-ai-api-사용-명세) ⭐
6. [사용자 플로우](#6-사용자-플로우)
7. [기술 아키텍처](#7-기술-아키텍처)
8. [데이터 모델](#8-데이터-모델)
9. [API 명세](#9-api-명세)
10. [UI/UX 와이어프레임](#10-uiux-와이어프레임)
11. [개발 로드맵](#11-개발-로드맵-해커톤-48시간)
12. [성공 지표](#12-성공-지표)
13. [리스크 및 대응 방안](#13-리스크-및-대응-방안)
14. [부록: 샘플 데이터 분석](#14-부록-샘플-데이터-분석)

---

## 1. Executive Summary

**완익세종(完益世宗)**은 '세종을 완전히 이롭게 하다'라는 의미로, 세종대학교 학생들의 진로 설계를 AI 기술로 지원하는 웹 서비스입니다.

학생이 **기이수성적조회 엑셀 파일**을 업로드하면, 시스템이 이수 교과목을 자동으로 분석하고 희망 진로에 맞는 **맞춤형 학습 로드맵**을 학기별·방학별로 시각화하여 제공합니다.

### 핵심 가치 제안

| 구분 | 기존 방식 | 완익세종 |
|------|----------|---------|
| 진로 탐색 | 선배 조언, 인터넷 검색 | AI 기반 체계적 분석 |
| 수강 계획 | 수동으로 커리큘럼 확인 | 자동 선후관계 분석 및 추천 |
| 방학 활용 | 개인적 계획 수립 | 맞춤형 비교과 활동 추천 |
| 역량 파악 | 주관적 자기 평가 | 데이터 기반 역량 시각화 |

---

## 2. Problem Statement

### 2.1 현재 문제점

- 학생들이 진로에 필요한 교과목을 체계적으로 파악하기 어려움
- 수강 순서와 선후관계를 고려한 로드맵 부재
- 방학 기간 활용 계획 수립의 어려움
- 기이수 과목과 미이수 과목 간의 연결고리 파악 불가
- 진로별 필요 역량과 현재 역량 간 갭(Gap) 분석 부재

### 2.2 목표

AI를 활용하여 학생 개인의 학업 현황을 분석하고, 희망 진로에 최적화된 교과목 로드맵과 비교과 활동을 **학기/방학 단위로 추천**하는 원스톱 진로 설계 플랫폼 구축

---

## 3. 데이터 구조 분석

### 3.1 기이수성적조회 엑셀 파일 구조

세종대학교 포털에서 다운로드 가능한 기이수성적조회 파일의 데이터 스키마:

| 필드명 | 데이터 타입 | 설명 | 예시 |
|--------|------------|------|------|
| 년도 | Integer | 수강 연도 | 2025 |
| 학기 | String | 학기 구분 | 1학기, 2학기, 여름학기, 겨울학기 |
| 학수번호 | String | 교과목 고유 식별자 | 004310 |
| **교과목명** | String | 과목 이름 (핵심 추출 대상) | 운영체제 |
| 이수구분 | String | 과목 분류 | 전필, 전선, 교필, 교선1, 교선2, 기교 |
| 교직영역 | String | 교직 관련 영역 | (대부분 NULL) |
| 선택영역 | String | 교양 선택 영역 | 사상과역사, 자연과과학기술 |
| 학점 | Float | 이수 학점 | 0.5 ~ 4 |
| 평가방식 | String | 성적 평가 방식 | GRADE, P/NP |
| 등급 | String | 취득 성적 | A+, A0, B+, B0, C+, C0, D+, D0, F, P, NP |
| 평점 | Float | 평점 환산 | 0.0 ~ 4.5 |
| 개설학과코드 | String | 학과 식별 코드 | 3210 |

### 3.2 데이터 파싱 시 주의사항

```python
# 엑셀 파일 구조 특이사항
- Row 0: "기이수성적" 타이틀
- Row 1-2: 헤더 행 (중복)
- Row 3~: 실제 데이터

# 파싱 시 처리 필요
1. 처음 3개 행 스킵
2. 컬럼명 매핑 (Unnamed: 1 → 년도, Unnamed: 4 → 교과목명 등)
3. NaN 값 처리
4. 데이터 타입 변환 (학점, 평점 → Float)
```

---

## 4. 핵심 기능 명세

### 4.1 기이수 데이터 업로드 및 파싱

| 기능 | 설명 | 구현 방식 |
|------|------|----------|
| 파일 업로드 | 엑셀 파일(.xlsx) 드래그 앤 드롭 | React Dropzone |
| 자동 파싱 | 교과목명, 이수구분, 학점, 등급 추출 | Python pandas + openpyxl |
| 데이터 정제 | 헤더 제거, 빈 값 처리, 타입 변환 | Backend 처리 |
| 이수 현황 대시보드 | 전공/교양 이수 현황 시각화 | Chart.js / Recharts |

### 4.2 진로 입력 및 역량 매핑

| 입력 방식 | 설명 | AI 사용 여부 |
|----------|------|-------------|
| 카테고리 선택 | 대분류 → 중분류 → 세부 직무 | ❌ (정적 데이터) |
| 자연어 입력 | "AI 엔지니어가 되고 싶어요" | ✅ **AI API 사용** |
| 복수 진로 선택 | 최대 3개까지 희망 진로 선택 | ❌ |

### 4.3 AI 기반 로드맵 생성

#### 학기 중 추천 항목
- 필수 수강 교과목 (선후관계 고려)
- 선택 수강 교과목 (관심 분야 기반)
- 교내 비교과 프로그램 (특강, 워크숍)
- 학습 그룹/스터디 추천

#### 방학 중 추천 항목
- 온라인 강의 (Coursera, Udemy, K-MOOC)
- 자격증 취득 계획
- 프로젝트/포트폴리오 제작
- 인턴십/대외활동 추천
- 코딩 테스트 대비 문제 풀이

### 4.4 로드맵 시각화

| 뷰 타입 | 설명 | 용도 |
|--------|------|------|
| 타임라인 뷰 | 학기별/월별 일정을 타임라인 형태로 표시 | 전체 일정 파악 |
| 간트 차트 | 장기 계획을 막대 그래프로 시각화 | 기간별 활동 관리 |
| 카드 뷰 | 각 활동을 카드 형태로 나열 | 드래그 앤 드롭 편집 |
| 역량 레이더 차트 | 현재 역량 vs 목표 역량 비교 | 갭 분석 |

---

## 5. AI API 사용 명세 ⭐

### 5.1 AI API 사용 시점 총정리

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI API 사용 지점                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [1] 진로 자연어 분석        ──→  사용자 입력 해석               │
│  [2] 역량 매핑              ──→  진로-역량 연결                  │
│  [3] 교과목 분류            ──→  이수 과목 카테고리화            │
│  [4] 갭 분석                ──→  현재 vs 목표 역량 비교          │
│  [5] 로드맵 생성            ──→  학기별/방학별 계획 생성         │
│  [6] 추천 사유 생성         ──→  추천 이유 자연어 설명           │
│  [7] 비교과 활동 추천       ──→  외부 리소스 매칭                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 상세 AI API 사용 명세

---

#### 📌 사용 시점 1: 진로 자연어 분석

**트리거**: 사용자가 자연어로 희망 진로 입력 시

**목적**: 자유로운 텍스트 입력을 구조화된 진로 데이터로 변환

```javascript
// 입력 예시
"나는 나중에 네이버나 카카오 같은 대기업에서 AI 챗봇 만드는 일을 하고 싶어"

// AI API 호출
const response = await fetch('/api/ai/parse-career', {
  method: 'POST',
  body: JSON.stringify({
    user_input: userCareerText,
    context: {
      department: "컴퓨터공학과",
      completed_courses: completedCoursesList
    }
  })
});

// 기대 출력 (JSON)
{
  "parsed_career": {
    "category": "IT/소프트웨어",
    "sub_category": "인공지능/머신러닝",
    "job_title": "AI 엔지니어",
    "keywords": ["NLP", "챗봇", "대화형 AI", "LLM"],
    "target_companies": ["네이버", "카카오"],
    "confidence": 0.92
  }
}
```

**프롬프트 템플릿**:
```
당신은 진로 상담 전문가입니다. 
학생의 자연어 입력을 분석하여 구조화된 진로 정보로 변환해주세요.

[학생 정보]
- 학과: {department}
- 이수 과목: {completed_courses}

[학생 입력]
"{user_input}"

다음 JSON 형식으로 응답해주세요:
{
  "category": "대분류",
  "sub_category": "중분류", 
  "job_title": "구체적 직무명",
  "keywords": ["관련 키워드 배열"],
  "target_companies": ["언급된 기업"],
  "confidence": 0.0~1.0
}
```

---

#### 📌 사용 시점 2: 진로-역량 매핑

**트리거**: 진로 선택 완료 후

**목적**: 선택한 진로에 필요한 핵심 역량 도출

```javascript
// AI API 호출
const response = await fetch('/api/ai/map-competencies', {
  method: 'POST',
  body: JSON.stringify({
    career: {
      job_title: "AI 엔지니어",
      sub_category: "인공지능/머신러닝"
    }
  })
});

// 기대 출력
{
  "required_competencies": [
    {
      "name": "머신러닝 기초",
      "importance": "필수",
      "level": 4,  // 1-5 스케일
      "description": "지도학습, 비지도학습, 강화학습의 개념과 주요 알고리즘 이해"
    },
    {
      "name": "딥러닝",
      "importance": "필수",
      "level": 4,
      "description": "CNN, RNN, Transformer 등 딥러닝 아키텍처 설계 및 구현"
    },
    {
      "name": "Python 프로그래밍",
      "importance": "필수",
      "level": 5,
      "description": "Python 고급 문법, 데이터 처리 라이브러리 활용"
    },
    {
      "name": "수학적 기초",
      "importance": "권장",
      "level": 3,
      "description": "선형대수, 확률통계, 미적분학"
    },
    {
      "name": "데이터 엔지니어링",
      "importance": "권장",
      "level": 3,
      "description": "대용량 데이터 처리, ETL 파이프라인 구축"
    }
  ],
  "soft_skills": ["문제해결능력", "커뮤니케이션", "논문 독해력"]
}
```

**프롬프트 템플릿**:
```
당신은 IT 채용 전문가입니다.
다음 직무에 필요한 핵심 역량을 분석해주세요.

[직무 정보]
- 직무명: {job_title}
- 분야: {sub_category}

다음 형식으로 5-8개의 핵심 역량을 도출해주세요:
- 기술 역량 (Hard Skills): 구체적인 기술 스택 포함
- 소프트 스킬 (Soft Skills): 필요한 비기술적 역량

각 역량에 대해 중요도(필수/권장)와 숙련도 레벨(1-5)을 포함해주세요.
```

---

#### 📌 사용 시점 3: 이수 교과목 역량 분류

**트리거**: 엑셀 파일 파싱 완료 후

**목적**: 이수한 교과목이 어떤 역량과 연결되는지 분류

```javascript
// AI API 호출
const response = await fetch('/api/ai/classify-courses', {
  method: 'POST',
  body: JSON.stringify({
    courses: [
      { name: "딥러닝", grade: "A0", credits: 3 },
      { name: "데이터베이스", grade: "A+", credits: 3 },
      { name: "웹프로그래밍", grade: "B+", credits: 3 },
      { name: "운영체제", grade: "C+", credits: 3 }
    ]
  })
});

// 기대 출력
{
  "classified_courses": [
    {
      "course_name": "딥러닝",
      "competencies": ["딥러닝", "머신러닝 기초", "Python 프로그래밍"],
      "proficiency_gained": 0.8,  // 해당 역량 습득 정도 (성적 반영)
      "career_relevance": ["AI 엔지니어", "데이터 사이언티스트"]
    },
    {
      "course_name": "데이터베이스",
      "competencies": ["데이터 엔지니어링", "SQL"],
      "proficiency_gained": 0.9,
      "career_relevance": ["백엔드 개발자", "데이터 엔지니어"]
    }
    // ...
  ]
}
```

**프롬프트 템플릿**:
```
당신은 대학 교육과정 분석 전문가입니다.
다음 교과목들이 어떤 직무 역량과 연결되는지 분석해주세요.

[이수 교과목 목록]
{courses_json}

각 교과목에 대해:
1. 관련 역량 (competencies): 해당 과목으로 습득 가능한 역량
2. 습득 정도 (proficiency_gained): 성적을 반영한 역량 습득 수준 (0.0-1.0)
   - A+/A0: 0.9-1.0
   - B+/B0: 0.7-0.8
   - C+/C0: 0.5-0.6
   - D+/D0: 0.3-0.4
3. 관련 직무 (career_relevance): 이 역량이 필요한 직무들
```

---

#### 📌 사용 시점 4: 역량 갭(Gap) 분석

**트리거**: 역량 매핑 + 교과목 분류 완료 후

**목적**: 현재 보유 역량과 목표 역량 간의 차이 분석

```javascript
// AI API 호출
const response = await fetch('/api/ai/analyze-gap', {
  method: 'POST',
  body: JSON.stringify({
    target_career: "AI 엔지니어",
    required_competencies: requiredCompetencies,
    current_competencies: currentCompetencies
  })
});

// 기대 출력
{
  "gap_analysis": {
    "overall_readiness": 0.65,  // 전체 준비도 (65%)
    "gaps": [
      {
        "competency": "자연어처리(NLP)",
        "required_level": 4,
        "current_level": 1,
        "gap": 3,
        "priority": "높음",
        "recommendation": "NLP 관련 전공 선택 과목 수강 필요"
      },
      {
        "competency": "MLOps",
        "required_level": 3,
        "current_level": 0,
        "gap": 3,
        "priority": "중간",
        "recommendation": "방학 중 Docker, Kubernetes 학습 권장"
      }
    ],
    "strengths": [
      {
        "competency": "Python 프로그래밍",
        "current_level": 4,
        "note": "C프로그래밍, 문제해결실습 등 충분한 기초 확보"
      }
    ]
  }
}
```

**프롬프트 템플릿**:
```
당신은 커리어 코치입니다.
학생의 현재 역량과 목표 직무의 필요 역량을 비교 분석해주세요.

[목표 직무]
{target_career}

[필요 역량]
{required_competencies_json}

[현재 보유 역량]
{current_competencies_json}

분석 결과:
1. 전체 준비도 (0.0-1.0)
2. 역량 갭 목록 (부족한 역량, 우선순위, 개선 방안)
3. 강점 목록 (이미 충분한 역량)
```

---

#### 📌 사용 시점 5: 로드맵 생성 (핵심 기능) ⭐⭐⭐

**트리거**: 갭 분석 완료 후 "로드맵 생성" 버튼 클릭

**목적**: 학기별/방학별 구체적인 학습 계획 생성

```javascript
// AI API 호출
const response = await fetch('/api/ai/generate-roadmap', {
  method: 'POST',
  body: JSON.stringify({
    user_info: {
      current_semester: "2025-1",
      remaining_semesters: 4,  // 남은 학기 수
      department: "컴퓨터공학과"
    },
    gap_analysis: gapAnalysisResult,
    available_courses: courseDatabase,  // 학교 개설 교과목 DB
    preferences: {
      study_intensity: "보통",  // 낮음/보통/높음
      include_vacation: true
    }
  })
});

// 기대 출력
{
  "roadmap": {
    "title": "AI 엔지니어 준비 로드맵",
    "total_duration": "2년 (4학기 + 4방학)",
    "periods": [
      {
        "period_id": "2025-summer",
        "period_name": "2025년 여름방학",
        "type": "vacation",
        "duration": "8주",
        "items": [
          {
            "id": "item-001",
            "type": "online_course",
            "title": "Coursera - Machine Learning Specialization",
            "provider": "Stanford/Coursera",
            "duration": "4주",
            "priority": "높음",
            "competencies": ["머신러닝 기초"],
            "reason": "부족한 ML 기초 역량 보완",
            "link": "https://www.coursera.org/specializations/machine-learning"
          },
          {
            "id": "item-002",
            "type": "project",
            "title": "개인 프로젝트: 감성 분석 챗봇",
            "duration": "4주",
            "priority": "중간",
            "competencies": ["NLP", "Python"],
            "reason": "포트폴리오 구축 + NLP 실습",
            "deliverable": "GitHub 저장소 + 데모 사이트"
          }
        ]
      },
      {
        "period_id": "2025-2",
        "period_name": "2025년 2학기",
        "type": "semester",
        "items": [
          {
            "id": "item-003",
            "type": "course",
            "title": "기계학습",
            "course_code": "CSE4007",
            "credits": 3,
            "priority": "필수",
            "competencies": ["머신러닝 기초"],
            "reason": "AI 엔지니어 필수 과목",
            "prerequisites": ["확률및통계", "선형대수학"]
          },
          {
            "id": "item-004",
            "type": "course",
            "title": "자연어처리",
            "course_code": "CSE4029",
            "credits": 3,
            "priority": "높음",
            "competencies": ["NLP"],
            "reason": "챗봇 개발에 핵심적인 과목"
          },
          {
            "id": "item-005",
            "type": "extracurricular",
            "title": "AI 학회 가입",
            "priority": "권장",
            "competencies": ["네트워킹", "최신 트렌드"],
            "reason": "스터디 그룹 + 프로젝트 경험"
          }
        ]
      },
      {
        "period_id": "2025-winter",
        "period_name": "2025년 겨울방학",
        "type": "vacation",
        "duration": "6주",
        "items": [
          {
            "id": "item-006",
            "type": "certification",
            "title": "TensorFlow Developer Certificate",
            "provider": "Google",
            "duration": "3주 준비",
            "priority": "중간",
            "competencies": ["딥러닝", "TensorFlow"],
            "reason": "공인 자격증으로 역량 증명"
          },
          {
            "id": "item-007",
            "type": "coding_test",
            "title": "코딩테스트 대비",
            "platform": "백준, 프로그래머스",
            "target": "골드 이상 달성",
            "duration": "매일 1-2문제",
            "priority": "높음",
            "reason": "대기업 입사 필수 관문"
          }
        ]
      }
      // ... 추가 학기/방학
    ]
  }
}
```

**프롬프트 템플릿**:
```
당신은 대학생 진로 설계 전문 컨설턴트입니다.
학생의 현재 상황과 목표를 바탕으로 구체적인 학습 로드맵을 생성해주세요.

[학생 정보]
- 학과: {department}
- 현재 학기: {current_semester}
- 남은 학기: {remaining_semesters}
- 목표 직무: {target_career}

[역량 갭 분석 결과]
{gap_analysis_json}

[개설 교과목 목록]
{available_courses_json}

[요청사항]
1. 학기별로 수강해야 할 교과목 추천 (선후관계 고려)
2. 방학별 활동 추천:
   - 온라인 강의 (구체적인 강의명, 플랫폼, 링크)
   - 자격증 (준비 기간 포함)
   - 프로젝트 (결과물 명시)
   - 코딩 테스트 대비
   - 인턴십/대외활동
3. 각 항목에 대해:
   - 우선순위 (필수/높음/중간/낮음)
   - 관련 역량
   - 추천 이유
   - 예상 소요 시간
```

---

#### 📌 사용 시점 6: 추천 사유 자연어 생성

**트리거**: 로드맵 항목 상세 보기 클릭 시

**목적**: 왜 이 항목을 추천했는지 친근한 설명 제공

```javascript
// AI API 호출
const response = await fetch('/api/ai/explain-recommendation', {
  method: 'POST',
  body: JSON.stringify({
    item: {
      title: "기계학습",
      type: "course"
    },
    user_context: {
      completed_courses: ["딥러닝", "확률및통계"],
      target_career: "AI 엔지니어",
      gap: "머신러닝 기초 역량 부족"
    }
  })
});

// 기대 출력
{
  "explanation": {
    "summary": "AI 엔지니어가 되기 위한 핵심 과목이에요!",
    "detailed": "이미 딥러닝과 확률및통계를 이수하셨네요. 기계학습은 이 기초 위에서 더 깊은 ML 알고리즘을 배우는 과목이에요. 지도학습, 비지도학습, 앙상블 기법 등을 배우게 되는데, 이건 AI 엔지니어 면접에서 거의 100% 물어보는 내용이에요.",
    "tips": [
      "수업 전에 Andrew Ng의 ML 강의를 미리 보면 도움이 돼요",
      "실습 과제가 많으니 Python 코딩에 익숙해지세요",
      "스터디 그룹을 만들어서 과제를 함께 하면 좋아요"
    ]
  }
}
```

---

#### 📌 사용 시점 7: 외부 리소스 추천

**트리거**: 방학 로드맵 생성 시

**목적**: 구체적인 온라인 강의, 자격증, 대외활동 추천

```javascript
// AI API 호출 (웹 검색 기능 활용 가능)
const response = await fetch('/api/ai/recommend-resources', {
  method: 'POST',
  body: JSON.stringify({
    competency_gap: ["NLP", "MLOps"],
    resource_type: "online_course",
    preferences: {
      language: "한국어 우선",
      budget: "무료/저렴",
      duration: "4주 이내"
    }
  })
});

// 기대 출력
{
  "recommendations": [
    {
      "title": "네이버 부스트캠프 AI Tech",
      "provider": "네이버 커넥트재단",
      "type": "부트캠프",
      "duration": "5개월",
      "cost": "무료",
      "url": "https://boostcamp.connect.or.kr/",
      "match_score": 0.95,
      "note": "NLP 트랙 선택 가능, 수료 시 네이버 입사 연계"
    },
    {
      "title": "모두를 위한 딥러닝 시즌2",
      "provider": "sung kim / YouTube",
      "type": "무료 강의",
      "duration": "자율",
      "cost": "무료",
      "url": "https://youtube.com/...",
      "match_score": 0.88,
      "note": "한국어 강의, PyTorch 기반"
    }
  ]
}
```

---

### 5.3 AI API 호출 최적화 전략

#### 비용 절감 방안

| 전략 | 설명 | 예상 절감 |
|------|------|----------|
| **결과 캐싱** | 동일 진로의 역량 매핑 결과 DB 저장 | 60% |
| **배치 처리** | 교과목 분류를 한 번에 요청 | 30% |
| **프롬프트 최적화** | 불필요한 컨텍스트 제거 | 20% |
| **모델 선택** | 단순 분류는 gpt-3.5, 복잡한 생성은 gpt-4 | 40% |

#### API 호출 흐름도

```
사용자 액션              API 호출                    캐싱 여부
───────────────────────────────────────────────────────────────
파일 업로드      →      교과목 분류 API           →    ✅ 캐싱 가능
                           ↓
진로 입력        →      자연어 분석 API           →    ❌ 매번 호출
(자연어)                   ↓
                       역량 매핑 API              →    ✅ 진로별 캐싱
                           ↓
분석 요청        →      갭 분석 API               →    ❌ 개인화 필요
                           ↓
로드맵 생성      →      로드맵 생성 API           →    ❌ 개인화 필요
                           ↓
항목 클릭        →      추천 사유 API             →    ✅ 항목별 캐싱
```

#### Rate Limiting

```javascript
// API 호출 제한 설정
const rateLimits = {
  per_user_per_day: 50,      // 사용자당 일일 50회
  per_user_per_hour: 20,     // 사용자당 시간당 20회
  total_per_minute: 100      // 전체 분당 100회
};
```

---

### 5.4 AI API 선택 가이드

| 용도 | 추천 모델 | 이유 |
|------|----------|------|
| 진로 자연어 분석 | Claude 3.5 Sonnet | 한국어 이해도 높음 |
| 역량 매핑 | GPT-4o-mini | 빠른 응답, 저렴한 비용 |
| 교과목 분류 | GPT-3.5-turbo | 단순 분류 작업에 충분 |
| 로드맵 생성 | Claude 3.5 Sonnet / GPT-4o | 복잡한 추론 필요 |
| 추천 사유 | GPT-4o-mini | 자연스러운 한국어 생성 |

---

### 5.5 AI API 사용 시점 요약표

| # | 사용 시점 | 트리거 | 입력 | 출력 | 캐싱 |
|---|----------|--------|------|------|------|
| 1 | 진로 자연어 분석 | 자연어 진로 입력 | 사용자 텍스트 | 구조화된 진로 정보 | ❌ |
| 2 | 역량 매핑 | 진로 선택 완료 | 직무명, 분야 | 필요 역량 목록 | ✅ |
| 3 | 교과목 분류 | 엑셀 파싱 완료 | 이수 과목 목록 | 역량-과목 매핑 | ✅ |
| 4 | 갭 분석 | 분석 버튼 클릭 | 필요역량, 보유역량 | 갭 분석 결과 | ❌ |
| 5 | 로드맵 생성 | 생성 버튼 클릭 | 갭 분석, 개설 과목 | 학기별 로드맵 | ❌ |
| 6 | 추천 사유 | 항목 상세 클릭 | 항목 정보, 컨텍스트 | 자연어 설명 | ✅ |
| 7 | 외부 리소스 | 방학 로드맵 생성 | 역량 갭, 선호도 | 강의/자격증 목록 | ✅ |

---

## 6. 사용자 플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                        사용자 여정                               │
└─────────────────────────────────────────────────────────────────┘

[1] 랜딩 페이지 접속
         │
         ▼
[2] 회원가입/로그인 ─────────────────────────────────────────────┐
         │                                                        │
         ▼                                                        │
[3] 기이수성적 엑셀 업로드                                         │
         │                                                        │
         │ ◀─── AI: 교과목 분류 API                               │
         ▼                                                        │
[4] 이수 현황 대시보드 확인                                        │
         │                                                        │
         ▼                                                        │
[5] 희망 진로 입력 ──────────────────────────────────────────┐   │
         │                                                   │   │
         │ ◀─── AI: 자연어 분석 API (자유 입력 시)            │   │
         │ ◀─── AI: 역량 매핑 API                            │   │
         ▼                                                   │   │
[6] 역량 갭 분석 결과 확인                                    │   │
         │                                                   │   │
         │ ◀─── AI: 갭 분석 API                              │   │
         ▼                                                   │   │
[7] 로드맵 생성                                              │   │
         │                                                   │   │
         │ ◀─── AI: 로드맵 생성 API (핵심!)                   │   │
         ▼                                                   │   │
[8] 로드맵 확인 및 수정                                       │   │
         │                                                   │   │
         │ ◀─── AI: 추천 사유 API (항목 클릭 시)              │   │
         ▼                                                   │   │
[9] 로드맵 저장/내보내기                                      │   │
         │                                                   │   │
         ▼                                                   │   │
[10] 진행 상황 추적 (체크리스트)                               │   │
         │                                                   │   │
         └──────── 진로 변경 시 ─────────────────────────────┘   │
                                                                 │
         └──────── 새 학기 시작 시 ──────────────────────────────┘
```

---

## 7. 기술 아키텍처

### 7.1 시스템 구성도

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js (React + TypeScript)                │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ 업로드   │ │ 대시보드 │ │ 진로설정 │ │ 로드맵   │   │   │
│  │  │ 페이지   │ │  페이지  │ │  페이지  │ │  페이지  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ REST API / WebSocket
┌───────────────────────────────▼─────────────────────────────────┐
│                         Backend Layer                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  FastAPI (Python)                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Auth     │ │ Parser   │ │ AI       │ │ Roadmap  │   │   │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │   │   │
│  │  └──────────┘ └──────────┘ └────┬─────┘ └──────────┘   │   │
│  └─────────────────────────────────┼───────────────────────┘   │
└────────────────────────────────────┼────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────┐
│                         AI/ML Layer                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │   OpenAI API          Claude API         Embedding      │   │
│  │   (GPT-4o)            (Sonnet)           (ada-002)      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                         Data Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  PostgreSQL  │  │   Supabase   │  │       Redis          │  │
│  │  (메인 DB)   │  │  (Storage)   │  │  (캐싱/세션)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 기술 스택 상세

| 계층 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **Frontend** | Next.js | 14.x | React 프레임워크 |
| | TypeScript | 5.x | 타입 안정성 |
| | Tailwind CSS | 3.x | 스타일링 |
| | Chart.js / Recharts | - | 데이터 시각화 |
| | React Query | 5.x | 서버 상태 관리 |
| | Zustand | 4.x | 클라이언트 상태 관리 |
| **Backend** | FastAPI | 0.100+ | API 서버 |
| | Python | 3.11+ | 백엔드 언어 |
| | pandas | 2.x | 엑셀 파싱 |
| | openpyxl | 3.x | xlsx 파일 처리 |
| | Pydantic | 2.x | 데이터 검증 |
| **AI/ML** | OpenAI API | - | GPT 모델 |
| | Anthropic API | - | Claude 모델 |
| | LangChain | 0.1+ | LLM 오케스트레이션 |
| **Database** | PostgreSQL | 15+ | 메인 데이터베이스 |
| | Supabase | - | BaaS (인증, 스토리지) |
| | Redis | 7+ | 캐싱, 세션 |
| **Deployment** | Vercel | - | Frontend 배포 |
| | Railway / Fly.io | - | Backend 배포 |

---

## 8. 데이터 모델

### 8.1 ERD (Entity Relationship Diagram)

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │     Career      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ email           │       │ name            │
│ name            │       │ category        │
│ department      │       │ sub_category    │
│ admission_year  │       │ required_comps  │
│ created_at      │       │ description     │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │ 1:N                     │ N:M
         ▼                         │
┌─────────────────┐                │
│ CompletedCourse │                │
├─────────────────┤                │
│ id (PK)         │                │
│ user_id (FK)    │                │
│ course_code     │                │
│ course_name     │                │
│ category        │                │
│ credits         │                │
│ grade           │                │
│ year            │                │
│ semester        │                │
│ competencies    │ ◀──────────────┘
└─────────────────┘
         │
         │ 참조
         ▼
┌─────────────────┐       ┌─────────────────┐
│     Roadmap     │       │   RoadmapItem   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │ 1:N   │ id (PK)         │
│ user_id (FK)    │──────▶│ roadmap_id (FK) │
│ career_id (FK)  │       │ type            │
│ title           │       │ title           │
│ status          │       │ description     │
│ created_at      │       │ period          │
│ updated_at      │       │ priority        │
└─────────────────┘       │ is_completed    │
                          │ order           │
                          │ metadata (JSON) │
                          └─────────────────┘
```

### 8.2 주요 테이블 스키마

```sql
-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    admission_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 이수 교과목 테이블
CREATE TABLE completed_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    category VARCHAR(20), -- 전필, 전선, 교필, 교선 등
    credits DECIMAL(2,1),
    grade VARCHAR(5),
    grade_point DECIMAL(2,1),
    year INTEGER,
    semester VARCHAR(20),
    competencies JSONB, -- AI 분석 결과 저장
    created_at TIMESTAMP DEFAULT NOW()
);

-- 로드맵 테이블
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_id UUID REFERENCES careers(id),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, archived
    gap_analysis JSONB, -- 역량 갭 분석 결과
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 로드맵 항목 테이블
CREATE TABLE roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- course, online_course, project, certification, etc
    title VARCHAR(200) NOT NULL,
    description TEXT,
    period VARCHAR(50), -- 2025-1, 2025-summer, etc
    period_type VARCHAR(20), -- semester, vacation
    priority VARCHAR(20), -- 필수, 높음, 중간, 낮음
    competencies JSONB,
    reason TEXT, -- AI 추천 사유
    metadata JSONB, -- 추가 정보 (링크, 비용 등)
    is_completed BOOLEAN DEFAULT FALSE,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI 응답 캐시 테이블
CREATE TABLE ai_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    cache_type VARCHAR(50), -- competency_mapping, course_classification, etc
    request_hash VARCHAR(64),
    response JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);
```

---

## 9. API 명세

### 9.1 인증 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 현재 사용자 정보 |

### 9.2 파일 업로드 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/upload/transcript` | 기이수성적 엑셀 업로드 |
| GET | `/api/courses/completed` | 이수 교과목 목록 조회 |
| GET | `/api/courses/stats` | 이수 현황 통계 |

### 9.3 진로 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/careers` | 진로 카테고리 목록 |
| GET | `/api/careers/:id` | 진로 상세 정보 |
| POST | `/api/careers/search` | 진로 검색 |

### 9.4 AI 분석 API ⭐

| Method | Endpoint | 설명 | AI 사용 |
|--------|----------|------|---------|
| POST | `/api/ai/parse-career` | 자연어 진로 분석 | ✅ |
| POST | `/api/ai/map-competencies` | 역량 매핑 | ✅ |
| POST | `/api/ai/classify-courses` | 교과목 역량 분류 | ✅ |
| POST | `/api/ai/analyze-gap` | 역량 갭 분석 | ✅ |
| POST | `/api/ai/generate-roadmap` | 로드맵 생성 | ✅ |
| POST | `/api/ai/explain-recommendation` | 추천 사유 생성 | ✅ |
| POST | `/api/ai/recommend-resources` | 외부 리소스 추천 | ✅ |

### 9.5 로드맵 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/roadmaps` | 내 로드맵 목록 |
| GET | `/api/roadmaps/:id` | 로드맵 상세 |
| POST | `/api/roadmaps` | 로드맵 생성 |
| PUT | `/api/roadmaps/:id` | 로드맵 수정 |
| DELETE | `/api/roadmaps/:id` | 로드맵 삭제 |
| PUT | `/api/roadmaps/:id/items/:itemId` | 항목 수정 |
| PUT | `/api/roadmaps/:id/items/:itemId/complete` | 항목 완료 처리 |
| GET | `/api/roadmaps/:id/export` | PDF/이미지 내보내기 |

---

## 10. UI/UX 와이어프레임

### 10.1 주요 화면 구성

| 화면 | 주요 구성요소 | 설명 |
|------|--------------|------|
| 랜딩 페이지 | 서비스 소개, CTA 버튼, 데모 영상 | 첫인상 및 가치 전달 |
| 업로드 페이지 | 파일 드롭존, 가이드, 진행률 | 엑셀 파일 업로드 |
| 대시보드 | 이수 현황 차트, 학점 통계 | 현재 상태 파악 |
| 진로 설정 | 카테고리 셀렉터, 검색창, 추천 카드 | 목표 설정 |
| 갭 분석 | 레이더 차트, 갭 목록, 우선순위 | 현재 vs 목표 비교 |
| 로드맵 뷰 | 타임라인, 카드, 필터, 드래그앤드롭 | 계획 확인 및 수정 |
| 항목 상세 | 상세 정보, 추천 사유, 링크 | 구체적 액션 안내 |

### 10.2 로드맵 뷰 상세 레이아웃

```
┌─────────────────────────────────────────────────────────────────┐
│  완익세종   [대시보드] [로드맵] [설정]              [사용자명] ▼  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🎯 AI 엔지니어 로드맵                    [필터 ▼] [내보내기]│ │
│  │  전체 준비도: ████████████░░░░░░ 65%                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ 2025 여름방학 ─────────────────────────────────────────────┐│
│  │                                                              ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         ││
│  │  │ 📚 온라인   │  │ 💻 프로젝트 │  │ 📝 코딩테스트│         ││
│  │  │ ML 강의     │  │ 챗봇 개발   │  │ 백준 골드   │         ││
│  │  │ ─────────── │  │ ─────────── │  │ ─────────── │         ││
│  │  │ Coursera    │  │ 4주         │  │ 매일 1문제  │         ││
│  │  │ 4주 | 필수  │  │ 중간        │  │ 높음        │         ││
│  │  │ □ 미완료    │  │ □ 미완료    │  │ □ 미완료    │         ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘         ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─ 2025년 2학기 ──────────────────────────────────────────────┐│
│  │                                                              ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         ││
│  │  │ 🎓 기계학습 │  │ 🎓 NLP      │  │ 👥 AI 학회  │         ││
│  │  │ CSE4007     │  │ CSE4029     │  │ 가입        │         ││
│  │  │ ─────────── │  │ ─────────── │  │ ─────────── │         ││
│  │  │ 3학점       │  │ 3학점       │  │ 비교과      │         ││
│  │  │ 필수        │  │ 높음        │  │ 권장        │         ││
│  │  │ □ 미완료    │  │ □ 미완료    │  │ □ 미완료    │         ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘         ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. 개발 로드맵 (해커톤 48시간)

### Phase 1: 기반 구축 (0-6시간)

| 작업 | 담당 | 산출물 |
|------|------|--------|
| 프로젝트 초기 설정 | 전체 | Next.js + FastAPI 보일러플레이트 |
| DB 스키마 설계 | Backend | PostgreSQL 테이블 생성 |
| Supabase 설정 | Backend | 인증, 스토리지 연동 |
| 기본 UI 컴포넌트 | Frontend | 버튼, 카드, 레이아웃 |

### Phase 2: 핵심 기능 A (6-12시간)

| 작업 | 담당 | 산출물 |
|------|------|--------|
| 엑셀 파싱 로직 | Backend | 파싱 API 완성 |
| 파일 업로드 UI | Frontend | 드래그앤드롭 업로더 |
| 이수 현황 대시보드 | Frontend | 차트, 통계 표시 |

### Phase 3: 핵심 기능 B (12-24시간)

| 작업 | 담당 | 산출물 |
|------|------|--------|
| AI 서비스 연동 | Backend | OpenAI/Claude API 연동 |
| 진로 입력 UI | Frontend | 카테고리 선택, 검색 |
| 역량 매핑 API | Backend | 진로-역량 분석 |
| 갭 분석 API | Backend | 역량 비교 분석 |

### Phase 4: 로드맵 기능 (24-36시간)

| 작업 | 담당 | 산출물 |
|------|------|--------|
| 로드맵 생성 API | Backend | AI 로드맵 생성 |
| 타임라인 뷰 | Frontend | 학기/방학별 표시 |
| 카드 컴포넌트 | Frontend | 항목 카드 UI |
| 드래그앤드롭 | Frontend | 순서 변경 기능 |

### Phase 5: 마무리 (36-48시간)

| 작업 | 담당 | 산출물 |
|------|------|--------|
| UI/UX 폴리싱 | Frontend | 디자인 개선 |
| 버그 수정 | 전체 | 안정화 |
| 발표 자료 | 전체 | PPT, 데모 시나리오 |
| 배포 | 전체 | Vercel + Railway |

---

## 12. 성공 지표

### 12.1 기술 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 파일 업로드 성공률 | 95% 이상 | 업로드 시도 대비 성공 |
| 로드맵 생성 소요시간 | 10초 이내 | API 응답 시간 |
| 페이지 로드 시간 | 2초 이내 | Lighthouse |
| AI API 응답 시간 | 5초 이내 | 평균 응답 시간 |

### 12.2 사용자 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 사용자 만족도 | 4.0/5.0 이상 | 사후 설문 |
| 로드맵 완성률 | 70% 이상 | 생성 시작 대비 완료 |
| 로드맵 수정률 | 30% 이상 | 1회 이상 수정한 사용자 |
| 재방문율 | 7일 내 50% | 방문 로그 |

---

## 13. 리스크 및 대응 방안

| 리스크 | 영향도 | 발생 확률 | 대응 방안 |
|--------|--------|----------|----------|
| 엑셀 형식 변경 | 높음 | 낮음 | 유연한 파싱 로직 + 수동 입력 대안 |
| AI API 비용 초과 | 중간 | 중간 | 결과 캐싱 + 일일 사용량 제한 |
| AI API 장애 | 높음 | 낮음 | Fallback 모델 준비 (GPT ↔ Claude) |
| 개인정보 유출 | 높음 | 낮음 | 파일 즉시 삭제 + 암호화 저장 |
| 추천 정확도 낮음 | 중간 | 중간 | 사용자 피드백 수집 + 프롬프트 개선 |
| 해커톤 시간 부족 | 높음 | 중간 | MVP 기능 우선순위화 |

---

## 14. 부록: 샘플 데이터 분석

### 14.1 업로드된 파일 분석 결과

업로드된 `기이수성적조회_20251223.xlsx` 파일 분석:

**기본 정보**
- 총 이수 과목: 41개
- 수강 기간: 2020년 1학기 ~ 2025년 1학기
- 추정 학과: 컴퓨터공학과 (개설학과코드 3210 기준)

### 14.2 이수 교과목 분류

**전공필수 (8과목)**
- 운영체제, 컴퓨터구조, 알고리즘및실습, 디지털시스템
- 자료구조및실습, 고급C프로그래밍및실습, 공학설계기초, C프로그래밍및실습

**전공선택 (8과목)**
- 웹프로그래밍, 데이터베이스, 확률및통계, 딥러닝
- 지능사물인터넷개론, 이산수학및프로그래밍, 문제해결및실습:JAVA, 문제해결및실습:C++

**교양필수 (7과목)**
- 취창업과진로설계, 창업과기업가정신1, 대학생활과진로설계
- English Reading/Listening Practice, 문제해결을위한글쓰기와발표, 서양철학:쟁점과토론, 신입생세미나

**교양선택 (18과목)**
- 사상과역사: 동서양고전문학강독, 서양고전강독3, 동양고전강독2, 세계사:인간과문명, 채플1-3
- 자연과과학기술: 유니스토리, 천문학의세계, K-MOOC:코딩과스토리텔링, 고급프로그래밍입문-P
- 생명과과학: 일반물리학및실험1, 기초미적분학, 공업수학1, 푸른바다생물이야기
- 융합과창업: 영상스토리텔링
- 인성과창의력: 세종사회봉사1

### 14.3 성적 분포

| 등급 | 과목 수 | 비율 |
|------|--------|------|
| A+ | 12 | 29% |
| A0 | 5 | 12% |
| B+ | 8 | 20% |
| B0 | 2 | 5% |
| C+ | 4 | 10% |
| P | 9 | 22% |
| NP | 1 | 2% |

### 14.4 AI 분석 예상 결과

해당 학생이 "AI 엔지니어"를 목표로 설정할 경우:

**강점 역량**
- ✅ 딥러닝 (A0)
- ✅ 데이터베이스 (A+)
- ✅ Python/C++ 프로그래밍 기초
- ✅ 확률및통계 (B+)

**보완 필요 역량**
- ⚠️ 기계학습 심화 (미이수)
- ⚠️ 자연어처리 (미이수)
- ⚠️ 컴퓨터비전 (미이수)
- ⚠️ MLOps/배포 경험

**추천 로드맵 미리보기**
1. 2025 여름방학: ML 온라인 강의, 개인 프로젝트
2. 2025 2학기: 기계학습, 자연어처리 수강
3. 2025 겨울방학: TensorFlow 자격증, 포트폴리오 구축
4. 2026 1학기: 캡스톤 프로젝트, 인턴십 지원

---

## 문서 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2025-12-23 | - | 최초 작성 |

---

> **완익세종** - 당신의 진로를 완전하게 설계합니다 🎓