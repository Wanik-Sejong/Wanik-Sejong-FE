'use client';

import { motion } from 'framer-motion';
import { SejongColors } from '@/styles/colors';

export type TabType = 'oncampus' | 'offcampus';

interface Tab {
  value: TabType;
  label: string;
  icon: string;
}

export interface RoadmapTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: Tab[] = [
  { value: 'oncampus', label: '교내', icon: '🏫' },
  { value: 'offcampus', label: '교외', icon: '🌐' },
];

export function RoadmapTabs({ activeTab, onTabChange }: RoadmapTabsProps) {
  return (
    <div className="flex justify-center gap-3 mb-8">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <motion.button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className="relative px-8 py-3 rounded-full font-semibold text-base transition-all overflow-hidden"
            style={{
              backgroundColor: isActive ? SejongColors.primary : '#F3F4F6',
              color: isActive ? '#FFFFFF' : SejongColors.text.primary,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`${tab.label} 탭`}
            aria-selected={isActive}
            role="tab"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: SejongColors.primary,
                  boxShadow: `0 4px 12px ${SejongColors.primary}40`,
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
