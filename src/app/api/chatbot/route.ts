/**
 * Chatbot API Route
 * Gemini AI 기반 자연어 처리 챗봇 엔드포인트
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CourseData } from '@/lib/chatbot/types';

/**
 * 챗봇 요청 타입
 */
interface ChatbotRequest {
  /** 사용자 메시지 */
  message: string;
  /** 검색된 과목 데이터 (컨텍스트) */
  courseContext?: CourseData[];
  /** 대화 기록 (최근 5개) */
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

/**
 * 챗봇 응답 타입
 */
interface ChatbotResponse {
  success: boolean;
  message?: string;
  error?: string;
  fallbackToLocalSearch?: boolean;
}

/**
 * POST /api/chatbot
 * Gemini AI를 사용한 자연어 처리 챗봇
 */
export async function POST(request: NextRequest) {
  try {
    // 환경변수 검증
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY is not set');
      return NextResponse.json(
        {
          success: false,
          error: 'API Key가 설정되지 않았습니다.',
          fallbackToLocalSearch: true,
        } as ChatbotResponse,
        { status: 500 }
      );
    }

    // 요청 파싱
    const body: ChatbotRequest = await request.json();
    const { message, courseContext = [], conversationHistory = [] } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '메시지를 입력해주세요.',
        } as ChatbotResponse,
        { status: 400 }
      );
    }

    console.log('🤖 Chatbot request:', {
      message,
      contextSize: courseContext.length,
      historySize: conversationHistory.length,
    });

    // Gemini AI 초기화
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // 시스템 프롬프트 구성
    const systemPrompt = buildSystemPrompt(courseContext);

    // 대화 기록 포함한 전체 프롬프트 구성
    const fullPrompt = buildFullPrompt(
      systemPrompt,
      conversationHistory,
      message,
      courseContext
    );

    console.log('📝 Full prompt length:', fullPrompt.length);

    // Gemini AI 호출
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const aiMessage = response.text();

    console.log('✅ Gemini AI response received:', {
      length: aiMessage.length,
      preview: aiMessage.substring(0, 100),
    });

    return NextResponse.json({
      success: true,
      message: aiMessage,
    } as ChatbotResponse);
  } catch (error) {
    console.error('❌ Chatbot API error:', error);

    // 에러 타입별 처리
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
      });

      // API 할당량 초과 등 특정 에러 처리
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          {
            success: false,
            error: 'AI 서비스 사용량 초과. 로컬 검색으로 대체합니다.',
            fallbackToLocalSearch: true,
          } as ChatbotResponse,
          { status: 429 }
        );
      }

      // 일반 에러
      return NextResponse.json(
        {
          success: false,
          error: 'AI 응답 생성 중 오류가 발생했습니다.',
          fallbackToLocalSearch: true,
        } as ChatbotResponse,
        { status: 500 }
      );
    }

    // 알 수 없는 에러
    return NextResponse.json(
      {
        success: false,
        error: '예상치 못한 오류가 발생했습니다.',
        fallbackToLocalSearch: true,
      } as ChatbotResponse,
      { status: 500 }
    );
  }
}

/**
 * 시스템 프롬프트 구성
 * 세박사의 역할과 페르소나 정의
 */
function buildSystemPrompt(courseContext: CourseData[]): string {
  return `당신은 "세박사"입니다. 세종대학교 컴퓨터공학과 학생들을 위한 친절하고 똑똑한 학업 도우미입니다.

## 🎓 당신의 역할
- 세종대학교 컴퓨터공학과의 교과목, 교수님, 강의 시간 등에 대해 답변합니다.
- 학생들이 수강 신청, 졸업 요건, 진로 선택에 도움이 되는 정보를 제공합니다.
- 친근하고 대학생 멘토 같은 말투로 대화합니다.

## 📚 응답 원칙
1. **정확성 우선**: 제공된 과목 데이터에 기반하여 정확한 정보만 제공하세요.
2. **친절한 말투**: "~해요", "~드릴게요" 같은 친근한 존댓말을 사용하세요.
3. **구조화된 답변**: 복잡한 정보는 불릿 포인트나 표로 정리하세요.
4. **이모지 활용**: 적절한 이모지를 사용해 시각적으로 읽기 편하게 만드세요.
5. **데이터 없으면 명확히 말하기**: 정보가 없으면 "현재 데이터에서 찾을 수 없어요" 같이 명확히 전달하세요.

## 🚫 금지 사항
- 데이터에 없는 정보를 지어내지 마세요.
- 과도하게 격식을 차리지 마세요 (교수님처럼 말하지 않기).
- 너무 짧거나 불친절한 답변은 피하세요.

## 📊 제공된 과목 데이터 개수
${courseContext.length > 0 ? `현재 ${courseContext.length}개의 관련 과목 정보가 제공되었습니다.` : '현재 제공된 과목 데이터가 없습니다. 일반적인 안내만 가능합니다.'}

## 💬 응답 형식 예시
- 과목 정보 제공 시:
  **📘 [과목명]** (학수번호-분반)
  - 교수님: [이름]
  - 시간: [요일 및 시간]
  - 이수구분: [전필/전선/교필/교선]
  - 학점: [학점]

- 여러 과목 비교 시: 표 형식 사용
- 조언/추천 시: 불릿 포인트로 정리

준비되셨나요? 학생의 질문에 친절하고 정확하게 답변해주세요! 🎓`;
}

/**
 * 전체 프롬프트 구성
 * 시스템 프롬프트 + 대화 기록 + 현재 질문 + 과목 데이터
 */
function buildFullPrompt(
  systemPrompt: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentMessage: string,
  courseContext: CourseData[]
): string {
  let prompt = systemPrompt + '\n\n';

  // 대화 기록 추가 (최근 5개만)
  if (conversationHistory.length > 0) {
    prompt += '## 📜 이전 대화 기록\n';
    conversationHistory.slice(-5).forEach((msg) => {
      const role = msg.role === 'user' ? '학생' : '세박사';
      prompt += `**${role}**: ${msg.content}\n\n`;
    });
  }

  // 과목 데이터 추가 (검색 결과가 있을 경우)
  if (courseContext.length > 0) {
    prompt += '## 📊 관련 과목 데이터\n';
    prompt += '```json\n';
    prompt += JSON.stringify(
      courseContext.map((course) => ({
        교과목명: course.교과목명,
        학수번호: course.학수번호,
        분반: course.분반,
        교수명: course.교수명,
        이수구분: course.이수구분,
        학점: course['학점/이론/실습'],
        학년: course['학년 (학기)'],
        요일및시간: course['요일 및 강의시간'],
        강의실: course.강의실,
        수강유의사항: course['수강대상 및 유의사항'],
      })),
      null,
      2
    );
    prompt += '\n```\n\n';
  }

  // 현재 질문 추가
  prompt += `## 💬 현재 질문\n**학생**: ${currentMessage}\n\n`;
  prompt += '**세박사**: ';

  return prompt;
}
