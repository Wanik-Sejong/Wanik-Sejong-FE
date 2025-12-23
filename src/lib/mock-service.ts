/**
 * Mock Service
 * Provides mock data for development mode
 */

import mockCourses from '@/mocks/courses.json';
import mockRoadmap from '@/mocks/roadmap.json';
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

  // Customize mock roadmap with user's career goal
  const customizedRoadmap: Roadmap = {
    ...mockRoadmap,
    careerSummary: `${careerGoal.careerPath}는 ${mockRoadmap.careerSummary.split('는 ')[1]}`,
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
 * Mock: Get sample roadmap
 * Returns sample roadmap for testing
 */
export function getMockRoadmap(): Roadmap {
  return mockRoadmap as Roadmap;
}
