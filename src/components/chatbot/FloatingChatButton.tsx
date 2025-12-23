/**
 * Floating Chat Button
 * 우측 하단에 고정된 챗봇 열기 버튼
 */

'use client';

import { useState } from 'react';
import { SejongColors } from '@/styles/colors';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export default function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl
                 transition-all duration-300 hover:scale-110 z-50
                 flex items-center justify-center"
      style={{
        backgroundColor: isHovered ? SejongColors.primary600 : SejongColors.primary,
      }}
      aria-label="세박사 열기"
    >
      {/* Message bubble icon */}
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Tooltip */}
      {isHovered && (
        <div
          className="absolute bottom-full mb-2 right-0 px-3 py-2
                     bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap
                     shadow-lg"
        >
          세박사 🎓
          <div
            className="absolute top-full right-6 w-0 h-0
                       border-l-4 border-r-4 border-t-4 border-transparent
                       border-t-gray-900"
          />
        </div>
      )}
    </button>
  );
}
