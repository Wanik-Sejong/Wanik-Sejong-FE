/**
 * Chat Message
 * 채팅 메시지 표시 (Markdown 렌더링 포함)
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage as ChatMessageType } from '@/lib/chatbot/types';
import { SejongColors } from '@/styles/colors';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] rounded-lg ${
          isAssistant ? 'bg-gray-100 text-gray-900' : 'text-white'
        }`}
        style={{
          backgroundColor: isAssistant ? undefined : SejongColors.primary,
          padding: isAssistant ? '12px' : '10px 14px',
        }}
      >
        {isAssistant ? (
          <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
              // 테이블 스타일링
              table: ({ node, ...props }) => (
                <table
                  className="border-collapse w-full my-2 text-sm"
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border border-gray-300 px-3 py-2 bg-gray-50 font-semibold text-left"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-gray-300 px-3 py-2" {...props} />
              ),
              // 헤딩 스타일링
              h2: ({ node, ...props }) => (
                <h2
                  className="text-lg font-bold mt-2 mb-1"
                  style={{ color: SejongColors.primary }}
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-base font-semibold mt-2 mb-1" {...props} />
              ),
              // 강조 스타일링
              strong: ({ node, ...props }) => (
                <strong className="font-semibold" {...props} />
              ),
              // 인용구 스타일링
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 pl-3 my-2 text-gray-600 italic"
                  style={{ borderColor: SejongColors.primary }}
                  {...props}
                />
              ),
            }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm">{message.content}</p>
        )}

        {/* 타임스탬프 */}
        <div
          className={`text-xs mt-1 ${
            isAssistant ? 'text-gray-500' : 'text-white opacity-70'
          }`}
        >
          {message.timestamp.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
