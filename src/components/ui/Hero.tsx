import { ReactNode } from 'react';
import Image from 'next/image';
import { SejongColors } from '@/styles/colors';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  illustration?: ReactNode;
  imageSrc?: string;
  actions?: ReactNode;
  badge?: string;
}

export function Hero({
  title,
  subtitle,
  description,
  illustration,
  imageSrc,
  actions,
  badge
}: HeroProps) {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${SejongColors.primary} 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${SejongColors.gold} 0%, transparent 50%)`
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            {badge && (
              <div className="inline-block">
                <span
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: SejongColors.primary50,
                    color: SejongColors.primary
                  }}
                >
                  {badge}
                </span>
              </div>
            )}

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              <span
                className="block"
                style={{ color: SejongColors.primary }}
              >
                {title}
              </span>
              {subtitle && (
                <span className="block text-gray-800 mt-2">
                  {subtitle}
                </span>
              )}
            </h1>

            {description && (
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                {description}
              </p>
            )}

            {actions && (
              <div className="flex flex-wrap gap-4 pt-4">
                {actions}
              </div>
            )}
          </div>

          {/* Illustration/Image */}
          <div className="relative">
            {illustration && (
              <div className="flex justify-center">
                {illustration}
              </div>
            )}

            {imageSrc && (
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  description,
  align = 'center'
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  return (
    <div className={`max-w-3xl ${alignmentClasses[align]} mb-12`}>
      {badge && (
        <div className={`mb-4 ${align === 'center' ? 'flex justify-center' : ''}`}>
          <span
            className="px-4 py-2 rounded-full text-sm font-medium inline-block"
            style={{
              backgroundColor: SejongColors.primary50,
              color: SejongColors.primary
            }}
          >
            {badge}
          </span>
        </div>
      )}

      <h2
        className="text-3xl lg:text-4xl font-bold mb-4"
        style={{ color: SejongColors.primary }}
      >
        {title}
      </h2>

      {subtitle && (
        <h3 className="text-xl font-medium text-gray-800 mb-3">
          {subtitle}
        </h3>
      )}

      {description && (
        <p className="text-lg text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

interface CallToActionProps {
  title: string;
  description?: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: ReactNode;
}

export function CallToAction({
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration
}: CallToActionProps) {
  return (
    <section
      className="relative py-16 px-4 rounded-3xl overflow-hidden"
      style={{ backgroundColor: SejongColors.primary }}
    >
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl bg-white" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-white" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {title}
            </h2>

            {description && (
              <p className="text-lg text-white/90 leading-relaxed">
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={primaryAction.onClick}
                className="px-8 py-3 bg-white rounded-lg font-medium text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {primaryAction.label}
              </button>

              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="px-8 py-3 border-2 border-white rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          </div>

          {illustration && (
            <div className="flex justify-center">
              {illustration}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
