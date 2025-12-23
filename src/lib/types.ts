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
