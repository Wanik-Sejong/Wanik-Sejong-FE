'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { RoadmapCarouselProps } from '@/types/roadmap.types';
import { RoadmapCard } from './RoadmapCard';
import { ProgressBar } from './ProgressBar';
import { NavigationDots } from './NavigationDots';

export function RoadmapCarousel({
  phases,
  autoPlayInterval,
  enableSwipe = true,
}: RoadmapCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlayInterval) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phases.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval, phases.length]);

  // Handle drag end
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 50;
    const swipeVelocityThreshold = 500;

    if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -swipeVelocityThreshold
    ) {
      // Swipe left - next
      goToNext();
    } else if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > swipeVelocityThreshold
    ) {
      // Swipe right - previous
      goToPrevious();
    }

    setDragOffset(0);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % phases.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + phases.length) % phases.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const currentPhase = phases[currentIndex];
  const colors = phases.map((phase) => phase.color);

  return (
    <div className="relative w-full py-12 px-4">
      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <ProgressBar
          currentIndex={currentIndex}
          totalSteps={phases.length}
          currentColor={currentPhase.color}
        />
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {enableSwipe ? (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            onDrag={(_, info) => setDragOffset(info.offset.x)}
            className="cursor-grab active:cursor-grabbing"
          >
            <RoadmapCard
              phase={currentPhase}
              isActive={true}
              index={currentIndex}
              totalPhases={phases.length}
            />
          </motion.div>
        ) : (
          <RoadmapCard
            phase={currentPhase}
            isActive={true}
            index={currentIndex}
            totalPhases={phases.length}
          />
        )}
      </div>

      {/* Navigation Dots */}
      <NavigationDots
        totalDots={phases.length}
        activeIndex={currentIndex}
        colors={colors}
        onDotClick={goToIndex}
      />

      {/* Desktop Arrow Buttons (Hidden on mobile) */}
      <div className="hidden md:block">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
          aria-label="Previous phase"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
          aria-label="Next phase"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
