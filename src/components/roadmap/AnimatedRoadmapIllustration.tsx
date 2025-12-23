'use client';

import { motion } from 'framer-motion';
import { SejongColors } from '@/styles/colors';

export function AnimatedRoadmapIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Gradient Circle */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, ${SejongColors.primary} 0%, transparent 70%)` }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main Roadmap Path */}
      <svg
        className="relative z-10"
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated Path */}
        <motion.path
          d="M 50 350 Q 100 300, 150 320 T 250 280 T 350 250"
          stroke={SejongColors.primary}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {/* Start Point */}
        <motion.circle
          cx="50"
          cy="350"
          r="12"
          fill={SejongColors.primary}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />

        {/* Milestone 1 */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <circle cx="150" cy="320" r="16" fill={SejongColors.secondary} />
          <text
            x="150"
            y="295"
            textAnchor="middle"
            fill={SejongColors.text.primary}
            fontSize="12"
            fontWeight="600"
          >
            기초
          </text>
        </motion.g>

        {/* Milestone 2 */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <circle cx="250" cy="280" r="16" fill={SejongColors.gold} />
          <text
            x="250"
            y="255"
            textAnchor="middle"
            fill={SejongColors.text.primary}
            fontSize="12"
            fontWeight="600"
          >
            성장
          </text>
        </motion.g>

        {/* Goal Point */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <motion.circle
            cx="350"
            cy="250"
            r="20"
            fill={SejongColors.primary}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <text
            x="350"
            y="220"
            textAnchor="middle"
            fill={SejongColors.text.primary}
            fontSize="14"
            fontWeight="bold"
          >
            목표
          </text>
        </motion.g>

        {/* Floating Elements */}
        <motion.circle
          cx="100"
          cy="250"
          r="4"
          fill={SejongColors.secondary}
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.circle
          cx="200"
          cy="200"
          r="4"
          fill={SejongColors.gold}
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            delay: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.circle
          cx="300"
          cy="180"
          r="4"
          fill={SejongColors.primary}
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            delay: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>

      {/* Decorative Icons */}
      <motion.div
        className="absolute top-10 left-10 text-4xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        📚
      </motion.div>
      <motion.div
        className="absolute top-20 right-20 text-4xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          delay: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🎯
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-20 text-4xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          delay: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        💡
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-4xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          delay: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🚀
      </motion.div>
    </div>
  );
}
