import { SejongColors } from '@/styles/colors';
import type { RoadmapPhase as LearningPhase } from '@/lib/types';
import type { RoadmapPhase as TimelinePhase, Activity } from '@/types/roadmap.types';

/**
 * 단계별 색상 매핑 (세종 컬러 시스템 기반)
 */
const PHASE_COLORS = [
  SejongColors.primary,     // #C31632 - 세종 레드
  SejongColors.gold,        // #8B6F4E - 세종 골드
  SejongColors.secondary,   // #51626F - 세종 그레이
  SejongColors.info,        // #3B82F6 - 파랑
];

const PHASE_GRADIENTS = [
  `linear-gradient(135deg, ${SejongColors.primary} 0%, ${SejongColors.primary700} 100%)`,
  `linear-gradient(135deg, ${SejongColors.gold} 0%, ${SejongColors.gold700} 100%)`,
  `linear-gradient(135deg, ${SejongColors.secondary} 0%, ${SejongColors.secondary700} 100%)`,
  `linear-gradient(135deg, ${SejongColors.info} 0%, ${SejongColors.infoDark} 100%)`,
];

/**
 * 단계별 아이콘 매핑
 */
const PHASE_ICONS = ['📚', '💡', '🚀', '🎯', '⭐', '🏆'];

/**
 * 단계 인덱스에 따른 색상 반환 (순환)
 */
function getPhaseColor(index: number): string {
  return PHASE_COLORS[index % PHASE_COLORS.length];
}

/**
 * 단계 인덱스에 따른 그라데이션 반환 (순환)
 */
function getPhaseGradient(index: number): string {
  return PHASE_GRADIENTS[index % PHASE_GRADIENTS.length];
}

/**
 * 단계 인덱스에 따른 아이콘 반환 (순환)
 */
function getPhaseIcon(index: number): string {
  return PHASE_ICONS[index % PHASE_ICONS.length];
}

/**
 * learningPath (AI 생성 데이터)를 TimelineRoadmap용 RoadmapPhase[]로 변환
 *
 * @param learningPath - AI가 생성한 학습 경로 데이터
 * @returns Timeline 컴포넌트에서 사용 가능한 형식
 */
export function convertLearningPathToPhases(
  learningPath: LearningPhase[]
): TimelinePhase[] {
  return learningPath.map((phase, index) => {
    // 활동 리스트 생성 (과목 + 기술스택 + 추가활동)
    const activities: Activity[] = [];

    // 1. 추천 과목 추가
    phase.courses.forEach((course, idx) => {
      const priorityEmoji = course.priority === 'high' ? '⭐' : course.priority === 'medium' ? '✨' : '📌';
      activities.push({
        id: `course-${index}-${idx}`,
        description: `${priorityEmoji} ${course.name} (${course.type})`,
      });
    });

    // 2. 기술스택 추가 (있는 경우)
    if (phase.techStacks && phase.techStacks.length > 0) {
      phase.techStacks.forEach((tech, idx) => {
        activities.push({
          id: `tech-${index}-${idx}`,
          description: `💻 ${tech.name} - ${tech.category}`,
        });
      });
    }

    // 3. 추가 활동 추가 (있는 경우)
    if (phase.activities && phase.activities.length > 0) {
      phase.activities.forEach((activity, idx) => {
        activities.push({
          id: `activity-${index}-${idx}`,
          description: `🎯 ${activity}`,
        });
      });
    }

    // TimelinePhase 형식으로 변환
    return {
      id: `phase-${index}`,
      title: phase.period,           // "1학년 1학기"
      duration: phase.effort || '',   // "주 10시간" 또는 빈 문자열
      color: getPhaseColor(index),
      gradient: getPhaseGradient(index),
      icon: getPhaseIcon(index),
      activities,
    };
  });
}
