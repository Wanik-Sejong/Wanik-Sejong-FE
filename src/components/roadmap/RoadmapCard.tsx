'use client';

import { motion } from 'framer-motion';
import { RoadmapCardProps } from '@/types/roadmap.types';

export function RoadmapCard({
  phase,
  isActive,
  index,
  totalPhases,
}: RoadmapCardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0.7, scale: isActive ? 1 : 0.95 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="relative w-full max-w-md mx-auto"
      style={{
        minHeight: '400px',
      }}
    >
      {/* Glassmorphism Card */}
      <div
        className="relative rounded-3xl p-8 backdrop-blur-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isActive
            ? `0 8px 32px rgba(0, 0, 0, 0.12), 0 0 40px ${phase.color}30`
            : '0 4px 16px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Gradient Glow Background */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: phase.gradient }}
        />

        {/* Header */}
        <div className="relative z-10 mb-6">
          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-3xl"
            style={{
              background: `${phase.color}20`,
              boxShadow: `0 4px 12px ${phase.color}30`,
            }}
          >
            {phase.icon}
          </div>

          {/* Title */}
          <h3
            className="text-3xl font-bold mb-2"
            style={{ color: phase.color }}
          >
            {phase.title}
          </h3>

          {/* Duration */}
          <p className="text-sm font-medium text-white/60 uppercase tracking-wider">
            {phase.duration}
          </p>
        </div>

        {/* Activity List */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate={isActive ? 'visible' : 'hidden'}
          className="relative z-10 space-y-3"
        >
          {phase.activities.map((activity, i) => (
            <motion.li
              key={activity.id}
              variants={itemVariants}
              className="flex items-start gap-3 text-white/90"
            >
              {/* Bullet Point */}
              <div
                className="shrink-0 w-2 h-2 rounded-full mt-2"
                style={{ backgroundColor: phase.color }}
              />

              {/* Activity Description */}
              <span className="text-base leading-relaxed">
                {activity.description}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Mini Navigation */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-sm text-white/50 font-medium">
            {index + 1} / {totalPhases}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
