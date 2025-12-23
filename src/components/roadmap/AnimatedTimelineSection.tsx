'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TimelineRoadmap } from './TimelineRoadmap';
import type { RoadmapPhase } from '@/types/roadmap.types';

interface AnimatedTimelineSectionProps {
  phases: RoadmapPhase[];
  enableDragScroll?: boolean;
}

export function AnimatedTimelineSection({
  phases,
  enableDragScroll = true,
}: AnimatedTimelineSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 스크롤 진행도 추적 (섹션이 뷰포트에 들어올 때부터 나갈 때까지)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // 스크롤 진행도에 따라 scale 값 변환
  // 0.0 (시작) → 1.0
  // 0.3-0.7 (중간) → 1.1 (최대 확대)
  // 1.0 (끝) → 1.0
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1.0, 1.1, 1.1, 1.0]
  );

  // 투명도 조절
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  return (
    <div ref={sectionRef} className="w-full">
      <motion.div
        style={{ scale, opacity }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      >
        <TimelineRoadmap phases={phases} enableDragScroll={enableDragScroll} />
      </motion.div>
    </div>
  );
}
