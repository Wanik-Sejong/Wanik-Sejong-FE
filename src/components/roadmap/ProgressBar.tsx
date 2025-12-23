import { ProgressBarProps } from '@/types/roadmap.types';

export function ProgressBar({
  currentIndex,
  totalSteps,
  currentColor,
}: ProgressBarProps) {
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      {/* Progress Track */}
      <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
        {/* Progress Fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: currentColor,
            boxShadow: `0 0 12px ${currentColor}40`,
          }}
        />
      </div>

      {/* Progress Text */}
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs font-medium text-white/60">
          Step {currentIndex + 1} of {totalSteps}
        </span>
        <span className="text-xs font-semibold" style={{ color: currentColor }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
