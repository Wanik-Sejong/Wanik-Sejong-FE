import { RoadmapPhase } from '@/types/roadmap.types';
import { SejongColors } from '@/styles/colors';

export const roadmapData: RoadmapPhase[] = [
  {
    id: 'discover',
    title: 'Discover',
    duration: '2 days',
    color: SejongColors.primary,
    gradient: `linear-gradient(135deg, ${SejongColors.primary} 0%, ${SejongColors.primary700} 100%)`,
    icon: '🔍',
    activities: [
      { id: '1', description: 'Comparative analysis' },
      { id: '2', description: 'Business interview' },
      { id: '3', description: 'User interview' },
      { id: '4', description: 'Define the problem and project goals' },
    ],
  },
  {
    id: 'ideate',
    title: 'Ideate',
    duration: '2.5 days',
    color: SejongColors.gold,
    gradient: `linear-gradient(135deg, ${SejongColors.gold} 0%, ${SejongColors.gold700} 100%)`,
    icon: '💡',
    activities: [
      { id: '1', description: 'Ideation session with product team' },
      { id: '2', description: 'Card sorting' },
      { id: '3', description: 'User journey mapping' },
      { id: '4', description: 'Wireframing session with product team' },
    ],
  },
  {
    id: 'create',
    title: 'Create',
    duration: '2.5 days',
    color: SejongColors.secondary,
    gradient: `linear-gradient(135deg, ${SejongColors.secondary} 0%, ${SejongColors.secondary700} 100%)`,
    icon: '🎨',
    activities: [
      { id: '1', description: 'Create high-fi wireframes' },
      { id: '2', description: 'Internal review with product team' },
      { id: '3', description: 'External review with business team' },
      { id: '4', description: 'Refine high-fi wireframes' },
    ],
  },
  {
    id: 'deliver',
    title: 'Deliver',
    duration: '1 day',
    color: SejongColors.info,
    gradient: `linear-gradient(135deg, ${SejongColors.info} 0%, ${SejongColors.infoDark} 100%)`,
    icon: '🚀',
    activities: [
      { id: '1', description: 'Create InVision prototype' },
      { id: '2', description: 'Presentation' },
      { id: '3', description: 'Deliver to development' },
    ],
  },
];
