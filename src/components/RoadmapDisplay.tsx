'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, StatCard } from './ui/Card';
import { Timeline } from './ui/ProcessFlow';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { SejongColors } from '@/styles/colors';
import type { Roadmap } from '@/lib/types';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  onReset?: () => void;
}

const PRIORITY_COLORS = {
  high: SejongColors.primary,
  medium: SejongColors.gold,
  low: SejongColors.secondary,
};

const PRIORITY_LABELS = {
  high: '높음',
  medium: '중간',
  low: '낮음',
};

export function RoadmapDisplay({ roadmap, onReset }: RoadmapDisplayProps) {
  const { careerSummary, currentSkills, learningPath, advice, generatedAt } = roadmap;

  // Convert learning path to timeline format - memoized to prevent recalculation on every render
  const timelineItems = useMemo(
    () =>
      learningPath.map((phase, index) => ({
        icon: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'][index % 4],
        title: phase.period,
        subtitle: phase.goal,
        description: `
**추천 과목 (${phase.courses.length}개)**
${phase.courses
  .map(
    (course) =>
      `• ${course.name} (${course.type})${course.priority ? ' - ' + PRIORITY_LABELS[course.priority] : ''}`
  )
  .join('\n')}

${
  phase.activities && phase.activities.length > 0
    ? `\n**추가 활동**\n${phase.activities.map((act) => `• ${act}`).join('\n')}`
    : ''
}

${phase.effort ? `**예상 학습량**: ${phase.effort}` : ''}
        `.trim(),
        date: phase.effort,
        status: (index === 0 ? 'active' : index < learningPath.length - 1 ? 'pending' : 'pending') as
          | 'active'
          | 'pending'
          | 'completed',
      })),
    [learningPath]
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: SejongColors.primary }}>
          나만의 학습 로드맵
        </h1>
        <p className="text-gray-600">
          AI가 분석한 맞춤형 커리어 로드맵입니다
        </p>
        <p className="text-sm text-gray-500 mt-2">
          생성 일시: {new Date(generatedAt).toLocaleString('ko-KR')}
        </p>
      </div>

      {/* Career Summary */}
      <Card shadow="xl" padding="lg">
        <div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: SejongColors.primary }}>
            진로 요약
          </h2>
          <p className="text-gray-700 leading-relaxed">{careerSummary}</p>
        </div>
      </Card>

      {/* Current Skills Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card shadow="lg" padding="lg" className="border-l-4" style={{ borderLeftColor: SejongColors.primary }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: SejongColors.primary }}>
            현재 강점
          </h3>
          <ul className="space-y-2">
            {currentSkills.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700">
                {strength}
              </li>
            ))}
          </ul>
        </Card>

        {/* Gaps */}
        <Card shadow="lg" padding="lg" className="border-l-4" style={{ borderLeftColor: SejongColors.gold }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: SejongColors.gold }}>
            보완 필요 영역
          </h3>
          <ul className="space-y-2">
            {currentSkills.gaps.map((gap, index) => (
              <li key={index} className="text-gray-700">
                {gap}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Learning Path Timeline */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3" style={{ color: SejongColors.primary }}>
            추천 학습 경로
          </h2>
          <p className="text-gray-600">
            단계별로 따라가며 목표 진로를 향해 나아가세요
          </p>
        </div>

        <Timeline items={timelineItems} />
      </div>

      {/* Detailed Course Recommendations */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: SejongColors.primary }}>
          상세 과목 정보
        </h2>

        <div className="space-y-6">
          {learningPath.map((phase, phaseIndex) => (
            <Card key={phaseIndex} shadow="lg" padding="lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold" style={{ color: SejongColors.primary }}>
                    {phase.period}
                  </h3>
                  <Badge variant="primary">{phase.courses.length}개 과목</Badge>
                </div>
                <p className="text-gray-600">{phase.goal}</p>
              </div>

              <div className="space-y-4">
                {phase.courses.map((course, courseIndex) => (
                  <div
                    key={courseIndex}
                    className="p-4 bg-gray-50 rounded-lg border-l-4"
                    style={{
                      borderLeftColor: course.priority
                        ? PRIORITY_COLORS[course.priority]
                        : SejongColors.secondary,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{course.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" size="sm">
                          {course.type}
                        </Badge>
                        {course.priority && (
                          <Badge
                            variant={
                              course.priority === 'high'
                                ? 'primary'
                                : course.priority === 'medium'
                                  ? 'gold'
                                  : 'secondary'
                            }
                            size="sm"
                          >
                            {PRIORITY_LABELS[course.priority]}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{course.reason}</p>
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <p className="text-xs text-gray-500">
                        선수과목: {course.prerequisites.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Advice */}
      {advice && (
        <Card shadow="xl" padding="lg" className="bg-linear-to-br from-primary-50 to-white">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: SejongColors.primary }}>
              추가 조언
            </h3>
            <div className="prose prose-gray max-w-none prose-p:text-gray-800 prose-li:text-gray-800 prose-strong:text-gray-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{advice}</ReactMarkdown>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-8">
        <Button variant="outline" size="lg" onClick={() => window.print()}>
          PDF로 저장
        </Button>
        {onReset && (
          <Button variant="primary" size="lg" onClick={onReset}>
            새 로드맵 생성
          </Button>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 pb-8">
        <p>
          이 로드맵은 AI가 생성한 추천사항입니다. 실제 수강 계획은 담당 교수님 및 학과
          사무실과 상담하여 결정하세요.
        </p>
      </div>
    </div>
  );
}
