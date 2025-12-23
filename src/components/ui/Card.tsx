import { ReactNode, CSSProperties } from 'react';
import { SejongColors } from '@/styles/colors';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/types/icon.types';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
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
  padding = 'md',
  style
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl ${shadowStyles[shadow]} ${paddingStyles[padding]}
        transition-all duration-200
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  iconName?: IconName;
  trend?: 'up' | 'down';
  trendValue?: string;
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  hoverEffect?: 'lift' | 'glow' | 'scale';
}

export function StatCard({
  title,
  value,
  description,
  iconName,
  trend,
  trendValue,
  gradient = false,
  gradientFrom = SejongColors.primary,
  gradientTo = SejongColors.secondary,
  hoverEffect = 'lift'
}: StatCardProps) {
  const hoverEffectClasses = {
    lift: 'hover:shadow-xl hover:-translate-y-1',
    glow: 'hover:shadow-2xl',
    scale: 'hover:scale-105'
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl shadow-lg p-8
        transition-all duration-300 cursor-pointer
        ${hoverEffectClasses[hoverEffect]}
      `}
      style={
        gradient
          ? {
              background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            }
          : { backgroundColor: 'white' }
      }
    >
      {/* Background Pattern */}
      {!gradient && (
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: SejongColors.primary }}
        />
      )}

      {/* Gradient Overlay Effect */}
      {gradient && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-2xl bg-white" />
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-2xl bg-white" />
        </div>
      )}

      <div className="relative z-10">
        {iconName && (
          <div className={`mb-4 ${gradient ? 'opacity-90' : ''}`}>
            <Icon name={iconName} size={40} color={gradient ? 'white' : SejongColors.primary} />
          </div>
        )}

        <h3 className={`text-sm font-medium mb-2 ${gradient ? 'text-white/90' : 'text-gray-600'}`}>
          {title}
        </h3>

        <div className="flex items-baseline gap-2">
          <p
            className={`text-3xl font-bold ${gradient ? 'text-white' : ''}`}
            style={gradient ? {} : { color: SejongColors.primary }}
          >
            {value}
          </p>

          {trend && trendValue && (
            <span
              className={`text-sm font-medium ${
                gradient
                  ? 'text-white/80'
                  : trend === 'up'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>

        {description && (
          <p className={`text-sm mt-2 ${gradient ? 'text-white/80' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

interface FeatureCardProps {
  iconName: IconName;
  title: string;
  description?: string;
  content?: ReactNode;
  items?: string[];
  accent?: 'primary' | 'secondary' | 'gold';
  align?: 'left' | 'center';
}

export function FeatureCard({
  iconName,
  title,
  description,
  content,
  items,
  accent = 'primary',
  align = 'center'
}: FeatureCardProps) {
  const accentColors = {
    primary: SejongColors.primary,
    secondary: SejongColors.secondary,
    gold: SejongColors.gold
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center'
  };

  return (
    <Card hover shadow="lg" className={alignmentClasses[align]}>
      {/* Icon */}
      <div className={`mb-6 ${align === 'center' ? 'flex justify-center' : ''}`}>
        <Icon name={iconName} size={64} color={accentColors[accent]} />
      </div>

      <h3
        className="text-2xl font-extrabold mb-3"
        style={{ color: accentColors[accent] }}
      >
        {title}
      </h3>

      {description && (
        <p className="text-gray-800 font-medium leading-relaxed mb-4">{description}</p>
      )}

      {content && <div className="mt-4">{content}</div>}

      {items && items.length > 0 && (
        <ul className="space-y-3 mt-4">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                className="mt-0.5 text-xl shrink-0 font-bold"
                style={{ color: accentColors[accent] }}
              >
                ✓
              </span>
              <span
                className="leading-relaxed text-left font-semibold"
                style={{ color: accentColors[accent] }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
