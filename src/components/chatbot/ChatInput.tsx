/**
 * Chat Input
 * 사용자 메시지 입력 컴포넌트
 */

'use client';

import { useState, KeyboardEvent } from 'react';
import { SejongColors } from '@/styles/colors';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onSend(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="과목명, 교수님, 시간 등을 검색해보세요..."
          className="flex-1 px-4 py-2 border rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-offset-0
                     disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: SejongColors.border.light,
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="px-4 py-2 rounded-lg text-white font-medium
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:opacity-90"
          style={{
            backgroundColor: SejongColors.primary,
          }}
        >
          전송
        </button>
      </div>

      {/* 예시 질문 (입력이 비어있을 때만 표시) */}
      {!input && (
        <div className="mt-2 flex flex-wrap gap-2">
          {['C프로그래밍', '월요일 오후', '전필 과목'].map((example) => (
            <button
              key={example}
              onClick={() => setInput(example)}
              disabled={disabled}
              className="text-xs px-2 py-1 rounded border
                         hover:bg-gray-100 transition-colors
                         disabled:opacity-50"
              style={{ borderColor: SejongColors.border.light }}
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
