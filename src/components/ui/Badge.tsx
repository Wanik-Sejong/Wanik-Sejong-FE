import { ReactNode } from 'react';
import { SejongColors } from '@/styles/colors';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false
}: BadgeProps) {
  const variantStyles = {
    primary: {
      bg: SejongColors.primary50,
      text: SejongColors.primary,
      dot: SejongColors.primary
    },
    secondary: {
      bg: SejongColors.secondary50,
      text: SejongColors.secondary,
      dot: SejongColors.secondary
    },
    success: {
      bg: SejongColors.text.primary + '10',
      text: '#10B981',
      dot: '#10B981'
    },
    warning: {
      bg: '#FEF3C7',
      text: '#F59E0B',
      dot: '#F59E0B'
    },
    error: {
      bg: '#FEE2E2',
      text: '#EF4444',
      dot: '#EF4444'
    },
    gold: {
      bg: SejongColors.gold50,
      text: SejongColors.gold,
      dot: SejongColors.gold
    }
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium
        ${sizeStyles[size]}
      `}
      style={{
        backgroundColor: variantStyles[variant].bg,
        color: variantStyles[variant].text
      }}
    >
      {dot && (
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: variantStyles[variant].dot }}
        />
      )}
      {children}
    </span>
  );
}

interface TagProps {
  children: ReactNode;
  onRemove?: () => void;
  variant?: 'primary' | 'secondary' | 'gold';
}

export function Tag({ children, onRemove, variant = 'primary' }: TagProps) {
  const variantColors = {
    primary: {
      bg: SejongColors.primary50,
      text: SejongColors.primary,
      border: SejongColors.primary200
    },
    secondary: {
      bg: SejongColors.secondary50,
      text: SejongColors.secondary,
      border: SejongColors.secondary200
    },
    gold: {
      bg: SejongColors.gold50,
      text: SejongColors.gold,
      border: SejongColors.gold200
    }
  };

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium border"
      style={{
        backgroundColor: variantColors[variant].bg,
        color: variantColors[variant].text,
        borderColor: variantColors[variant].border
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Remove tag"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      label: '진행중',
      color: 'primary' as const,
      icon: '🔄'
    },
    pending: {
      label: '대기중',
      color: 'warning' as const,
      icon: '⏳'
    },
    completed: {
      label: '완료',
      color: 'success' as const,
      icon: '✅'
    },
    cancelled: {
      label: '취소됨',
      color: 'error' as const,
      icon: '❌'
    }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.color} dot>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
