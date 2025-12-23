import { ReactNode } from 'react';
import { SejongColors } from '@/styles/colors';

interface Step {
  icon: ReactNode;
  title: string;
  description: string;
}

interface ProcessFlowProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  showConnector?: boolean;
}

export function ProcessFlow({
  steps,
  orientation = 'horizontal',
  showConnector = true
}: ProcessFlowProps) {
  if (orientation === 'vertical') {
    return (
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector Line */}
            {showConnector && index < steps.length - 1 && (
              <div
                className="absolute left-10 top-24 w-0.5 h-full"
                style={{ backgroundColor: SejongColors.primary200 }}
              />
            )}

            <div className="flex gap-6 items-start relative z-10">
              {/* Icon Circle */}
              <div
                className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg"
                style={{
                  backgroundColor: SejongColors.primary50,
                  border: `3px solid ${SejongColors.primary}`
                }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: SejongColors.primary }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
      {/* Connector Line (Desktop) */}
      {showConnector && (
        <div
          className="hidden md:block absolute top-10 left-0 right-0 h-0.5"
          style={{
            backgroundColor: SejongColors.primary200,
            marginLeft: '15%',
            marginRight: '15%',
            zIndex: 0
          }}
        />
      )}

      {steps.map((step, index) => (
        <div key={index} className="relative z-10">
          {/* Step Number Badge */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
               style={{ backgroundColor: SejongColors.primary }}>
            {index + 1}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            {/* Icon */}
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: SejongColors.primary50 }}
            >
              {step.icon}
            </div>

            {/* Content */}
            <h3
              className="text-lg font-bold text-center mb-3"
              style={{ color: SejongColors.primary }}
            >
              {step.title}
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface TimelineItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  description: ReactNode;
  date?: string;
  status?: 'completed' | 'active' | 'pending';
}

interface TimelineProps {
  items: TimelineItemProps[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) => {
        const statusColors = {
          completed: SejongColors.primary,
          active: SejongColors.gold,
          pending: SejongColors.border.medium
        };

        const bgColors = {
          completed: SejongColors.primary50,
          active: SejongColors.gold50,
          pending: SejongColors.border.light
        };

        const status = item.status || 'pending';

        return (
          <div key={index} className="relative flex gap-6">
            {/* Connector Line */}
            {index < items.length - 1 && (
              <div
                className="absolute left-10 top-24 w-0.5 h-full"
                style={{ backgroundColor: SejongColors.border.medium }}
              />
            )}

            {/* Icon Circle */}
            <div
              className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-md relative z-10"
              style={{
                backgroundColor: bgColors[status],
                border: `3px solid ${statusColors[status]}`
              }}
            >
              {item.icon}
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: statusColors[status] }}
                  >
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-gray-600 text-sm mt-1">{item.subtitle}</p>
                  )}
                </div>

                {item.date && (
                  <span className="text-sm text-gray-500">{item.date}</span>
                )}
              </div>

              <div className="text-gray-700 leading-relaxed">
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
