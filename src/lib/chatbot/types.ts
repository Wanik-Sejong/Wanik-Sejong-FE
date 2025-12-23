/**
 * Chatbot Type Definitions
 * 챗봇 시스템을 위한 타입 정의
 */

/**
 * 컴공 강의 데이터 (data.json 구조)
 */
export interface CourseData {
  순번: string;
  개설학과전공: string;
  학수번호: string;
  분반: string;
  교과목명: string;
  강의언어: string | null;
  이수구분: string;
  선택영역: string | null;
  '학점/이론/실습': string;
  '학년 (학기)': string;
  대상과정: string;
  주관학과: string;
  교수명: string;
  '요일 및 강의시간': string | null;
  강의실: string | null;
  사이버강좌: string | null;
  강좌유형: string | null;
  학점교류수강가능: string | null;
  '수강대상 및 유의사항': string | null;
  파일번호: string;
}

/**
 * 검색 인덱스 구조
 */
export interface SearchIndices {
  /** 교과목명 인덱스: "C프로그래밍" → [강의1, 강의2, ...] */
  courseNameIndex: Map<string, CourseData[]>;
  /** 교수명 인덱스: "김도년" → [강의1, 강의2, ...] */
  professorIndex: Map<string, CourseData[]>;
  /** 요일 인덱스: "월" → [강의1, 강의2, ...] */
  dayIndex: Map<string, CourseData[]>;
  /** 이수구분 인덱스: "전필" → [강의1, 강의2, ...] */
  typeIndex: Map<string, CourseData[]>;
  /** 학수번호 인덱스: "009912" → [강의1, 강의2, ...] */
  courseCodeIndex: Map<string, CourseData[]>;
}

/**
 * 검색 의도 분류
 */
export type SearchIntent =
  | 'TIME_QUERY'      // 시간 관련: "언제", "시간", "요일"
  | 'PROFESSOR_QUERY' // 교수 관련: "교수님", "선생님"
  | 'TYPE_QUERY'      // 이수구분: "전필", "전선"
  | 'LOCATION_QUERY'  // 장소: "강의실", "어디"
  | 'GENERAL';        // 일반 검색

/**
 * 검색 결과
 */
export interface SearchResult {
  /** 검색된 강의 목록 */
  courses: CourseData[];
  /** 검색 의도 */
  intent: SearchIntent;
  /** 매칭 점수 (0-1) */
  score: number;
  /** 생성된 마크다운 응답 */
  markdown: string;
}

/**
 * 채팅 메시지
 */
export interface ChatMessage {
  /** 메시지 역할 */
  role: 'user' | 'assistant';
  /** 메시지 내용 */
  content: string;
  /** 타임스탬프 */
  timestamp: Date;
  /** 검색 결과 (assistant 메시지인 경우) */
  searchResult?: SearchResult;
}

/**
 * 검색 서비스 인터페이스 (백엔드 전환 준비)
 */
export interface SearchService {
  /** 검색 실행 */
  search(query: string): Promise<SearchResult>;
  /** 초기화 */
  initialize(): Promise<void>;
}
