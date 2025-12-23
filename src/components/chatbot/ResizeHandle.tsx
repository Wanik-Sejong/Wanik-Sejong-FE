/**
 * Resize Handle
 * 채팅 창 크기 조절 핸들 (우측 하단 모서리)
 */

'use client';

import { SejongColors } from '@/styles/colors';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

export default function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="absolute bottom-0 right-0 w-11 h-11 cursor-nwse-resize
                 hover:opacity-100 opacity-60 transition-opacity z-50
                 flex items-center justify-center"
      aria-label="창 크기 조절"
      role="button"
      tabIndex={0}
    >
      {/* 우측 하단 모서리 드래그 핸들 - 세 개의 작은 라인 */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 대각선 라인 3개 */}
        <line
          x1="14"
          y1="6"
          x2="6"
          y2="14"
          stroke={SejongColors.border.medium}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="10"
          x2="10"
          y2="14"
          stroke={SejongColors.border.medium}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="14"
          x2="14"
          y2="14"
          stroke={SejongColors.border.medium}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
