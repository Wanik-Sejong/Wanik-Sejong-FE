import { NavigationDotsProps } from '@/types/roadmap.types';

export function NavigationDots({
  totalDots,
  activeIndex,
  colors,
  onDotClick,
}: NavigationDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: totalDots }).map((_, index) => {
        const isActive = index === activeIndex;
        const dotColor = colors[index] || '#ffffff';

        return (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className="transition-all duration-300 ease-out"
            style={{
              width: isActive ? '32px' : '8px',
              height: '8px',
              borderRadius: '9999px',
              backgroundColor: isActive ? dotColor : 'rgba(255, 255, 255, 0.3)',
              boxShadow: isActive ? `0 0 12px ${dotColor}60` : 'none',
            }}
            aria-label={`Go to step ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
