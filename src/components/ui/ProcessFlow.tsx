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
    <div className="space-y-10">
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

        const gradientColors = {
          completed: 'from-red-50 to-white',
          active: 'from-amber-50 to-white',
          pending: 'from-gray-50 to-white'
        };

        const status = item.status || 'pending';

        return (
          <div key={index} className="relative flex gap-8">
            {/* Connector Line with Gradient */}
            {index < items.length - 1 && (
              <div
                className="absolute left-12 top-28 w-1 h-full rounded-full opacity-30"
                style={{
                  background: `linear-gradient(to bottom, ${statusColors[status]}, ${SejongColors.border.light})`
                }}
              />
            )}

            {/* Icon Circle with Enhanced Styling */}
            <div
              className="shrink-0 w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl relative z-10 transition-transform duration-300 hover:scale-110"
              style={{
                backgroundColor: bgColors[status],
                border: `4px solid ${statusColors[status]}`,
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 8px ${bgColors[status]}`
              }}
            >
              {item.icon}
            </div>

            {/* Content Card with Enhanced Styling */}
            <div
              className={`flex-1 bg-linear-to-br ${gradientColors[status]} rounded-2xl p-8 shadow-xl border-l-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
              style={{
                borderLeftColor: statusColors[status]
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: statusColors[status] }}
                  >
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-gray-700 text-base font-medium">{item.subtitle}</p>
                  )}
                </div>

                {item.date && (
                  <span
                    className="text-sm font-semibold px-3 py-1 rounded-full shrink-0 ml-4"
                    style={{
                      backgroundColor: bgColors[status],
                      color: statusColors[status]
                    }}
                  >
                    {item.date}
                  </span>
                )}
              </div>

              <div className="text-gray-800 leading-relaxed text-base">
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
