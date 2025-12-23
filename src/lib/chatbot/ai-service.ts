/**
 * AI Service Client
 * Gemini AI 챗봇 API 호출 클라이언트
 */

import type { CourseData, ChatMessage } from './types';

/**
 * AI 챗봇 응답 타입
 */
export interface AIChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  fallbackToLocalSearch?: boolean;
}

/**
 * AI 챗봇 서비스
 */
export class AIChatService {
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private maxHistorySize = 5;

  /**
   * AI 챗봇에 메시지 전송
   */
  async sendMessage(
    userMessage: string,
    courseContext: CourseData[] = []
  ): Promise<AIChatResponse> {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          courseContext,
          conversationHistory: this.conversationHistory,
        }),
      });

      const data: AIChatResponse = await response.json();

      if (data.success && data.message) {
        // 대화 기록 추가
        this.addToHistory('user', userMessage);
        this.addToHistory('assistant', data.message);
      }

      return data;
    } catch (error) {
      console.error('❌ AI service error:', error);
      return {
        success: false,
        error: '네트워크 오류가 발생했습니다.',
        fallbackToLocalSearch: true,
      };
    }
  }

  /**
   * 대화 기록에 메시지 추가
   */
  private addToHistory(role: 'user' | 'assistant', content: string) {
    this.conversationHistory.push({ role, content });

    // 최대 개수 초과 시 오래된 메시지 제거 (FIFO)
    if (this.conversationHistory.length > this.maxHistorySize * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistorySize * 2);
    }
  }

  /**
   * 대화 기록 초기화
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * 현재 대화 기록 가져오기
   */
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }
}
