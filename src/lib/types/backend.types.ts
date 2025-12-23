/**
 * Backend API Type Definitions
 * Types that match the external Spring Boot backend API
 * Base URL: https://hackathon.yeo-li.com
 */

/**
 * Backend Course Model
 * Extends frontend Course with additional semester tracking fields
 */
export interface BackendCourse {
  /** 이수 연도 (Completed year - int32) */
  completedYear: number;
  /** 이수 학기 (Completed semester - int32: 1 or 2) */
  completedSemester: number;
  /** 학수번호 (Course code) */
  courseCode: string;
  /** 교과목명 (Course name) */
  courseName: string;
  /** 이수구분 (Course type) */
  courseType: string;
  /** 교직영역 (Teaching area) */
  teachingArea: string | null;
  /** 선택영역 (Selected area) */
  selectedArea: string | null;
  /** 학점 (Credits - double) */
  credits: number;
  /** 평가방식 (Evaluation type) */
  evaluationType: string;
  /** 등급 (Grade) */
  grade: string;
  /** 평점 (Grade point - double) */
  gradePoint: number;
  /** 개설학과코드 (Department code) */
  departmentCode: string;
}

/**
 * Backend Transcript Model
 * All fields are required (not optional like frontend)
 */
export interface BackendTranscript {
  /** 이수 과목 목록 */
  courses: BackendCourse[];
  /** 총 학점 (double) */
  totalCredits: number;
  /** 전공 총 학점 (int32) */
  totalMajorCredits: number;
  /** 교양 총 학점 (int32) */
  totalGeneralCredits: number;
  /** 평균 평점 (double) */
  averageGPA: number;
}

/**
 * Subject Summary (Backend-specific)
 * Detailed course information for recommendations
 */
export interface SubjectSummary {
  /** 학수번호 */
  courseCode: string;
  /** 교과목명 */
  courseName: string;
  /** 이수구분 */
  courseType: string;
  /** 선택영역 */
  selectedArea: string;
  /** 학점 (double) */
  credits: number;
  /** 학년 (int32) */
  gradeLevel: number;
  /** 개설학과전공 */
  offeringDepartmentMajor: string;
  /** 주관학과 */
  hostDepartment: string;
  /** 강의언어 */
  lectureLanguage: string;
  /** 수업형태 */
  courseFormat: string;
  /** 요일/교시 */
  schedule: string;
  /** 강의실 */
  classroom: string;
}

/**
 * Scored Subject (Backend)
 * Subject with AI-generated score and recommendation reasons
 */
export interface ScoredSubject {
  /** 과목 정보 */
  subject: SubjectSummary;
  /** 점수 (int32) */
  score: number;
  /** 추천 이유 */
  reasons: string[];
}

/**
 * Subject Recommendations (Backend)
 * AI-generated subject recommendations based on career goal
 */
export interface SubjectRecommendations {
  /** 매칭된 분야 */
  matchedSectors: string[];
  /** 추천 과목 수 (int32) */
  topN: number;
  /** 점수가 매겨진 과목 목록 */
  subjects: ScoredSubject[];
}

/**
 * Weight Rule (Backend)
 * Rule for subject evaluation weighting
 */
export interface WeightRule {
  /** 규칙 */
  rule: string;
  /** 점수 (int32) */
  score: number;
  /** 이유 */
  reason: string;
}

/**
 * Weight Hints (Backend)
 * Subject evaluation weight rules by career path
 */
export interface WeightHints {
  /** 매칭된 분야 */
  matchedSectors: string[];
  /** 분야별 키워드 */
  sectorKeywords: Record<string, string[]>;
  /** 가중치 규칙 */
  weightRules: WeightRule[];
  /** 기본 추천 수 (int32) */
  defaultN: number;
  /** 참고사항 */
  notes: string;
}

/**
 * Current Skills (Backend)
 * Same as frontend but explicitly defined for clarity
 */
export interface CurrentSkills {
  /** 강점 */
  strengths: string[];
  /** 부족한 부분 */
  gaps: string[];
}

/**
 * Course Plan (Backend)
 * Semester-based course recommendations
 */
export interface CoursePlan {
  /** 기간 (e.g., "2025년 1학기") */
  period: string;
  /** 목표 */
  goal: string;
  /** 추천 과목 목록 */
  courses: BackendCourse[];
  /** 예상 학습량 */
  effort: string;
}

/**
 * Extracurricular Plan (Backend)
 * Non-course activity recommendations
 */
export interface ExtracurricularPlan {
  /** 기간 */
  period: string;
  /** 목표 */
  goal: string;
  /** 추천 활동 */
  activities: string[];
  /** 예상 학습량 */
  effort: string;
}

/**
 * Backend Roadmap Response
 * Complete AI roadmap response from backend
 */
export interface BackendRoadmapResponse {
  /** 진로 요약 */
  careerSummary: string;
  /** 현재 역량 분석 */
  currentSkills: CurrentSkills;
  /** 학기별 수강 계획 */
  coursePlan: CoursePlan[];
  /** 비교과 활동 계획 */
  extracurricularPlan: ExtracurricularPlan[];
  /** 추가 조언 */
  advice: string;
  /** 생성 일시 */
  generatedAt: string;
  /** 과목 추천 */
  subjectRecommendations: SubjectRecommendations;
  /** 가중치 힌트 */
  weightHints: WeightHints;
}

/**
 * Backend API Response Wrapper
 */
export interface BackendApiResponse<T> {
  /** 성공 여부 */
  success: boolean;
  /** 응답 데이터 */
  data?: T;
  /** 에러 메시지 */
  error?: string;
}

/**
 * Backend Parse Excel Response
 */
export type BackendParseExcelResponse = BackendApiResponse<BackendTranscript>;

/**
 * Backend Generate Roadmap Response
 */
export type BackendGenerateRoadmapResponse = BackendApiResponse<BackendRoadmapResponse>;

/**
 * Backend Weight Hints Response
 */
export type BackendWeightHintsResponse = BackendApiResponse<WeightHints>;

/**
 * Subject Score Request
 */
export interface SubjectScoreRequest {
  /** 희망 진로 */
  careerGoal: string;
  /** 평가할 과목 목록 */
  subjects: SubjectSummary[];
  /** 상위 N개 반환 (선택) */
  topN?: number;
}

/**
 * Subject Score Response Data
 */
export interface SubjectScoreResponseData {
  /** 매칭된 분야 */
  matchedSectors: string[];
  /** 점수가 매겨진 과목 목록 */
  subjects: ScoredSubject[];
}

/**
 * Backend Subject Score Response
 */
export type BackendSubjectScoreResponse = BackendApiResponse<SubjectScoreResponseData>;
