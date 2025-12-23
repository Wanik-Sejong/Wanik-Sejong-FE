/**
 * Local Search Engine
 * 프론트엔드에서 data.json을 검색하는 엔진
 */

import type { CourseData, SearchIndices, SearchIntent, SearchResult } from './types';
import { loadCourseData } from './data-loader';

export class LocalSearchEngine {
  private data: CourseData[] = [];
  private indices: SearchIndices | null = null;
  private initialized = false;

  /**
   * 초기화 (데이터 로딩)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const { data, indices } = await loadCourseData();
    this.data = data;
    this.indices = indices;
    this.initialized = true;
  }

  /**
   * 검색 실행
   */
  async search(query: string): Promise<SearchResult> {
    await this.initialize();

    if (!this.indices) {
      throw new Error('Search indices not initialized');
    }

    // 1. 키워드 추출
    const keywords = this.extractKeywords(query);

    // 2. 의도 파악
    const intent = this.detectIntent(query);

    // 3. 병렬 검색 실행
    const [courseResults, professorResults, dayResults, typeResults, courseCodeResults] = await Promise.all([
      Promise.resolve(this.searchByCourse(keywords)),
      Promise.resolve(this.searchByProfessor(keywords)),
      Promise.resolve(this.searchByDay(keywords, query)),
      Promise.resolve(this.searchByType(keywords)),
      Promise.resolve(this.searchByCourseCode(keywords)),
    ]);

    // 4. 결과 병합 및 랭킹
    const merged = this.mergeAndRank(
      [courseResults, professorResults, dayResults, typeResults, courseCodeResults],
      intent
    );

    return {
      courses: merged,
      intent,
      score: merged.length > 0 ? 1.0 : 0.0,
      markdown: '', // 응답 생성기에서 채울 예정
    };
  }

  /**
   * 키워드 추출 (indexer.ts와 동일한 로직 사용)
   */
  private extractKeywords(query: string): string[] {
    const normalized = query.toLowerCase();
    const keywords: string[] = [];

    // 영문자 및 숫자 추출
    const englishMatch = normalized.match(/[a-z0-9]+/gi);
    if (englishMatch) {
      keywords.push(...englishMatch);
    }

    // 한글 단어 추출 (조사 및 접속사 제거)
    const koreanWords = normalized
      .split(/및|와|과|의|을|를|이|가|에|으로|부터|까지|[^가-힣]+/)
      .filter(w => w.length >= 2);
    keywords.push(...koreanWords);

    // 불용어 제거
    const stopWords = ['있어', '알려', '알려줘', '뭐', '어디', '언제', '누구', '교수', '선생', '과목'];
    return keywords.filter(k => !stopWords.includes(k));
  }

  /**
   * 의도 감지
   */
  private detectIntent(query: string): SearchIntent {
    const patterns = {
      TIME_QUERY: /언제|시간|요일|월요일|화요일|수요일|목요일|금요일|토요일|일요일/,
      PROFESSOR_QUERY: /교수|선생|강사|님/,
      TYPE_QUERY: /전필|전선|교필|교선|이수구분|전공필수|전공선택|교양필수|교양선택/,
      LOCATION_QUERY: /강의실|장소|어디|교실/,
    };

    for (const [intent, pattern] of Object.entries(patterns)) {
      if (pattern.test(query)) {
        return intent as SearchIntent;
      }
    }

    return 'GENERAL';
  }

  /**
   * 교과목명으로 검색
   */
  private searchByCourse(keywords: string[]): CourseData[] {
    if (!this.indices) return [];

    const results = new Set<CourseData>();

    for (const keyword of keywords) {
      const matches = this.indices.courseNameIndex.get(keyword) || [];
      matches.forEach(course => results.add(course));
    }

    return Array.from(results);
  }

  /**
   * 교수명으로 검색
   */
  private searchByProfessor(keywords: string[]): CourseData[] {
    if (!this.indices) return [];

    const results = new Set<CourseData>();

    for (const keyword of keywords) {
      const matches = this.indices.professorIndex.get(keyword) || [];
      matches.forEach(course => results.add(course));
    }

    return Array.from(results);
  }

  /**
   * 요일로 검색
   */
  private searchByDay(keywords: string[], query: string): CourseData[] {
    if (!this.indices) return [];

    const dayMap: Record<string, string> = {
      '월요일': '월',
      '화요일': '화',
      '수요일': '수',
      '목요일': '목',
      '금요일': '금',
      '토요일': '토',
      '일요일': '일',
    };

    const results = new Set<CourseData>();

    // "월요일" → "월" 변환
    for (const [fullDay, shortDay] of Object.entries(dayMap)) {
      if (query.includes(fullDay)) {
        const matches = this.indices.dayIndex.get(shortDay) || [];
        matches.forEach(course => results.add(course));
      }
    }

    // 직접 "월", "화" 등 검색
    for (const keyword of keywords) {
      if (['월', '화', '수', '목', '금', '토', '일'].includes(keyword)) {
        const matches = this.indices.dayIndex.get(keyword) || [];
        matches.forEach(course => results.add(course));
      }
    }

    return Array.from(results);
  }

  /**
   * 이수구분으로 검색
   */
  private searchByType(keywords: string[]): CourseData[] {
    if (!this.indices) return [];

    const typeMap: Record<string, string> = {
      '전필': '전필',
      '전선': '전선',
      '교필': '교필',
      '교선': '교선',
      '전공필수': '전필',
      '전공선택': '전선',
      '교양필수': '교필',
      '교양선택': '교선',
    };

    const results = new Set<CourseData>();

    for (const keyword of keywords) {
      const type = typeMap[keyword];
      if (type) {
        const matches = this.indices.typeIndex.get(type) || [];
        matches.forEach(course => results.add(course));
      }
    }

    return Array.from(results);
  }

  /**
   * 학수번호로 검색
   * "009912", "0099" 등 숫자 키워드를 학수번호로 처리
   */
  private searchByCourseCode(keywords: string[]): CourseData[] {
    if (!this.indices) return [];

    const results = new Set<CourseData>();

    for (const keyword of keywords) {
      // 숫자로만 구성된 키워드만 학수번호로 처리
      if (/^\d+$/.test(keyword) && keyword.length >= 3) {
        const matches = this.indices.courseCodeIndex.get(keyword) || [];
        matches.forEach(course => results.add(course));
      }
    }

    return Array.from(results);
  }

  /**
   * 결과 병합 및 랭킹
   */
  private mergeAndRank(resultSets: CourseData[][], intent: SearchIntent): CourseData[] {
    // 중복 제거 및 빈도수 계산
    const scoreMap = new Map<string, { course: CourseData; score: number }>();

    for (const results of resultSets) {
      for (const course of results) {
        const key = course.학수번호 + course.분반;
        const existing = scoreMap.get(key);

        if (existing) {
          existing.score += 1;
        } else {
          scoreMap.set(key, { course, score: 1 });
        }
      }
    }

    // 점수순 정렬
    const ranked = Array.from(scoreMap.values()).sort((a, b) => b.score - a.score);

    // 상위 30개로 확장 (AI가 더 많은 컨텍스트를 가질 수 있도록)
    return ranked.slice(0, 30).map(item => item.course);
  }
}
