/**
 * Chat Window
 * 챗봇 메인 윈도우 컴포넌트
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { LocalSearchEngine } from '@/lib/chatbot/search-engine';
import { ResponseGenerator } from '@/lib/chatbot/response-generator';
import type { ChatMessage as ChatMessageType } from '@/lib/chatbot/types';
import { SejongColors } from '@/styles/colors';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'assistant',
      content:
        '안녕하세요! 🎓 컴공 시간표 챗봇입니다.\n\n궁금한 과목, 교수님, 시간을 검색해보세요!',
      timestamp: new Date(),
    },
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const searchEngineRef = useRef<LocalSearchEngine | null>(null);
  const responseGeneratorRef = useRef(new ResponseGenerator());
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // 검색 실행
      const result = await searchEngineRef.current.search(userMessage);

      // 응답 생성
      const markdown = responseGeneratorRef.current.generateMarkdown(
        userMessage,
        result
      );

      // 챗봇 응답 추가
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: markdown,
          timestamp: new Date(),
          searchResult: result,
        },
      ]);
    } catch (error) {
      console.error('❌ Search error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '죄송합니다. 검색 중 오류가 발생했습니다. 다시 시도해주세요.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl
                  shadow-2xl transition-all duration-300 z-50 flex flex-col
                  ${
                    isOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0 pointer-events-none'
                  }`}
    >
      {/* 헤더 */}
      <div
        className="p-4 border-b flex justify-between items-center rounded-t-2xl"
        style={{ backgroundColor: SejongColors.primary }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <h3 className="text-white font-bold">컴공 시간표 챗봇</h3>
        </div>
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
    </div>
  );
}
