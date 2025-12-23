/**
 * TypeScript Type Definitions
 * Shared types for 완익세종 application
 */

/**
 * Course information from Excel transcript
 */
export interface Course {
  /** 학수번호 (Course code) */
  courseCode: string;
  /** 교과목명 (Course name) */
  courseName: string;
  /** 이수구분 (Course type: 전공필수, 전공선택, 교양필수, 교양선택, 교직 등) */
  courseType: string;
  /** 교직영역 (Teaching area: 교직이론, 교직소양, 교육실습 등) */
  teachingArea?: string | null;
  /** 선택영역 (Selected area) */
  selectedArea?: string | null;
  /** 학점 (Credits) */
  credits: number;
  /** 평가방식 (Evaluation type: 절대평가, 상대평가 등) */
  evaluationType: string;
  /** 등급 (Grade: A+, A, B+ 등) */
  grade: string;
  /** 평점 (Grade point: 4.5, 4.0 등) */
  gradePoint: number;
  /** 개설학과코드 (Department code) */
  departmentCode?: string | null;
}

/**
 * Parsed transcript data from Excel
 */
export interface TranscriptData {
  /** 이수 과목 리스트 (List of completed courses) */
  courses: Course[];
  /** 총 학점 (Total credits) */
  totalCredits: number;
  /** 전공 총 학점 (Total major credits) */
  totalMajorCredits?: number;
  /** 교양 총 학점 (Total general education credits) */
  totalGeneralCredits?: number;
  /** 평균 평점 (Average GPA, max 4.5) */
  averageGPA?: number;
}

/**
 * Career goal input from user
 */
export interface CareerGoal {
  /** 희망 진로 (Desired career path) */
  careerPath: string;
  /** 관심 분야 (Interest areas - optional keywords) */
  interests?: string[];
  /** 추가 정보 (Additional context) */
  additionalInfo?: string;
}

/**
 * Roadmap generation request
 */
export interface RoadmapRequest {
  /** 이수 과목 데이터 (Completed courses) */
  transcript: TranscriptData;
  /** 진로 목표 (Career goal) */
  careerGoal: CareerGoal;
}

/**
 * AI-generated learning roadmap
 */
export interface Roadmap {
  /** 진로 요약 (Career path summary) */
  careerSummary: string;
  /** 현재 역량 분석 (Current skill analysis) */
  currentSkills: {
    strengths: string[];
    gaps: string[];
  };
  /** 추천 학습 경로 (Recommended learning path) */
  learningPath: RoadmapPhase[];
  /** 추가 조언 (Additional advice) */
  advice?: string;
  /** 생성 일시 (Generated timestamp) */
  generatedAt: string;
  /** AI 추천 과목 목록 (AI-recommended subjects with scores) */
  recommendedSubjects?: RecommendedSubject[];
}

/**
 * Learning roadmap phase (semester or period)
 */
export interface RoadmapPhase {
  /** 기간 (Period: e.g., "2025년 1학기", "여름방학") */
  period: string;
  /** 목표 (Goal for this phase) */
  goal: string;
  /** 추천 과목 (Recommended courses) */
  courses: RecommendedCourse[];
  /** 추천 기술스택 (Recommended tech stacks) */
  techStacks?: RecommendedTechStack[];
  /** 추가 활동 (Additional activities) */
  activities?: string[];
  /** 예상 학습량 (Estimated effort) */
  effort?: string;
}

/**
 * Recommended course in roadmap
 */
export interface RecommendedCourse {
  /** 과목명 (Course name) */
  name: string;
  /** 과목 유형 (Course type: 전공필수, 전공선택, 교양, 외부강의 등) */
  type: string;
  /** 이유 (Reason for recommendation) */
  reason: string;
  /** 우선순위 (Priority: high, medium, low) */
  priority?: 'high' | 'medium' | 'low';
  /** 선수 과목 (Prerequisites - optional) */
  prerequisites?: string[];
}

/**
 * AI-recommended subject with score
 * Converted from backend ScoredSubject
 */
export interface RecommendedSubject {
  /** 학수번호 (Course code) */
  courseCode: string;
  /** 교과목명 (Course name) */
  courseName: string;
  /** 이수구분 (Course type) */
  courseType: string;
  /** 선택영역 (Selected area) */
  selectedArea: string | null;
  /** 학점 (Credits) */
  credits: number;
  /** 학년 (Grade level) */
  gradeLevel: number;
  /** AI 점수 (AI-generated score) */
  score: number;
  /** 추천 이유 (Recommendation reasons) */
  reasons: string[];
  /** 개설학과전공 (Offering department/major) */
  offeringDepartmentMajor?: string;
  /** 강의언어 (Lecture language) */
  lectureLanguage?: string;
  /** 수업형태 (Course format) */
  courseFormat?: string;
}

/**
 * Learning resource for tech stack
 */
export interface LearningResource {
  /** 자료 제목 (Resource title) */
  title: string;
  /** 자료 URL (Resource URL) */
  url: string;
  /** 자료 유형 (Resource type) */
  type: 'official' | 'tutorial' | 'course' | 'video';
}

/**
 * Recommended tech stack in roadmap
 */
export interface RecommendedTechStack {
  /** 기술스택 이름 (Tech stack name: e.g., "React", "Spring Boot", "Docker") */
  name: string;
  /** 카테고리 (Category) */
  category: 'framework' | 'library' | 'tool' | 'language' | 'database' | 'platform';
  /** 추천 이유 (Reason for recommendation) */
  reason: string;
  /** 우선순위 (Priority: high, medium, low) */
  priority: 'high' | 'medium' | 'low';
  /** 학습 난이도 1-5 (Difficulty level: 1=beginner, 5=advanced) */
  difficulty?: number;
  /** 추천 학습 자료 (Recommended learning resources) */
  resources?: LearningResource[];
  /** 선수 기술 (Prerequisites - optional) */
  prerequisites?: string[];
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Parse Excel API response
 */
export type ParseExcelResponse = ApiResponse<TranscriptData>;

/**
 * Generate Roadmap API response
 */
export type GenerateRoadmapResponse = ApiResponse<Roadmap>;
