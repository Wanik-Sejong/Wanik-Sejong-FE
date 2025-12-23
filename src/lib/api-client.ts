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
  console.log('📊 parseExcel - API Source:', apiSource);
  console.log('📊 parseExcel - Config:', {
    useMock: config.useMock,
    backendEnabled: config.backend.enabled,
    backendUrl: config.backend.baseUrl,
    localApiUrl: config.api.baseUrl,
  });

  // 1. Mock mode: Use mock data
  if (config.useMock) {
    console.log('✅ Using Mock Data');
    return mockParseExcel(file);
  }

  // 2. Backend mode: Call external Spring Boot API
  if (config.backend.enabled) {
    console.log('🌐 Calling Backend API:', config.backend.baseUrl);
    try {
      const backendResult = await fetchBackendParseExcel(file);

      // Validate backend response
      if (backendResult.success && backendResult.data) {
        validateBackendTranscript(backendResult.data);

        console.log('✅ Backend API Success');
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
  console.log('🌐 Calling Local API');
  try {
    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = `${config.api.baseUrl}/api/parse-excel`;
    console.log('📤 Local API Request:', { method: 'POST', url: apiUrl });

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
  console.log('🌐 Backend API 요청:', { method: 'POST', url: apiUrl });

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
  console.log('🚀 generateRoadmap - API Source:', apiSource);
  console.log('🚀 generateRoadmap - Config:', {
    useMock: config.useMock,
    backendEnabled: config.backend.enabled,
    backendUrl: config.backend.baseUrl,
    localApiUrl: config.api.baseUrl,
  });

  // Normalize careerGoal to string
  const careerGoalString =
    typeof careerGoal === 'string' ? careerGoal : careerGoal.careerPath;

  // 1. Mock mode: Use mock data
  if (config.useMock) {
    console.log('✅ Using Mock Data');
    return mockGenerateRoadmap(transcript, careerGoalString);
  }

  // 2. Backend mode: Call external Spring Boot API
  if (config.backend.enabled) {
    console.log('🌐 Calling Backend API:', config.backend.baseUrl);
    try {
      const backendResult = await fetchBackendGenerateRoadmap(
        transcript,
        typeof careerGoal === 'string' ? careerGoal : careerGoal
      );

      // Validate backend response
      if (backendResult.success && backendResult.data) {
        validateBackendRoadmap(backendResult.data);

        console.log('\n' + '='.repeat(80));
        console.log('🔄 [API-CLIENT] 프론트엔드 형식으로 변환 시작');
        console.log('='.repeat(80));

        // Convert backend data to frontend format
        const frontendRoadmap = fromBackendRoadmap(backendResult.data);

        console.log('\n' + '='.repeat(80));
        console.log('✅ [API-CLIENT] 최종 결과 반환');
        console.log('='.repeat(80));
        console.log('📊 반환할 로드맵 정보:');
        console.log(`  - 진로 요약: ${frontendRoadmap.careerSummary.substring(0, 50)}...`);
        console.log(`  - 강점: ${frontendRoadmap.currentSkills.strengths.length}개`);
        console.log(`  - 보완점: ${frontendRoadmap.currentSkills.gaps.length}개`);
        console.log(`  - 학습 경로 단계: ${frontendRoadmap.learningPath.length}개`);
        console.log(`  - 총 추천 과목: ${frontendRoadmap.learningPath.reduce((sum, p) => sum + p.courses.length, 0)}개`);
        console.log('='.repeat(80) + '\n');

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
  console.log('🌐 Calling Local API');
  try {
    const apiUrl = `${config.api.baseUrl}/api/generate-roadmap`;
    console.log('📤 Local API Request:', {
      method: 'POST',
      url: apiUrl,
      careerGoal: careerGoalString,
    });

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

    console.log('📥 Local API Response:', {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Local API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GenerateRoadmapResponse = await response.json();
    console.log('✅ Local API Success');
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
  console.log('🌐 Backend API 요청:', { method: 'POST', url: apiUrl });

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

    console.log('\n' + '='.repeat(80));
    console.log('📤 [REQUEST] Backend API 요청 데이터');
    console.log('='.repeat(80));
    console.log('🎯 URL:', apiUrl);
    console.log('🎯 Method: POST');
    console.log('🎯 Timeout:', config.backend.timeout, 'ms');
    console.log('\n📊 요청 요약:');
    console.log('  - 총 이수 과목:', backendTranscript.courses.length);
    console.log('  - 총 학점:', backendTranscript.totalCredits);
    console.log('  - 전공 학점:', backendTranscript.totalMajorCredits);
    console.log('  - 교양 학점:', backendTranscript.totalGeneralCredits);
    console.log('  - 평균 평점:', backendTranscript.averageGPA);
    console.log('  - 진로 목표:', backendCareerGoal);

    console.log('\n📝 샘플 과목 (첫 3개):');
    backendTranscript.courses.slice(0, 3).forEach((course, idx) => {
      console.log(`  [${idx + 1}] ${course.courseName} (${course.courseType})`);
      console.log(`      - 학점: ${course.credits}, 성적: ${course.grade}, 과목코드: ${course.courseCode}`);
    });

    console.log('\n📦 전체 요청 Payload (JSON):');
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log('='.repeat(80) + '\n');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('\n' + '='.repeat(80));
    console.log('📥 [RESPONSE] Backend API 응답 데이터');
    console.log('='.repeat(80));
    console.log('🎯 Status:', response.status, response.statusText);
    console.log('🎯 Content-Type:', response.headers.get('content-type'));
    console.log('🎯 Content-Length:', response.headers.get('content-length'), 'bytes');

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

      console.log('='.repeat(80) + '\n');
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const result: BackendGenerateRoadmapResponse = await response.json();

    console.log('\n✅ 응답 성공!');
    console.log('📊 응답 요약:');
    console.log('  - success:', result.success);
    console.log('  - 진로 요약:', result.data?.careerSummary ? '✅ 있음' : '❌ 없음');
    console.log('  - 현재 역량:', result.data?.currentSkills ? '✅ 있음' : '❌ 없음');
    console.log('  - 교내 로드맵 단계:', result.data?.coursePlan?.length || 0);
    console.log('  - 교외 활동 단계:', result.data?.extracurricularPlan?.length || 0);
    console.log('  - 과목 추천:', result.data?.subjectRecommendations ? '✅ 있음' : '❌ 없음');
    console.log('  - 가중치 힌트:', result.data?.weightHints ? '✅ 있음' : '❌ 없음');

    if (result.data?.coursePlan && result.data.coursePlan.length > 0) {
      console.log('\n📚 CoursePlan 상세 (각 단계별 과목 수):');
      result.data.coursePlan.forEach((plan, idx) => {
        console.log(`  [${idx + 1}] ${plan.period}: ${plan.courses.length}개 과목`);
        console.log(`      목표: ${plan.goal}`);
        console.log(`      노력: ${plan.effort}`);

        // 첫 번째 과목만 샘플로 출력
        if (plan.courses.length > 0) {
          const firstCourse = plan.courses[0] as any;
          console.log(`      샘플 과목:`, {
            // 백엔드 형식 필드
            courseName: firstCourse.courseName,
            courseType: firstCourse.courseType,
            courseCode: firstCourse.courseCode,
            // 프론트엔드 형식 필드 (잘못된 경우)
            name: firstCourse.name,
            type: firstCourse.type,
            reason: firstCourse.reason,
            priority: firstCourse.priority,
          });
        }
      });
    }

    console.log('\n📦 전체 응답 Payload (JSON):');
    console.log(JSON.stringify(result, null, 2));
    console.log('='.repeat(80) + '\n');

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
  console.log(`⚖️ getWeightHints - Using API source: ${apiSource}`);

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
  console.log(`📊 scoreSubjects - Using API source: ${apiSource}`);

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
    console.log('✅ Mock mode: Health check passed');
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
