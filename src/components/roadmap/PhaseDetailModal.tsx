'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhaseDetailModalProps } from '@/types/roadmap.types';

export function PhaseDetailModal({
  phase,
  isOpen,
  onClose,
}: PhaseDetailModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && phase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            className="relative bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto pointer-events-auto"
            style={{
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25), 0 10px 40px rgba(0, 0, 0, 0.15)',
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* 헤더 */}
            <div
              className="relative p-6 border-b-4"
              style={{ borderColor: phase.color }}
            >
              {/* 배경 그라데이션 */}
              <div
                className="absolute inset-0 opacity-5"
                style={{ background: phase.gradient }}
              />

              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* 아이콘 */}
              <div
                className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 text-4xl"
                style={{
                  backgroundColor: phase.color,
                  boxShadow: `0 4px 12px ${phase.color}40`,
                }}
              >
                {phase.icon}
              </div>

              {/* 제목 */}
              <h2
                className="relative text-3xl font-bold mb-2"
                style={{ color: phase.color }}
              >
                {phase.title}
              </h2>

              {/* 기간 */}
              <p className="relative text-sm font-medium text-gray-600 uppercase tracking-wider">
                Duration: {phase.duration}
              </p>
            </div>

            {/* 활동 리스트 */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Key Activities
              </h3>
              <ul className="space-y-3">
                {phase.activities.map((activity, i) => (
                  <motion.li
                    key={activity.id}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {/* 번호 뱃지 */}
                    <div
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: phase.color }}
                    >
                      {i + 1}
                    </div>

                    {/* 활동 설명 */}
                    <span className="text-gray-700 leading-relaxed">
                      {activity.description}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
