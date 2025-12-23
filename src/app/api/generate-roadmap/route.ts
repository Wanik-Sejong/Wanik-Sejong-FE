import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { config } from '@/lib/config';
import type {
  RoadmapRequest,
  GenerateRoadmapResponse,
  Roadmap,
} from '@/lib/types';

/**
 * POST /api/generate-roadmap
 * Generate AI-powered learning roadmap using OpenAI GPT-4o
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RoadmapRequest = await request.json();
    const { transcript, careerGoal } = body;

    // Validate inputs
    if (!transcript || !transcript.courses || transcript.courses.length === 0) {
      return NextResponse.json<GenerateRoadmapResponse>(
        {
          success: false,
          error: '성적표 데이터가 없습니다.',
        },
        { status: 400 }
      );
    }

    if (!careerGoal || !careerGoal.careerPath) {
      return NextResponse.json<GenerateRoadmapResponse>(
        {
          success: false,
          error: '희망 진로를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    // Check OpenAI API key
    if (!config.openai.apiKey) {
      return NextResponse.json<GenerateRoadmapResponse>(
        {
          success: false,
          error: 'OpenAI API 키가 설정되지 않았습니다.',
        },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });

    // Create prompt
    const prompt = createRoadmapPrompt(transcript, careerGoal);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: `당신은 세종대학교의 진로 상담 전문가입니다. 학생의 이수 과목과 희망 진로를 분석하여 맞춤형 학습 로드맵을 제공합니다. 응답은 반드시 유효한 JSON 형식이어야 합니다.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens,
      response_format: { type: 'json_object' },
    });

    // Parse response
    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('OpenAI 응답이 비어있습니다.');
    }

    const roadmapData = JSON.parse(responseText);

    // Validate and format roadmap
    const roadmap: Roadmap = {
      careerSummary: roadmapData.careerSummary || '',
      currentSkills: roadmapData.currentSkills || { strengths: [], gaps: [] },
      learningPath: roadmapData.learningPath || [],
      advice: roadmapData.advice || '',
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json<GenerateRoadmapResponse>({
      success: true,
      data: roadmap,
      message: 'AI 로드맵 생성 완료',
    });
  } catch (error) {
    console.error('Generate Roadmap error:', error);
    return NextResponse.json<GenerateRoadmapResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : '로드맵 생성 중 오류가 발생했습니다.',
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
      "period": "2025년 여름방학",
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
      "activities": ["추가 활동 1", "추가 활동 2"],
      "effort": "주 N시간 (N주)"
    }
  ],
  "advice": "추가 조언 및 팁 (마크다운 형식)"
}

**요구사항:**
1. learningPath는 최소 3개, 최대 5개 기간으로 구성
2. 각 기간마다 2-4개의 과목 추천
3. 실제 세종대학교 교과과정과 외부 강의(Coursera, Udemy 등)를 적절히 조합
4. 학생의 현재 역량과 희망 진로를 고려한 현실적인 로드맵
5. 구체적이고 실행 가능한 조언 제공

응답은 반드시 위의 JSON 구조를 따라야 합니다.
`.trim();
}
