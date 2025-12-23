/**
 * API Client
 * Unified interface that switches between mock and production APIs
 */

import { config } from './config';
import { mockParseExcel, mockGenerateRoadmap } from './mock-service';
import type {
  TranscriptData,
  CareerGoal,
  ParseExcelResponse,
  GenerateRoadmapResponse,
} from './types';

/**
 * Parse Excel file (成績表)
 * - Development: Uses mock data
 * - Production: Calls /api/parse-excel
 */
export async function parseExcel(file: File): Promise<ParseExcelResponse> {
  // Development mode: Use mock service
  if (config.useMock) {
    return mockParseExcel(file);
  }

  // Production mode: Call real API
  try {
    const formData = new FormData();
    formData.append('file', file);

    // 🔍 디버깅: FormData 내용 확인
    console.log('📤 전송할 FormData:', {
      파일명: file.name,
      파일크기: file.size,
      파일타입: file.type,
      FormDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
        key,
        value: value instanceof File ? `File(${value.name}, ${value.type})` : value,
      })),
    });

    const apiUrl = `${config.api.baseUrl}/api/parse-excel`;
    console.log('🌐 API 요청:', { method: 'POST', url: apiUrl });

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('📥 API 응답:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      // 에러 응답 본문 확인
      const errorText = await response.text();
      console.error('❌ 에러 응답 본문:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ParseExcelResponse = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Parse Excel error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 파싱 중 오류가 발생했습니다.',
    };
  }
}

/**
 * Generate AI roadmap
 * - Development: Uses mock data
 * - Production: Calls /api/generate-roadmap (OpenAI)
 */
export async function generateRoadmap(
  transcript: TranscriptData,
  careerGoal: CareerGoal
): Promise<GenerateRoadmapResponse> {
  // Development mode: Use mock service
  if (config.useMock) {
    return mockGenerateRoadmap(transcript, careerGoal);
  }

  // Production mode: Call real API
  try {
    const apiUrl = `${config.api.baseUrl}/api/generate-roadmap`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        careerGoal,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GenerateRoadmapResponse = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Generate Roadmap error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '로드맵 생성 중 오류가 발생했습니다.',
    };
  }
}

/**
 * Health check utility
 * Checks if API is accessible
 */
export async function healthCheck(): Promise<boolean> {
  if (config.useMock) {
    console.log('✅ Mock mode: Health check passed');
    return true;
  }

  try {
    const response = await fetch('/api/health');
    return response.ok;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return false;
  }
}
