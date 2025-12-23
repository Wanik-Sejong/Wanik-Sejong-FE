/**
 * API Client
 * Unified interface that switches between mock, backend, and local APIs
 * Priority: Mock → Backend → Local (Next.js API Routes)
 */

import { config, getApiSource } from './config';
import { mockParseExcel, mockGenerateRoadmap } from './mock-service';
import type {
  TranscriptData,
  CareerGoal,
  ParseExcelResponse,
  GenerateRoadmapResponse,
} from './types';
import type {
  BackendParseExcelResponse,
  BackendGenerateRoadmapResponse,
  BackendWeightHintsResponse,
  BackendSubjectScoreResponse,
  SubjectScoreRequest,
  WeightHints,
  SubjectScoreResponseData,
} from './types/backend.types';
import {
  toBackendTranscript,
  fromBackendTranscript,
  toBackendCareerGoal,
  fromBackendRoadmap,
  validateBackendTranscript,
  validateBackendRoadmap,
} from './adapters/backend-adapter';

/**
 * Parse Excel file (成績表)
 * Priority: Mock → Backend API → Local API
 */
export async function parseExcel(file: File): Promise<ParseExcelResponse> {
  const apiSource = getApiSource();

  // 1. Mock mode: Use mock data
  if (config.useMock) {
    return mockParseExcel(file);
  }

  // 2. Backend mode: Call external Spring Boot API
  if (config.backend.enabled) {
    try {
      const backendResult = await fetchBackendParseExcel(file);

      // Validate backend response
      if (backendResult.success && backendResult.data) {
        validateBackendTranscript(backendResult.data);

        // Convert backend data to frontend format
        return {
          success: true,
          data: fromBackendTranscript(backendResult.data),
          message: '백엔드 API: 성적표 파싱 완료',
        };
      }

      return {
        success: false,
        error: backendResult.error || '백엔드 API 오류',
      };
    } catch (error) {
      console.error('❌ Backend API error, falling back to local API:', error);
      // Fallback to local API
    }
  }

  // 3. Local mode: Call Next.js API Routes
  try {
    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = `${config.api.baseUrl}/api/parse-excel`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Local API 에러:', errorText);
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
 * Fetch parse Excel from backend API
 * Internal helper function
 */
async function fetchBackendParseExcel(file: File): Promise<BackendParseExcelResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const apiUrl = `${config.backend.baseUrl}/api/parse-excel`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.backend.timeout);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend API 에러:', errorText);
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const result: BackendParseExcelResponse = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Backend API timeout');
    }
    throw error;
  }
}

/**
 * Generate AI roadmap
 * Priority: Mock → Backend API → Local API
 */
export async function generateRoadmap(
  transcript: TranscriptData,
  careerGoal: CareerGoal | string
): Promise<GenerateRoadmapResponse> {
  const apiSource = getApiSource();

  // Normalize careerGoal to string
  const careerGoalString =
    typeof careerGoal === 'string' ? careerGoal : careerGoal.careerPath;

  // 1. Mock mode: Use mock data
  if (config.useMock) {
    return mockGenerateRoadmap(transcript, careerGoalString);
  }

  // 2. Backend mode: Call external Spring Boot API
  if (config.backend.enabled) {
    try {
      const backendResult = await fetchBackendGenerateRoadmap(
        transcript,
        typeof careerGoal === 'string' ? careerGoal : careerGoal
      );

      // Validate backend response
      if (backendResult.success && backendResult.data) {
        validateBackendRoadmap(backendResult.data);


        // Convert backend data to frontend format
        const frontendRoadmap = fromBackendRoadmap(backendResult.data);


        return {
          success: true,
          data: frontendRoadmap,
          message: '백엔드 API: 로드맵 생성 완료',
        };
      }

      return {
        success: false,
        error: backendResult.error || '백엔드 API 오류',
      };
    } catch (error) {
      console.error('❌ Backend API error:', error);

      // Log detailed error for debugging
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }

      // Return error (no fallback in Backend Mode)
      return {
        success: false,
        error: error instanceof Error ? error.message : '백엔드 API 통신 오류',
      };
    }
  }

  // 3. Local mode: Call Next.js API Routes
  try {
    const apiUrl = `${config.api.baseUrl}/api/generate-roadmap`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        careerGoal:
          typeof careerGoal === 'string'
            ? { careerPath: careerGoal }
            : careerGoal,
      }),
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Local API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GenerateRoadmapResponse = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Generate Roadmap error:', error);
    console.error('❌ Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : '로드맵 생성 중 오류가 발생했습니다.',
    };
  }
}

/**
 * Fetch generate roadmap from backend API
 * Internal helper function
 */
async function fetchBackendGenerateRoadmap(
  transcript: TranscriptData,
  careerGoal: CareerGoal | string
): Promise<BackendGenerateRoadmapResponse> {
  const apiUrl = `${config.backend.baseUrl}/api/generate-roadmap`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.backend.timeout);

  try {
    // Convert frontend data to backend format
    const backendTranscript = toBackendTranscript(transcript);
    const backendCareerGoal =
      typeof careerGoal === 'string' ? careerGoal : toBackendCareerGoal(careerGoal);

    // Log request payload for debugging
    const requestPayload = {
      transcript: backendTranscript,
      careerGoal: backendCareerGoal,
    };


    backendTranscript.courses.slice(0, 3).forEach((course, idx) => {
    });


    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);


    if (!response.ok) {
      const errorText = await response.text();
      console.error('\n❌ 에러 응답:');
      console.error('  - HTTP Status:', response.status);
      console.error('  - Status Text:', response.statusText);
      console.error('\n📄 에러 응답 Body:');
      console.error(errorText);

      // Try to parse error as JSON
      try {
        const errorJson = JSON.parse(errorText);
        console.error('\n📋 파싱된 에러 JSON:');
        console.error(JSON.stringify(errorJson, null, 2));
      } catch {
        console.error('\n⚠️ 에러 응답은 JSON 형식이 아닙니다 (일반 텍스트)');
      }

      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const result: BackendGenerateRoadmapResponse = await response.json();


    if (result.data?.coursePlan && result.data.coursePlan.length > 0) {
      result.data.coursePlan.forEach((plan, idx) => {

        // 첫 번째 과목만 샘플로 출력
        if (plan.courses.length > 0) {
          const firstCourse = plan.courses[0] as any;
        }
      });
    }


    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Backend API timeout');
    }
    throw error;
  }
}

/**
 * Get weight hints for career goal
 * Backend-only API (not available in local mode)
 */
export async function getWeightHints(
  careerGoal: string
): Promise<WeightHints | null> {
  const apiSource = getApiSource();

  // Only available in backend mode
  if (!config.backend.enabled) {
    console.warn('⚠️ Weight hints API is only available in backend mode');
    return null;
  }

  try {
    const apiUrl = `${config.backend.baseUrl}/api/weight-hints`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.backend.timeout);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ careerGoal }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const result: BackendWeightHintsResponse = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('❌ Get weight hints error:', error);
    return null;
  }
}

/**
 * Score subjects based on career goal
 * Backend-only API (not available in local mode)
 */
export async function scoreSubjects(
  request: SubjectScoreRequest
): Promise<SubjectScoreResponseData | null> {
  const apiSource = getApiSource();

  // Only available in backend mode
  if (!config.backend.enabled) {
    console.warn('⚠️ Subject scoring API is only available in backend mode');
    return null;
  }

  try {
    const apiUrl = `${config.backend.baseUrl}/api/subjects/score`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.backend.timeout);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const result: BackendSubjectScoreResponse = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('❌ Score subjects error:', error);
    return null;
  }
}

/**
 * Health check utility
 * Checks if API is accessible
 */
export async function healthCheck(): Promise<{
  backend: boolean;
  local: boolean;
}> {
  const result = {
    backend: false,
    local: false,
  };

  if (config.useMock) {
    return { backend: true, local: true };
  }

  // Check backend API
  if (config.backend.enabled) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${config.backend.baseUrl}/api/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      result.backend = response.ok;
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
    }
  }

  // Check local API
  try {
    const response = await fetch('/api/health');
    result.local = response.ok;
  } catch (error) {
    console.error('❌ Local health check failed:', error);
  }

  return result;
}
