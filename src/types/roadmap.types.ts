import type { IconName } from './icon.types';

export interface Activity {
  id: string;
  description: string;
  isCompleted?: boolean;
  iconName?: IconName;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  duration: string;
  color: string;
  gradient: string;
  icon: string;
  activities: Activity[];
}

export interface RoadmapCarouselProps {
  phases: RoadmapPhase[];
  autoPlayInterval?: number;
  enableSwipe?: boolean;
}

export interface RoadmapCardProps {
  phase: RoadmapPhase;
  isActive: boolean;
  index: number;
  totalPhases: number;
}

export interface ProgressBarProps {
  currentIndex: number;
  totalSteps: number;
  currentColor: string;
}

export interface NavigationDotsProps {
  totalDots: number;
  activeIndex: number;
  colors: string[];
  onDotClick: (index: number) => void;
}

// Timeline Roadmap Types
export interface TimelineRoadmapProps {
  phases: RoadmapPhase[];
  enableDragScroll?: boolean;
}

export interface TimelineNodeProps {
  phase: RoadmapPhase;
  position: 'top' | 'bottom';
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export interface PhaseDetailModalProps {
  phase: RoadmapPhase | null;
  isOpen: boolean;
  onClose: () => void;
}

// Tab Types
export type TabType = 'oncampus' | 'offcampus';

export interface RoadmapTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export interface AnimatedTimelineSectionProps {
  phases: RoadmapPhase[];
  enableDragScroll?: boolean;
}
