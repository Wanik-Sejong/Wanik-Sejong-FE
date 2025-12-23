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

/**
 * 과목 타입(카테고리)별 색상 및 아이콘 정의
 */
interface CategoryConfig {
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  전공필수: {
    icon: '🎓',
    color: SejongColors.primary,
    bgColor: 'from-red-50 to-pink-50',
    borderColor: 'border-red-200',
  },
  전공선택: {
    icon: '📚',
    color: SejongColors.gold,
    bgColor: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
  },
  교양: {
    icon: '📖',
    color: '#3B82F6',
    bgColor: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
  },
  외부강의: {
    icon: '💻',
    color: '#8B5CF6',
    bgColor: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-200',
  },
  부트캠프: {
    icon: '🚀',
    color: '#10B981',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
  },
  인턴십: {
    icon: '💼',
    color: SejongColors.secondary,
    bgColor: 'from-gray-50 to-slate-50',
    borderColor: 'border-gray-200',
  },
};

/**
 * 과목 타입에 해당하는 카테고리 설정을 가져옴
 */
function getCategoryConfig(type: string | undefined): CategoryConfig {
  if (!type) {
    return {
      icon: '📌',
      color: SejongColors.secondary,
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-200',
    };
  }

  // 정확한 매칭 시도
  if (CATEGORY_CONFIG[type]) {
    return CATEGORY_CONFIG[type];
  }

  // 부분 매칭 (키워드 기반)
  const lowerType = type.toLowerCase();
  if (lowerType.includes('전공') && lowerType.includes('필수')) {
    return CATEGORY_CONFIG['전공필수'];
  }
  if (lowerType.includes('전공')) {
    return CATEGORY_CONFIG['전공선택'];
  }
  if (lowerType.includes('교양')) {
    return CATEGORY_CONFIG['교양'];
  }
  if (lowerType.includes('외부') || lowerType.includes('온라인')) {
    return CATEGORY_CONFIG['외부강의'];
  }
  if (lowerType.includes('부트캠프')) {
    return CATEGORY_CONFIG['부트캠프'];
  }
  if (lowerType.includes('인턴')) {
    return CATEGORY_CONFIG['인턴십'];
  }

  // 기본값
  return {
    icon: '📌',
    color: SejongColors.secondary,
    bgColor: 'from-gray-50 to-slate-50',
    borderColor: 'border-gray-200',
  };
}

export function CourseCard({ course, index }: CourseCardProps) {
  const priorityColor = course.priority ? PRIORITY_COLORS[course.priority] : SejongColors.secondary;
  const priorityLabel = course.priority ? PRIORITY_LABELS[course.priority] : '일반';
  const priorityIcon = course.priority ? PRIORITY_ICONS[course.priority] : '📌';

  // 카테고리 설정 가져오기
  const categoryConfig = getCategoryConfig(course.type);

  return (
    <div
      className={`relative p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 ${categoryConfig.borderColor} bg-linear-to-br ${categoryConfig.bgColor}`}
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

      {/* Course Number & Category */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: categoryConfig.color }}
        >
          {index + 1}
        </span>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${categoryConfig.color}15`,
            color: categoryConfig.color,
          }}
        >
          <span className="text-base">{categoryConfig.icon}</span>
          <span>{course.type || '기타'}</span>
        </div>
      </div>

      {/* Course Name */}
      <h4 className="text-lg font-bold mb-3" style={{ color: SejongColors.text.primary }}>
        {course.name}
      </h4>

      {/* Course Reason */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{course.reason}</p>

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
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
          background: `linear-gradient(135deg, ${categoryConfig.color}08 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
