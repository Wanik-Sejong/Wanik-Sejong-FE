/**
 * Mock Service
 * Provides mock data for development mode
 */

import mockCourses from '@/mocks/courses.json';
import roadmapBackend from '@/mocks/roadmap-backend.json';
import roadmapFrontend from '@/mocks/roadmap-frontend.json';
import roadmapServer from '@/mocks/roadmap-server.json';
import type {
  TranscriptData,
  CareerGoal,
  Roadmap,
  ParseExcelResponse,
  GenerateRoadmapResponse,
} from './types';

/**
 * Simulate network delay for realistic mock behavior
 */
function delay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize career path to mock data key
 * 진로명을 Mock 데이터 키로 정규화
 */
function normalizeCareerPath(careerPath: string): string {
  const normalized = careerPath.toLowerCase().trim();

  // 백엔드 계열
  if (
    normalized.includes('백엔드') ||
    normalized.includes('backend') ||
    normalized.includes('back-end') ||
    normalized.includes('서버 개발') ||
    normalized.includes('ai') ||
    normalized.includes('ml') ||
    normalized.includes('머신러닝') ||
    normalized.includes('인공지능') ||
    normalized.includes('데이터')
  ) {
    return 'backend';
  }

  // 프론트엔드 계열
  if (
    normalized.includes('프론트엔드') ||
    normalized.includes('frontend') ||
    normalized.includes('front-end') ||
    normalized.includes('프론트') ||
    normalized.includes('웹') ||
    normalized.includes('모바일') ||
    normalized.includes('앱') ||
    normalized.includes('ui') ||
    normalized.includes('ux')
  ) {
    return 'frontend';
  }

  // DevOps/서버 계열
  if (
    normalized.includes('devops') ||
    normalized.includes('인프라') ||
    normalized.includes('클라우드') ||
    normalized.includes('서버 운영') ||
    normalized.includes('sre') ||
    normalized.includes('시스템')
  ) {
    return 'server';
  }

  // 풀스택 → 프론트엔드 (UI 포함)
  if (normalized.includes('풀스택') || normalized.includes('fullstack')) {
    return 'frontend';
  }

  // 게임 → 백엔드 (서버 로직)
  if (normalized.includes('게임')) {
    return 'backend';
  }

  // 기본값: 백엔드
  return 'backend';
}

/**
 * Get mock roadmap based on career path
 */
function getMockRoadmap(careerPath: string): Roadmap {
  const normalizedKey = normalizeCareerPath(careerPath);
  const mockData: Record<string, Roadmap> = {
    backend: roadmapBackend as Roadmap,
    frontend: roadmapFrontend as Roadmap,
    server: roadmapServer as Roadmap,
  };

  return mockData[normalizedKey];
}

/**
 * Mock: Parse Excel file
 * In dev mode, returns mock transcript data
 */
export async function mockParseExcel(file: File): Promise<ParseExcelResponse> {
  console.log('📝 [Mock] Parsing Excel file:', file.name);

  // Simulate processing time
  await delay(1000);

  // Validate file type
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    return {
      success: false,
      error: '엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.',
    };
  }

  // Return mock data
  return {
    success: true,
    data: mockCourses as TranscriptData,
    message: '성적표 파싱 완료 (Mock Data)',
  };
}

/**
 * Mock: Generate AI roadmap
 * In dev mode, returns mock roadmap with user's career goal
 */
export async function mockGenerateRoadmap(
  transcript: TranscriptData,
  careerGoal: CareerGoal
): Promise<GenerateRoadmapResponse> {
  console.log('🤖 [Mock] Generating roadmap for:', careerGoal.careerPath);
  console.log('📊 [Mock] Transcript:', {
    courses: transcript.courses.length,
    credits: transcript.totalCredits,
  });

  // Simulate AI processing time
  await delay(2000);

  // Validate inputs
  if (!careerGoal.careerPath || careerGoal.careerPath.trim().length === 0) {
    return {
      success: false,
      error: '희망 진로를 입력해주세요.',
    };
  }

  if (!transcript.courses || transcript.courses.length === 0) {
    return {
      success: false,
      error: '이수 과목 정보가 없습니다.',
    };
  }

  // Get appropriate mock roadmap based on career path
  const baseMockRoadmap = getMockRoadmap(careerGoal.careerPath);

  // Customize mock roadmap with user's career goal
  const customizedRoadmap: Roadmap = {
    ...baseMockRoadmap,
    careerSummary: `${careerGoal.careerPath}는 ${baseMockRoadmap.careerSummary.split('는 ')[1]}`,
    generatedAt: new Date().toISOString(),
  } as Roadmap;

  // If user provided interests, add them to the advice
  if (careerGoal.interests && careerGoal.interests.length > 0) {
    customizedRoadmap.advice = `관심 분야: ${careerGoal.interests.join(', ')}\n\n${customizedRoadmap.advice}`;
  }

  return {
    success: true,
    data: customizedRoadmap,
    message: 'AI 로드맵 생성 완료 (Mock Data)',
  };
}

/**
 * Mock: Get sample transcript
 * Returns sample data for testing
 */
export function getMockTranscript(): TranscriptData {
  return mockCourses as TranscriptData;
}

/**
 * Mock: Get sample roadmap by career path
 * Returns sample roadmap for testing
 */
export function getSampleRoadmap(careerPath: string = 'backend'): Roadmap {
  return getMockRoadmap(careerPath);
}
