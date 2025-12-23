/**
 * Data Indexer
 * data.json을 검색 최적화된 인덱스로 변환
 */

import type { CourseData, SearchIndices } from './types';

/**
 * 교과목명 인덱스 생성
 * "C프로그래밍" → [강의1, 강의2, ...]
 */
function createCourseNameIndex(courses: CourseData[]): Map<string, CourseData[]> {
  const index = new Map<string, CourseData[]>();

  for (const course of courses) {
    const courseName = course.교과목명.toLowerCase();

    // 전체 과목명
    const existing = index.get(courseName) || [];
    index.set(courseName, [...existing, course]);

    // 부분 매칭을 위한 키워드 추출
    const keywords = extractKeywords(courseName);
    for (const keyword of keywords) {
      if (keyword.length >= 2) { // 2글자 이상만 인덱싱
        const existingKeyword = index.get(keyword) || [];
        index.set(keyword, [...existingKeyword, course]);
      }
    }
  }

  return index;
}

/**
 * 교수명 인덱스 생성
 */
function createProfessorIndex(courses: CourseData[]): Map<string, CourseData[]> {
  const index = new Map<string, CourseData[]>();

  for (const course of courses) {
    const professor = course.교수명?.toLowerCase();
    if (!professor) continue;

    const existing = index.get(professor) || [];
    index.set(professor, [...existing, course]);
  }

  return index;
}

/**
 * 요일 인덱스 생성
 * "월화수목금13:00-16:00" → "월", "화", "수" 등으로 분리
 */
function createDayIndex(courses: CourseData[]): Map<string, CourseData[]> {
  const index = new Map<string, CourseData[]>();
  const dayPattern = /[월화수목금토일]/g;

  for (const course of courses) {
    const schedule = course['요일 및 강의시간'];
    if (!schedule) continue;

    const days = schedule.match(dayPattern) || [];
    const uniqueDays = [...new Set(days)];

    for (const day of uniqueDays) {
      const existing = index.get(day) || [];
      index.set(day, [...existing, course]);
    }
  }

  return index;
}

/**
 * 이수구분 인덱스 생성
 */
function createTypeIndex(courses: CourseData[]): Map<string, CourseData[]> {
  const index = new Map<string, CourseData[]>();

  for (const course of courses) {
    const type = course.이수구분?.toLowerCase();
    if (!type) continue;

    const existing = index.get(type) || [];
    index.set(type, [...existing, course]);
  }

  return index;
}

/**
 * 학수번호 인덱스 생성
 * "009912" → [강의1, 강의2, ...]
 * 부분 매칭 지원: "0099" → "009912", "009939" 등
 */
function createCourseCodeIndex(courses: CourseData[]): Map<string, CourseData[]> {
  const index = new Map<string, CourseData[]>();

  for (const course of courses) {
    const courseCode = course.학수번호;
    if (!courseCode) continue;

    // 전체 학수번호로 인덱싱
    const existing = index.get(courseCode) || [];
    index.set(courseCode, [...existing, course]);

    // 부분 매칭을 위한 prefix 인덱싱 (3글자 이상만)
    // "009912" → "009", "0099", "00991", "009912"
    for (let i = 3; i <= courseCode.length; i++) {
      const prefix = courseCode.substring(0, i);
      const existingPrefix = index.get(prefix) || [];
      index.set(prefix, [...existingPrefix, course]);
    }
  }

  return index;
}

/**
 * 키워드 추출 (간단한 토크나이저)
 */
function extractKeywords(text: string): string[] {
  // "C프로그래밍및실습" → ["c", "프로그래밍", "실습"]
  const keywords: string[] = [];

  // 영문자 추출
  const englishMatch = text.match(/[a-z]+/gi);
  if (englishMatch) {
    keywords.push(...englishMatch.map(k => k.toLowerCase()));
  }

  // 한글 단어 추출 (조사 및 접속사 제거)
  // "자료구조및실습" → ["자료구조", "실습"]
  const koreanWords = text
    .split(/및|와|과|의|을|를|이|가|에|으로|부터|까지|[^가-힣]+/)
    .filter(w => w.length >= 2);
  keywords.push(...koreanWords);

  // 디버그: 자료구조 포함 시 로그
  if (text.includes('자료구조')) {
    console.log('🔍 Keyword extraction:', text, '→', keywords);
  }

  return keywords;
}

/**
 * 모든 인덱스를 병렬로 생성
 */
export async function createIndices(courses: CourseData[]): Promise<SearchIndices> {
  // 병렬 처리로 5개 인덱스 동시 생성
  const [courseNameIndex, professorIndex, dayIndex, typeIndex, courseCodeIndex] =
    await Promise.all([
      Promise.resolve(createCourseNameIndex(courses)),
      Promise.resolve(createProfessorIndex(courses)),
      Promise.resolve(createDayIndex(courses)),
      Promise.resolve(createTypeIndex(courses)),
      Promise.resolve(createCourseCodeIndex(courses)),
    ]);

  return {
    courseNameIndex,
    professorIndex,
    dayIndex,
    typeIndex,
    courseCodeIndex,
  };
}

// 인덱스 버전 관리 (구조 변경 시 증가)
const INDEX_VERSION = 5; // 조사/접속사 분리 로직 수정 (및, 와, 과 등)

/**
 * 인덱스를 세션 스토리지에 저장 (직렬화)
 */
export function saveIndicesToSession(indices: SearchIndices): void {
  try {
    const serialized = {
      version: INDEX_VERSION,
      courseNameIndex: Array.from(indices.courseNameIndex.entries()),
      professorIndex: Array.from(indices.professorIndex.entries()),
      dayIndex: Array.from(indices.dayIndex.entries()),
      typeIndex: Array.from(indices.typeIndex.entries()),
      courseCodeIndex: Array.from(indices.courseCodeIndex.entries()),
    };
    sessionStorage.setItem('chatbot_indices', JSON.stringify(serialized));
  } catch (error) {
    console.warn('Failed to save indices to session storage:', error);
  }
}

/**
 * 세션 스토리지에서 인덱스 로드
 */
export function loadIndicesFromSession(): SearchIndices | null {
  try {
    const stored = sessionStorage.getItem('chatbot_indices');
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // 버전 체크: 버전이 다르면 캐시 무효화
    if (parsed.version !== INDEX_VERSION) {
      console.log(`🔄 Index version mismatch (stored: ${parsed.version}, current: ${INDEX_VERSION}). Rebuilding indices...`);
      sessionStorage.removeItem('chatbot_indices');
      return null;
    }

    return {
      courseNameIndex: new Map(parsed.courseNameIndex),
      professorIndex: new Map(parsed.professorIndex),
      dayIndex: new Map(parsed.dayIndex),
      typeIndex: new Map(parsed.typeIndex),
      courseCodeIndex: new Map(parsed.courseCodeIndex || []),
    };
  } catch (error) {
    console.warn('Failed to load indices from session storage:', error);
    return null;
  }
}
