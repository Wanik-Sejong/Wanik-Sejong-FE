'use client';

import { SejongColors } from '@/styles/colors';

interface DonutChartProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
}

export function DonutChart({
  value,
  max = 100,
  size = 200,
  strokeWidth = 20,
  label,
  showPercentage = true
}: DonutChartProps) {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={SejongColors.primary50}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={SejongColors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span
            className="text-4xl font-bold"
            style={{ color: SejongColors.primary }}
          >
            {percentage.toFixed(1)}%
          </span>
        )}
        {label && (
          <span className="text-sm text-gray-600 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  showValues?: boolean;
}

export function BarChart({ data, height = 200, showValues = true }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        const barColor = item.color || SejongColors.primary;

        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{item.label}</span>
              {showValues && (
                <span className="text-gray-600">{item.value}</span>
              )}
            </div>

            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${barHeight}%`,
                  backgroundColor: barColor
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = SejongColors.primary,
  size = 'md'
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div className={`relative w-full bg-gray-100 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}
