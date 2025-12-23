'use client';

import { useState } from 'react';
import { TimelineRoadmapProps } from '@/types/roadmap.types';
import { TimelineNode } from './TimelineNode';
import { PhaseDetailModal } from './PhaseDetailModal';

export function TimelineRoadmap({
  phases,
  enableDragScroll = false,
}: TimelineRoadmapProps) {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [activePhaseId, setActivePhaseId] = useState<string>(phases[0]?.id);

  const selectedPhase = phases.find((p) => p.id === selectedPhaseId) || null;

  function handleNodeClick(phaseId: string) {
    setActivePhaseId(phaseId);
    setSelectedPhaseId(phaseId);
  }

  function handleCloseModal() {
    setSelectedPhaseId(null);
  }

  // 타임라인 그라데이션 생성
  const timelineGradient = `linear-gradient(to right, ${phases
    .map((phase, i) => {
      const position = (i / (phases.length - 1)) * 100;
      return `${phase.color} ${position}%`;
    })
    .join(', ')})`;

  return (
    <div className="relative w-full py-12">
      {/* 스크롤 컨테이너 */}
      <div
        className={`relative overflow-x-auto pb-8 ${
          enableDragScroll ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D1D5DB #F3F4F6',
        }}
      >
        <div className="relative inline-flex items-center justify-center min-w-full px-16">
          {/* 타임라인 중앙선 */}
          <div
            className="absolute left-0 right-0 h-1 rounded-full"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              background: timelineGradient,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              marginLeft: '120px',
              marginRight: '120px',
            }}
          />

          {/* 노드 컨테이너 */}
          <div className="relative flex items-center gap-12" style={{ minWidth: 'max-content' }}>
            {phases.map((phase, index) => {
              const isActive = activePhaseId === phase.id;
              const position = index % 2 === 0 ? 'bottom' : 'top';

              return (
                <div
                  key={phase.id}
                  className="relative"
                  style={{
                    marginTop: position === 'top' ? '0' : '120px',
                    marginBottom: position === 'bottom' ? '0' : '120px',
                  }}
                >
                  <TimelineNode
                    phase={phase}
                    position={position}
                    isActive={isActive}
                    onClick={() => handleNodeClick(phase.id)}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 힌트 텍스트 */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Click on any phase to view detailed activities
        </p>
      </div>

      {/* 상세 모달 */}
      <PhaseDetailModal
        phase={selectedPhase}
        isOpen={selectedPhaseId !== null}
        onClose={handleCloseModal}
      />
    </div>
  );
}
