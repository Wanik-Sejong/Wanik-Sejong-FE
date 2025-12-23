'use client';

import { motion } from 'framer-motion';
import { TimelineNodeProps } from '@/types/roadmap.types';

export function TimelineNode({
  phase,
  position,
  isActive,
  onClick,
  index,
}: TimelineNodeProps) {
  return (
    <div className="flex flex-col items-center relative" style={{ minWidth: '200px' }}>
      {/* 제목 + 기간 (상단에 배치되는 경우) */}
      {position === 'top' && (
        <div className="mb-6 text-center">
          <h4
            className="text-lg font-bold mb-1"
            style={{ color: isActive ? phase.color : '#9CA3AF' }}
          >
            {phase.title}
          </h4>
          <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
            {phase.duration}
          </p>
        </div>
      )}

      {/* 수직 연결선 */}
      <div
        className="w-0.5 transition-all duration-300"
        style={{
          height: '40px',
          backgroundColor: isActive ? phase.color : '#D1D5DB',
        }}
      />

      {/* 원형 노드 */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
        style={{
          width: '64px',
          height: '64px',
          backgroundColor: phase.color,
          border: `4px solid ${isActive ? '#FFFDE4' : '#F3F4F6'}`,
          boxShadow: isActive
            ? `0 6px 20px ${phase.color}60`
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
        aria-label={`View ${phase.title} details`}
      >
        <span className="text-2xl">{phase.icon}</span>

        {/* 활성 상태 링 효과 */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${phase.color}`,
              opacity: 0.5,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>

      {/* 수직 연결선 */}
      <div
        className="w-0.5 transition-all duration-300"
        style={{
          height: '40px',
          backgroundColor: isActive ? phase.color : '#D1D5DB',
        }}
      />

      {/* 제목 + 기간 (하단에 배치되는 경우) */}
      {position === 'bottom' && (
        <div className="mt-6 text-center">
          <h4
            className="text-lg font-bold mb-1"
            style={{ color: isActive ? phase.color : '#9CA3AF' }}
          >
            {phase.title}
          </h4>
          <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
            {phase.duration}
          </p>
        </div>
      )}
    </div>
  );
}
