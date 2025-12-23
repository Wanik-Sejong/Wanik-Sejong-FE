'use client';

import type { IconName } from '@/types/icon.types';
import type { SVGProps } from 'react';

// Import SVG icons from assets
import SchoolIcon from '@/assets/icons/graduation-cap-01.svg';
import GlobeIcon from '@/assets/icons/globe.svg';
import BooksIcon from '@/assets/icons/book-06.svg';
import MapIcon from '@/assets/icons/map.svg';
import LaptopIcon from '@/assets/icons/laptop.svg';
import StrongIcon from '@/assets/icons/smiley-happy.svg';
import WeaknessIcon from '@/assets/icons/smiley-sad.svg';
import TargetIcon from '@/assets/icons/marker-01.svg';
import FilePdfIcon from '@/assets/icons/file-plus-01.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';
import BookIcon from '@/assets/icons/book-06.svg';
import LightbulbIcon from '@/assets/icons/lightbulb.svg';
import RocketIcon from '@/assets/icons/rocket.svg';
import StarIcon from '@/assets/icons/star.svg';
import TrophyIcon from '@/assets/icons/trophy.svg';
import SparklesIcon from '@/assets/icons/sparkles.svg';
import PinIcon from '@/assets/icons/pin.svg';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
}

/**
 * Icon mapping from semantic names to local SVG components
 */
const ICON_MAP: Record<IconName, React.FC<SVGProps<SVGSVGElement>>> = {
  // Navigation & Category
  school: SchoolIcon,
  globe: GlobeIcon,

  // Statistics
  books: BooksIcon,
  map: MapIcon,
  laptop: LaptopIcon,
  strong: StrongIcon,
  weakness: WeaknessIcon,
  target: TargetIcon,

  // Actions
  'file-pdf': FilePdfIcon,
  refresh: RefreshIcon,

  // Phase & Priority
  book: BookIcon,
  lightbulb: LightbulbIcon,
  rocket: RocketIcon,
  star: StarIcon,
  trophy: TrophyIcon,
  sparkles: SparklesIcon,
  pin: PinIcon,
};

export const Icon = ({ name, size = 24, className = '', ...props }: IconProps) => {
  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in ICON_MAP`);
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};
