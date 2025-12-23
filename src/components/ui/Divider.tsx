import { SejongColors } from '@/styles/colors';

interface DividerProps {
  /**
   * Divider 스타일 변형
   * - solid: 단순 실선
   * - gradient: 그라데이션 효과
   * - dashed: 점선
   * - dotted: 점 스타일
   */
  variant?: 'solid' | 'gradient' | 'dashed' | 'dotted';

  /**
   * Divider 두께
   */
  thickness?: 'thin' | 'medium' | 'thick';

  /**
   * 상하 여백
   */
  spacing?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 텍스트 라벨 (선택)
   */
  label?: string;

  /**
   * 아이콘 (선택)
   */
  icon?: React.ReactNode;
}

const spacingMap = {
  sm: 'my-4',
  md: 'my-8',
  lg: 'my-12',
  xl: 'my-16',
};

const thicknessMap = {
  thin: 'h-px',
  medium: 'h-0.5',
  thick: 'h-1',
};

export function Divider({
  variant = 'solid',
  thickness = 'thin',
  spacing = 'md',
  label,
  icon,
}: DividerProps) {
  const spacingClass = spacingMap[spacing];
  const thicknessClass = thicknessMap[thickness];

  // 라벨이 있는 경우
  if (label || icon) {
    return (
      <div className={`relative flex items-center ${spacingClass}`}>
        <div className="grow border-t" style={{ borderColor: SejongColors.border.medium }} />
        <div className="shrink-0 px-4 flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          {label && (
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {label}
            </span>
          )}
        </div>
        <div className="grow border-t" style={{ borderColor: SejongColors.border.medium }} />
      </div>
    );
  }

  // Gradient variant
  if (variant === 'gradient') {
    return (
      <div className={spacingClass}>
        <div
          className={`w-full ${thicknessClass} rounded-full`}
          style={{
            background: `linear-gradient(to right, transparent, ${SejongColors.primary}, transparent)`,
          }}
        />
      </div>
    );
  }

  // Dashed variant
  if (variant === 'dashed') {
    return (
      <div className={spacingClass}>
        <div
          className={`w-full ${thicknessClass} border-t-2 border-dashed`}
          style={{ borderColor: SejongColors.border.medium }}
        />
      </div>
    );
  }

  // Dotted variant
  if (variant === 'dotted') {
    return (
      <div className={spacingClass}>
        <div
          className={`w-full ${thicknessClass} border-t-2 border-dotted`}
          style={{ borderColor: SejongColors.border.medium }}
        />
      </div>
    );
  }

  // Solid variant (default)
  return (
    <div className={spacingClass}>
      <div
        className={`w-full ${thicknessClass}`}
        style={{ backgroundColor: SejongColors.border.medium }}
      />
    </div>
  );
}
