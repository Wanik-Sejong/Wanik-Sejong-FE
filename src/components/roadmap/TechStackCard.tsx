'use client';

import { SejongColors } from '@/styles/colors';
import type { RecommendedTechStack } from '@/lib/types';

interface TechStackCardProps {
  techStack: RecommendedTechStack;
}

export function TechStackCard({ techStack }: TechStackCardProps) {
  return (
    <div className="p-4 rounded-lg bg-linear-to-br from-gray-50 to-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
      {/* Tech Name */}
      <div className="mb-3">
        <h5 className="font-semibold text-gray-800">{techStack.name}</h5>
      </div>

      {/* Reason */}
      {techStack.reason && (
        <p className="text-xs text-gray-600 leading-relaxed">{techStack.reason}</p>
      )}
    </div>
  );
}
