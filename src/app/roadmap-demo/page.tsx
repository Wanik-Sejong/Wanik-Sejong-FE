'use client';

import { TimelineRoadmap } from '@/components/roadmap';
import { roadmapData } from '@/data/roadmap';
import { SejongColors } from '@/styles/colors';

export default function RoadmapDemoPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${SejongColors.background} 0%, ${SejongColors.gold50} 100%)`,
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: SejongColors.primary }}
        >
          Design Process Roadmap
        </h1>
        <p className="text-lg" style={{ color: SejongColors.text.secondary }}>
          Click on any phase to view detailed activities
        </p>
      </div>

      {/* Timeline Roadmap */}
      <TimelineRoadmap phases={roadmapData} enableDragScroll={true} />
    </div>
  );
}
