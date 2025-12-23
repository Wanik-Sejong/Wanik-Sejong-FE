/**
 * Chatbot Provider
 * 전역 챗봇 상태 관리 (클라이언트 컴포넌트)
 */

'use client';

import { useState } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatWindow from './ChatWindow';

export default function ChatbotProvider() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
