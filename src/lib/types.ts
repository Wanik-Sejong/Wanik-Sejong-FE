/**
 * TypeScript Type Definitions
 * Shared types for 완익세종 application
 */

/**
 * Course information from Excel transcript
 */
export interface Course {
  /** 과목명 (Course name) */
  name: string;
  /** 학점 (Credits) */
  credits: number;
  /** 학년 (Year taken) */
  year?: number;
  /** 학기 (Semester taken) */
  semester?: string;
  /** 성적 (Grade) */
  grade?: string;
  /** 전공 구분 (Major category: 전공필수, 전공선택, 교양 등) */
  category?: string;
}

/**
 * Parsed transcript data from Excel
 */
export interface TranscriptData {
  /** 학생 정보 (Student info) */
  studentInfo?: {
    name?: string;
    studentId?: string;
    major?: string;
    year?: number;
  };
  /** 이수 과목 리스트 (List of completed courses) */
  courses: Course[];
  /** 총 학점 (Total credits) */
  totalCredits: number;
  /** 전공 학점 (Major credits) */
  majorCredits?: number;
  /** 교양 학점 (General education credits) */
  generalCredits?: number;
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
