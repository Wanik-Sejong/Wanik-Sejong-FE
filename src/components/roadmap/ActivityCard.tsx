'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SejongColors } from '@/styles/colors';

interface ActivityCardProps {
  activity: string;
  index: number;
}

/**
 * 활동 카테고리 자동 감지
 */
function detectActivityCategory(activity: string): {
  category: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  const lowerActivity = activity.toLowerCase();

  // 프로젝트
  if (
    lowerActivity.includes('프로젝트') ||
    lowerActivity.includes('project') ||
    lowerActivity.includes('개발') ||
    lowerActivity.includes('구현')
  ) {
    return {
      category: '프로젝트',
      icon: '💻',
      color: SejongColors.primary,
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
    };
  }

  // 스터디
  if (
    lowerActivity.includes('스터디') ||
    lowerActivity.includes('study') ||
    lowerActivity.includes('학습') ||
    lowerActivity.includes('공부')
  ) {
    return {
      category: '스터디',
      icon: '📚',
      color: SejongColors.gold,
      bgColor: 'from-amber-50 to-yellow-50',
      borderColor: 'border-amber-200',
    };
  }

  // 대외활동
  if (
    lowerActivity.includes('대외활동') ||
    lowerActivity.includes('동아리') ||
    lowerActivity.includes('커뮤니티') ||
    lowerActivity.includes('참여')
  ) {
    return {
      category: '대외활동',
      icon: '🌐',
      color: '#10B981',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
    };
  }

  // 인턴/경력
  if (
    lowerActivity.includes('인턴') ||
    lowerActivity.includes('intern') ||
    lowerActivity.includes('경력') ||
    lowerActivity.includes('실무')
  ) {
    return {
      category: '인턴십',
      icon: '💼',
      color: '#8B5CF6',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
    };
  }

  // 온라인 강의
  if (
    lowerActivity.includes('강의') ||
    lowerActivity.includes('온라인') ||
    lowerActivity.includes('인프런') ||
    lowerActivity.includes('유데미') ||
    lowerActivity.includes('코드카데미')
  ) {
    return {
      category: '온라인 강의',
      icon: '🎓',
      color: '#3B82F6',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
    };
  }

  // 기타
  return {
    category: '기타',
    icon: '🎯',
    color: SejongColors.secondary,
    bgColor: 'from-gray-50 to-slate-50',
    borderColor: 'border-gray-200',
  };
}

/**
 * 우선순위 감지 (키워드 기반)
 */
function detectPriority(activity: string): 'high' | 'medium' | 'low' {
  const lowerActivity = activity.toLowerCase();

  // 높은 우선순위: 필수, 반드시, 꼭
  if (
    lowerActivity.includes('필수') ||
    lowerActivity.includes('반드시') ||
    lowerActivity.includes('꼭')
  ) {
    return 'high';
  }

  // 낮은 우선순위: 선택, 추가, 가능하면
  if (
    lowerActivity.includes('선택') ||
    lowerActivity.includes('추가') ||
    lowerActivity.includes('가능하면')
  ) {
    return 'low';
  }

  // 기본: 중간 우선순위
  return 'medium';
}

export function ActivityCard({ activity, index }: ActivityCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const { category, icon, color, bgColor, borderColor } =
    detectActivityCategory(activity);
  const priority = detectPriority(activity);

  const priorityConfig = {
    high: { label: '높음', color: '#EF4444', emoji: '🔴' },
    medium: { label: '중간', color: SejongColors.gold, emoji: '🟡' },
    low: { label: '낮음', color: '#10B981', emoji: '🟢' },
  };

  const priorityInfo = priorityConfig[priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`relative p-5 rounded-xl bg-linear-to-br ${bgColor} border-2 ${borderColor} hover:shadow-lg transition-all duration-300 group ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      {/* 상단: 카테고리 뱃지 + 체크박스 */}
      <div className="flex items-center justify-between mb-3">
        {/* 카테고리 뱃지 */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          <span className="text-base">{icon}</span>
          <span>{category}</span>
        </div>

        {/* 체크박스 */}
        <button
          onClick={() => setIsCompleted(!isCompleted)}
          className="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            borderColor: isCompleted ? color : '#D1D5DB',
            backgroundColor: isCompleted ? color : 'white',
          }}
          aria-label={isCompleted ? '완료 취소' : '완료 표시'}
        >
          {isCompleted && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* 중앙: 활동 설명 */}
      <p
        className={`text-sm text-gray-700 leading-relaxed mb-3 ${
          isCompleted ? 'line-through text-gray-400' : ''
        }`}
      >
        {activity}
      </p>

      {/* 하단: 우선순위 표시 */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500 font-medium">우선순위:</span>
        <div className="flex items-center gap-1">
          <span className="text-sm">{priorityInfo.emoji}</span>
          <span
            className="text-xs font-semibold"
            style={{ color: priorityInfo.color }}
          >
            {priorityInfo.label}
          </span>
        </div>
      </div>

      {/* 호버 시 그림자 효과 */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 8px 24px ${color}40`,
        }}
      />
    </motion.div>
  );
}
