import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '@/lib/config';
import type {
  RoadmapRequest,
  GenerateRoadmapResponse,
  Roadmap,
} from '@/lib/types';

// Import mock roadmap data
import roadmapBackend from '@/mocks/roadmap-backend.json';
import roadmapFrontend from '@/mocks/roadmap-frontend.json';
import roadmapServer from '@/mocks/roadmap-server.json';

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
 * POST /api/generate-roadmap
 * Generate AI-powered learning roadmap using Google Gemini 2.0
 */
export async function POST(request: NextRequest) {
  console.log('🔵 API Route: /api/generate-roadmap - Request received');

  try {
    // Parse request body
    const body: RoadmapRequest = await request.json();
    const { transcript, careerGoal } = body;

    console.log('📊 Request data:', {
      hasCourses: !!transcript?.courses,
      courseCount: transcript?.courses?.length || 0,
      careerPath: careerGoal?.careerPath || 'not provided',
      useMock: process.env.NEXT_PUBLIC_USE_MOCK,
    });

    // Validate inputs
    if (!transcript || !transcript.courses || transcript.courses.length === 0) {
      console.error('❌ Validation failed: No transcript data');
      return NextResponse.json<GenerateRoadmapResponse>(
        {
          success: false,
          error: '성적표 데이터가 없습니다.',
        },
        { status: 400 }
      );
    }

    if (!careerGoal || !careerGoal.careerPath) {
      console.error('❌ Validation failed: No career goal');
      return NextResponse.json<GenerateRoadmapResponse>(
        {
          success: false,
          error: '희망 진로를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    // Check if mock mode is enabled
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

    if (useMockData) {
      console.log('🎭 Using Mock data mode');
      const roadmap = getMockRoadmap(careerGoal.careerPath);
      return NextResponse.json<GenerateRoadmapResponse>({
        success: true,
        data: {
          ...roadmap,
          generatedAt: new Date().toISOString(),
        },
        message: 'Mock 로드맵 반환 완료',
      });
    }

    // Check Gemini API key
    if (!config.gemini.apiKey) {
      console.error('❌ Gemini API key not configured');
      return NextResponse.json<GenerateRoadmapResponse>(
        {
          success: false,
          error: 'Gemini API 키가 설정되지 않았습니다.',
        },
        { status: 500 }
      );
    }

    console.log('🤖 Calling Gemini API...');

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    const model = genAI.getGenerativeModel({
      model: config.gemini.model,
      generationConfig: {
        temperature: config.gemini.temperature,
        maxOutputTokens: config.gemini.maxTokens,
        responseMimeType: 'application/json',
      },
    });

    // Create prompt
    const systemPrompt = `당신은 세종대학교의 진로 상담 전문가입니다. 학생의 이수 과목과 희망 진로를 분석하여 맞춤형 학습 로드맵을 제공합니다. 응답은 반드시 유효한 JSON 형식이어야 합니다.`;
    const userPrompt = createRoadmapPrompt(transcript, careerGoal);
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Call Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const responseText = response.text();

    console.log('📥 Gemini API response received:', {
      hasText: !!responseText,
      textLength: responseText?.length || 0,
    });

    if (!responseText) {
      throw new Error('Gemini 응답이 비어있습니다.');
    }

    let roadmapData;
    try {
      roadmapData = JSON.parse(responseText);
      console.log('✅ JSON parsing successful');
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      console.error('Response text:', responseText.substring(0, 500));
      throw new Error('Gemini 응답 파싱 실패: JSON 형식이 아닙니다.');
    }

    // Validate and format roadmap
    const roadmap: Roadmap = {
      careerSummary: roadmapData.careerSummary || '',
      currentSkills: roadmapData.currentSkills || { strengths: [], gaps: [] },
      learningPath: roadmapData.learningPath || [],
      advice: roadmapData.advice || '',
      generatedAt: new Date().toISOString(),
    };

    console.log('✅ Roadmap generated successfully:', {
      hasCareerSummary: !!roadmap.careerSummary,
      learningPathCount: roadmap.learningPath.length,
    });

    return NextResponse.json<GenerateRoadmapResponse>({
      success: true,
      data: roadmap,
      message: 'AI 로드맵 생성 완료',
    });
  } catch (error) {
    console.error('❌ Generate Roadmap error:', error);

    // Detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    let errorMessage = '로드맵 생성 중 오류가 발생했습니다.';
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Gemini API 인증에 실패했습니다.';
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Gemini API 요청 시간이 초과되었습니다.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Gemini API 네트워크 연결에 실패했습니다.';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json<GenerateRoadmapResponse>(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Create detailed prompt for OpenAI
 */
function createRoadmapPrompt(
  transcript: RoadmapRequest['transcript'],
  careerGoal: RoadmapRequest['careerGoal']
): string {
  const courseList = transcript.courses
    .map((c) => `- ${c.courseName} (${c.credits}학점, ${c.courseType})`)
    .join('\n');

  const interests = careerGoal.interests?.join(', ') || '없음';
  const additionalInfo = careerGoal.additionalInfo || '없음';

  return `
# 학습 로드맵 생성 요청

## 학생 성적 정보
- 총 이수 학점: ${transcript.totalCredits}학점
- 전공 학점: ${transcript.totalMajorCredits || 0}학점
- 교양 학점: ${transcript.totalGeneralCredits || 0}학점
- 평균 평점: ${transcript.averageGPA?.toFixed(2) || 'N/A'}/4.5

## 이수 과목 (${transcript.courses.length}개)
${courseList}

## 희망 진로
- 목표 진로: ${careerGoal.careerPath}
- 관심 분야: ${interests}
- 추가 정보: ${additionalInfo}

---

위 정보를 바탕으로 학생을 위한 맞춤형 학습 로드맵을 JSON 형식으로 생성해주세요.

**JSON 구조:**
{
  "careerSummary": "희망 진로에 대한 요약 설명 (2-3문장)",
  "currentSkills": {
    "strengths": ["강점 1", "강점 2", "강점 3", "강점 4", "강점 5"],
    "gaps": ["보완 필요 1", "보완 필요 2", "보완 필요 3", "보완 필요 4", "보완 필요 5"]
  },
  "learningPath": [
    {
      "period": "2025년 겨울방학",
      "goal": "이 기간의 학습 목표",
      "courses": [
        {
          "name": "과목명 또는 강의명",
          "type": "전공필수|전공선택|교양|외부강의|자가학습",
          "reason": "추천 이유",
          "priority": "high|medium|low",
          "prerequisites": ["선수과목1", "선수과목2"]
        }
      ],
      "techStacks": [
        {
          "name": "기술스택 이름 (예: React, Spring Boot, Docker)",
          "category": "framework|library|tool|language|database|platform",
          "reason": "추천 이유 (왜 이 기술을 배워야 하는지)",
          "priority": "high|medium|low",
          "difficulty": 1~5 (1=입문, 5=고급),
          "resources": [
            {
              "title": "학습 자료 제목",
              "url": "https://공식문서또는튜토리얼URL",
              "type": "official|tutorial|course|video"
            }
          ],
          "prerequisites": ["선수 기술"]
        }
      ],
      "activities": ["추가 활동 1", "추가 활동 2"],
      "effort": "주 N시간 (N주)"
    }
  ],
  "advice": "추가 조언 및 팁 (마크다운 형식)"
}

**요구사항:**
1. learningPath는 최소 3개, 최대 5개 기간으로 구성
2. 각 기간마다 2-4개의 과목 추천
3. **각 기간마다 3-5개의 기술스택 추천 (필수)**
   - 진로에 맞는 실무 기술스택 포함 (프레임워크, 라이브러리, 도구)
   - 학습 순서 고려 (기초 → 심화)
   - 공식 문서 URL 포함 (https://로 시작하는 유효한 URL)
   - 난이도는 1(입문)~5(고급)로 평가
4. 실제 세종대학교 교과과정과 외부 강의(Coursera, Udemy 등)를 적절히 조합
5. 학생의 현재 역량과 희망 진로를 고려한 현실적인 로드맵
6. 구체적이고 실행 가능한 조언 제공

**기술스택 추천 가이드라인:**
- Backend: Spring Boot, Django, FastAPI, PostgreSQL, Redis, Docker, Kubernetes 등
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Zustand, React Query 등
- DevOps: Docker, Kubernetes, Jenkins, AWS, Terraform, Prometheus 등
- 공식 문서 우선, 한국어 자료가 있으면 포함
- 실무 수요가 높은 기술 우선 추천

응답은 반드시 위의 JSON 구조를 따라야 합니다.
`.trim();
}
