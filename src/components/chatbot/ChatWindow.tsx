/**
 * Chat Window
 * 챗봇 메인 윈도우 컴포넌트
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import ResizeHandle from './ResizeHandle';
import { LocalSearchEngine } from '@/lib/chatbot/search-engine';
import { ResponseGenerator } from '@/lib/chatbot/response-generator';
import { AIChatService } from '@/lib/chatbot/ai-service';
import type { ChatMessage as ChatMessageType } from '@/lib/chatbot/types';
import { SejongColors } from '@/styles/colors';

// 창 크기 제한
const MIN_WIDTH = 320;
const MIN_HEIGHT = 400;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 384;
const DEFAULT_HEIGHT = 600;

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);

  // 리사이징 관련 state
  const [windowSize, setWindowSize] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const searchEngineRef = useRef<LocalSearchEngine | null>(null);
  const responseGeneratorRef = useRef(new ResponseGenerator());
  const aiServiceRef = useRef(new AIChatService());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // 초기 메시지 추가 (클라이언트에서만)
  useEffect(() => {
    if (!hasInitialMessage) {
      setMessages([
        {
          role: 'assistant',
          content:
            '안녕하세요! 🎓 세박사입니다.\n\n궁금한 과목, 교수님, 시간을 검색해보세요!',
          timestamp: new Date(),
        },
      ]);
      setHasInitialMessage(true);
    }
  }, [hasInitialMessage]);

  // 검색 엔진 초기화
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const engine = new LocalSearchEngine();
      engine
        .initialize()
        .then(() => {
          searchEngineRef.current = engine;
          setIsInitialized(true);
          console.log('✅ Chatbot initialized');
        })
        .catch((error) => {
          console.error('❌ Failed to initialize chatbot:', error);
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                '죄송합니다. 챗봇 초기화에 실패했습니다. 페이지를 새로고침해주세요.',
              timestamp: new Date(),
            },
          ]);
        });
    }
  }, [isOpen, isInitialized]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 모바일 여부 체크 (반응형)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile(); // 초기 체크
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // localStorage에서 저장된 창 크기 복원
  useEffect(() => {
    const saved = localStorage.getItem('chatWindowSize');
    if (saved) {
      try {
        const { width, height } = JSON.parse(saved);
        // 화면 크기를 벗어나지 않도록 검증
        const maxHeight = window.innerHeight - 100;
        setWindowSize({
          width: Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH),
          height: Math.min(Math.max(height, MIN_HEIGHT), maxHeight),
        });
      } catch (e) {
        console.error('Failed to restore window size:', e);
      }
    }
  }, []);

  // 리사이징 시작
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: windowSize.width,
      height: windowSize.height,
    };
  };

  // 리사이징 중
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;

      const newWidth = resizeStartPos.current.width + deltaX;
      const newHeight = resizeStartPos.current.height + deltaY;

      // 최소/최대 크기 제한
      const maxHeight = window.innerHeight - 100;
      setWindowSize({
        width: Math.min(Math.max(newWidth, MIN_WIDTH), MAX_WIDTH),
        height: Math.min(Math.max(newHeight, MIN_HEIGHT), maxHeight),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // localStorage에 저장
      localStorage.setItem('chatWindowSize', JSON.stringify(windowSize));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, windowSize]);

  // 전체화면 토글
  const handleToggleMaximize = () => {
    if (isMaximized) {
      // 복원: localStorage에 저장된 크기로
      const saved = localStorage.getItem('chatWindowSize');
      if (saved) {
        try {
          const { width, height } = JSON.parse(saved);
          setWindowSize({
            width: Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH),
            height: Math.min(Math.max(height, MIN_HEIGHT), window.innerHeight - 100),
          });
        } catch (e) {
          setWindowSize({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
        }
      } else {
        setWindowSize({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
      }
    } else {
      // 최대화: 큰 크기로
      setWindowSize({
        width: MAX_WIDTH,
        height: Math.min(window.innerHeight * 0.9, 900),
      });
    }
    setIsMaximized(!isMaximized);
  };

  const handleSendMessage = async (userMessage: string) => {
    // 사용자 메시지 추가
    const userMsg: ChatMessageType = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    if (!searchEngineRef.current) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '챗봇이 아직 초기화 중입니다. 잠시만 기다려주세요...',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setIsSearching(true);

    try {
      // 1단계: 로컬 검색으로 관련 과목 찾기
      const searchResult = await searchEngineRef.current.search(userMessage);
      const relevantCourses = searchResult.courses;

      console.log('🔍 Local search found:', relevantCourses.length, 'courses');

      // 2단계: AI 서비스로 자연어 응답 생성 시도
      const aiResponse = await aiServiceRef.current.sendMessage(
        userMessage,
        relevantCourses
      );

      // 1초 지연 (UX 개선)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (aiResponse.success && aiResponse.message) {
        // AI 응답 성공
        console.log('✅ AI response received');
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: aiResponse.message || '',
            timestamp: new Date(),
            searchResult,
          },
        ]);
      } else if (aiResponse.fallbackToLocalSearch) {
        // AI 실패 → Fallback: 로컬 검색 결과 사용
        console.log('⚠️ AI failed, using local search fallback');
        const markdown = responseGeneratorRef.current.generateMarkdown(
          userMessage,
          searchResult
        );

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: markdown,
            timestamp: new Date(),
            searchResult,
          },
        ]);
      } else {
        // 완전 실패
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: aiResponse.error || '응답 생성에 실패했습니다. 다시 시도해주세요.',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('❌ Chatbot error:', error);

      // 에러 시에도 1초 지연
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className={`fixed bg-white shadow-2xl z-50 flex flex-col
                  ${
                    isMobile
                      ? 'inset-0 rounded-none'
                      : isMaximized
                        ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl'
                        : 'bottom-6 right-6 rounded-2xl'
                  }
                  ${
                    isOpen
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
      style={{
        width: isMobile ? '100%' : `${windowSize.width}px`,
        height: isMobile ? '100vh' : `${windowSize.height}px`,
        // 리사이징 중에는 transition 비활성화 (부드러운 드래그를 위해)
        transition: isResizing ? 'none' : 'all 0.3s',
      }}
    >
      {/* 헤더 */}
      <div
        className="p-4 border-b flex justify-between items-center rounded-t-2xl"
        style={{ backgroundColor: SejongColors.primary }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <h3 className="text-white font-bold">세박사 🎓</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* 전체화면 토글 버튼 - 데스크탑에서만 표시 */}
          {!isMobile && (
            <button
              onClick={handleToggleMaximize}
              className="text-white hover:bg-white hover:bg-opacity-20
                         rounded-full w-8 h-8 flex items-center justify-center
                         transition-colors"
              aria-label={isMaximized ? '원래 크기로' : '전체화면'}
            >
              {isMaximized ? '🗗' : '🗖'}
            </button>
          )}
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20
                       rounded-full w-8 h-8 flex items-center justify-center
                       transition-colors"
            aria-label="챗봇 닫기"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        {isSearching && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <ChatInput onSend={handleSendMessage} disabled={isSearching} />

      {/* 리사이즈 핸들 - 데스크탑 + 최대화 안 된 상태에서만 표시 */}
      {!isMobile && !isMaximized && (
        <ResizeHandle onMouseDown={handleResizeStart} />
      )}
    </div>
  );
}
