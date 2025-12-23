'use client';

import { SejongColors } from '@/styles/colors';
import type { RecommendedTechStack } from '@/lib/types';

interface TechStackCardProps {
  techStack: RecommendedTechStack;
}

export function TechStackCard({ techStack }: TechStackCardProps) {
  const difficultyStars = techStack.difficulty || 3;
  const difficultyColor =
    difficultyStars <= 2
      ? '#10B981' // green
      : difficultyStars === 3
      ? SejongColors.gold
      : '#EF4444'; // red

  return (
    <div className="p-4 rounded-lg bg-linear-to-br from-gray-50 to-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
      {/* Tech Name */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-gray-800">{techStack.name}</h5>
        {techStack.difficulty && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className="text-sm"
                style={{
                  color: index < difficultyStars ? difficultyColor : '#E5E7EB',
                }}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reason */}
      {techStack.reason && (
        <p className="text-xs text-gray-600 leading-relaxed">{techStack.reason}</p>
      )}

      {/* Difficulty Label */}
      {techStack.difficulty && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">
            난이도: {difficultyStars}/5
          </span>
        </div>
      )}
    </div>
  );
}
