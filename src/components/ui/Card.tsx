import { ReactNode } from 'react';
import { SejongColors } from '@/styles/colors';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg';
}

const shadowStyles = {
  sm: `shadow-sm`,
  md: `shadow-md`,
  lg: `shadow-lg`,
  xl: `shadow-xl`
};

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function Card({
  children,
  className = '',
  hover = false,
  shadow = 'md',
  padding = 'md'
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl ${shadowStyles[shadow]} ${paddingStyles[padding]}
        transition-all duration-200
        ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue
}: StatCardProps) {
  return (
    <Card hover shadow="lg" className="relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: SejongColors.primary }}
      />

      <div className="relative z-10">
        {icon && (
          <div className="mb-4 text-4xl">{icon}</div>
        )}

        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

        <div className="flex items-baseline gap-2">
          <p
            className="text-3xl font-bold"
            style={{ color: SejongColors.primary }}
          >
            {value}
          </p>

          {trend && trendValue && (
            <span
              className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </Card>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: 'primary' | 'secondary' | 'gold';
}

export function FeatureCard({
  icon,
  title,
  description,
  accent = 'primary'
}: FeatureCardProps) {
  const accentColors = {
    primary: SejongColors.primary,
    secondary: SejongColors.secondary,
    gold: SejongColors.gold
  };

  const bgColors = {
    primary: SejongColors.primary50,
    secondary: SejongColors.secondary50,
    gold: SejongColors.gold50
  };

  return (
    <Card hover shadow="lg" className="text-center">
      {/* Icon Circle */}
      <div
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl"
        style={{ backgroundColor: bgColors[accent] }}
      >
        {icon}
      </div>

      <h3
        className="text-xl font-bold mb-3"
        style={{ color: accentColors[accent] }}
      >
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed">{description}</p>
    </Card>
  );
}
