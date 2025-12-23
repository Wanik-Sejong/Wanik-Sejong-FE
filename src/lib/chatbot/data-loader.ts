/**
 * Data Loader
 * data.json 로딩 및 캐싱 관리
 */

import type { CourseData, SearchIndices } from './types';
import { createIndices, loadIndicesFromSession, saveIndicesToSession } from './indexer';

// 메모리 캐시
let cachedData: CourseData[] | null = null;
let cachedIndices: SearchIndices | null = null;

/**
 * 컴공 시간표 데이터 로드 (캐싱 포함)
 */
export async function loadCourseData(): Promise<{
  data: CourseData[];
  indices: SearchIndices;
}> {
  // 메모리 캐시 확인
  if (cachedData && cachedIndices) {
    return { data: cachedData, indices: cachedIndices };
  }


  try {
    // 병렬 처리: 데이터 로드 + 세션 스토리지 확인
    const [response, sessionIndices] = await Promise.all([
      fetch('/mocks/data.json'),
      Promise.resolve(loadIndicesFromSession()),
    ]);

    if (!response.ok) {
      throw new Error(`Failed to fetch data.json: ${response.status}`);
    }

    const jsonData = await response.json();
    cachedData = jsonData.강의시간표 as CourseData[];

    // 인덱스 처리
    if (sessionIndices) {
      cachedIndices = sessionIndices;
    } else {
      cachedIndices = await createIndices(cachedData);
      saveIndicesToSession(cachedIndices);
    }

    return { data: cachedData, indices: cachedIndices };
  } catch (error) {
    console.error('❌ Failed to load course data:', error);
    throw new Error('강의 데이터를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
  }
}

/**
 * 캐시 초기화 (디버깅용)
 */
export function clearCache(): void {
  cachedData = null;
  cachedIndices = null;
  sessionStorage.removeItem('chatbot_indices');
}
