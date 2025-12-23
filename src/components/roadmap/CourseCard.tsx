'use client';

import { Badge } from '../ui/Badge';
import { SejongColors } from '@/styles/colors';
import type { RecommendedCourse } from '@/lib/types';

interface CourseCardProps {
  course: RecommendedCourse;
  index: number;
}

const PRIORITY_COLORS = {
  high: SejongColors.primary,
  medium: SejongColors.gold,
  low: SejongColors.secondary,
};

const PRIORITY_LABELS = {
  high: '필수',
  medium: '권장',
  low: '선택',
};

const PRIORITY_ICONS = {
  high: '⭐',
  medium: '✨',
  low: '📌',
};

export function CourseCard({ course, index }: CourseCardProps) {
  const priorityColor = course.priority ? PRIORITY_COLORS[course.priority] : SejongColors.secondary;
  const priorityLabel = course.priority ? PRIORITY_LABELS[course.priority] : '일반';
  const priorityIcon = course.priority ? PRIORITY_ICONS[course.priority] : '📌';

  return (
    <div
      className="relative p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4"
      style={{ borderLeftColor: priorityColor }}
    >
      {/* Priority Badge */}
      <div className="absolute top-4 right-4">
        <Badge
          variant={
            course.priority === 'high'
              ? 'primary'
              : course.priority === 'medium'
              ? 'gold'
              : 'secondary'
          }
          size="sm"
        >
          {priorityIcon} {priorityLabel}
        </Badge>
      </div>

      {/* Course Number */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: priorityColor }}
        >
          {index + 1}
        </span>
        <Badge variant="secondary" size="sm">
          {course.type}
        </Badge>
      </div>

      {/* Course Name */}
      <h4 className="text-lg font-bold mb-3" style={{ color: SejongColors.text.primary }}>
        {course.name}
      </h4>

      {/* Course Reason */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{course.reason}</p>

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="font-semibold">선수과목:</span>
            <span>{course.prerequisites.join(', ')}</span>
          </p>
        </div>
      )}

      {/* Hover Effect Indicator */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${priorityColor}05 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
