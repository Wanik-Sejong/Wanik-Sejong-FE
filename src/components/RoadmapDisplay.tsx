'use client';

import { useMemo } from 'react';
import { Card } from './ui/Card';
import { Timeline } from './ui/ProcessFlow';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Divider } from './ui/Divider';
import { DonutChart, BarChart, ProgressBar } from './ui/Chart';
import { SejongColors } from '@/styles/colors';
import type { Roadmap } from '@/lib/types';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  onReset?: () => void;
}

const PRIORITY_VARIANTS = {
  high: 'primary' as const,
  medium: 'gold' as const,
  low: 'secondary' as const,
};

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

  // Calculate statistics for visualization
  const stats = useMemo(() => {
    const totalCourses = learningPath.reduce((sum, phase) => sum + phase.courses.length, 0);
    const totalPhases = learningPath.length;

    // Count courses by priority
    const priorityCount = { high: 0, medium: 0, low: 0 };
    learningPath.forEach(phase => {
      phase.courses.forEach(course => {
        if (course.priority) {
          priorityCount[course.priority]++;
        }
      });
    });

    // Calculate tech stack difficulty average
    let totalTechStacks = 0;
    let totalDifficulty = 0;
    learningPath.forEach(phase => {
      if (phase.techStacks) {
        phase.techStacks.forEach(tech => {
          totalTechStacks++;
          if (tech.difficulty) {
            totalDifficulty += tech.difficulty;
          }
        });
      }
    });
    const avgDifficulty = totalTechStacks > 0 ? totalDifficulty / totalTechStacks : 0;

    return {
      totalCourses,
      totalPhases,
      priorityCount,
      totalTechStacks,
      avgDifficulty,
    };
  }, [learningPath]);

  // Convert learning path to timeline format - memoized to prevent recalculation on every render
  const timelineItems = useMemo(
    () =>
      learningPath.map((phase, index) => ({
        icon: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'][index % 4],
        title: phase.period,
        subtitle: phase.goal,
        description: (
          <div className="space-y-4">
            {/* 추천 과목 섹션 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                📚 추천 과목 ({phase.courses.length}개)
              </h4>
              <ul className="space-y-2 text-sm">
                {phase.courses.map((course, idx) => (
                  <li key={idx} className="text-gray-700">
                    • {course.name} ({course.type})
                    {course.priority && ` - ${PRIORITY_LABELS[course.priority]}`}
                  </li>
                ))}
              </ul>
            </div>

            {/* 추천 기술스택 섹션 (있는 경우) */}
            {phase.techStacks && phase.techStacks.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  💻 추천 기술스택 ({phase.techStacks.length}개)
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {phase.techStacks.map((tech, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{tech.name}</span>
                        <Badge variant={PRIORITY_VARIANTS[tech.priority]}>
                          {PRIORITY_LABELS[tech.priority]}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{tech.reason}</p>

                      {/* Difficulty Visualization */}
                      {tech.difficulty && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">학습 난이도</span>
                            <span className="text-xs text-gray-600">{'⭐'.repeat(tech.difficulty)}</span>
                          </div>
                          <ProgressBar
                            value={tech.difficulty}
                            max={5}
                            color={
                              tech.difficulty <= 2
                                ? SejongColors.primary
                                : tech.difficulty <= 3
                                ? SejongColors.gold
                                : '#f59e0b'
                            }
                            size="sm"
                            showPercentage={false}
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-200 px-2 py-0.5 rounded">{tech.category}</span>
                      </div>
                      {tech.resources && tech.resources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tech.resources.map((resource, ridx) => (
                            <a
                              key={ridx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              📖 {resource.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추가 활동 섹션 (있는 경우) */}
            {phase.activities && phase.activities.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🎯 추가 활동</h4>
                <ul className="space-y-1 text-sm">
                  {phase.activities.map((activity, idx) => (
                    <li key={idx} className="text-gray-700">
                      • {activity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 예상 학습량 */}
            {phase.effort && (
              <p className="text-sm font-medium text-gray-600">
                ⏱️ 예상 학습량: {phase.effort}
              </p>
            )}
          </div>
        ),
        date: phase.effort,
        status: (index === 0 ? 'active' : index < learningPath.length - 1 ? 'pending' : 'pending') as
          | 'active'
          | 'pending'
          | 'completed',
      })),
    [learningPath]
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: SejongColors.primary }}>
          나만의 학습 로드맵
        </h1>
        <p className="text-gray-600 text-lg">
          AI가 분석한 맞춤형 커리어 로드맵입니다
        </p>
        <p className="text-sm text-gray-500 mt-2">
          생성 일시: {new Date(generatedAt).toLocaleString('ko-KR')}
        </p>
      </div>

      <Divider variant="gradient" spacing="lg" />

      {/* Overview Dashboard */}
      <section>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: SejongColors.primary }}>
            📊 로드맵 한눈에 보기
          </h2>
          <p className="text-gray-600 text-sm">전체 학습 경로의 주요 통계입니다</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Courses */}
          <Card shadow="lg" padding="lg" className="text-center">
            <div className="flex flex-col items-center">
              <DonutChart
                value={stats.totalCourses}
                max={stats.totalCourses}
                size={140}
                strokeWidth={16}
                showPercentage={false}
              />
              <h3 className="text-3xl font-bold mt-4" style={{ color: SejongColors.primary }}>
                {stats.totalCourses}개
              </h3>
              <p className="text-sm text-gray-600 mt-1">총 추천 과목</p>
            </div>
          </Card>

          {/* Learning Phases */}
          <Card shadow="lg" padding="lg" className="text-center">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-3xl font-bold" style={{ color: SejongColors.primary }}>
                {stats.totalPhases}단계
              </h3>
              <p className="text-sm text-gray-600 mt-1">학습 경로</p>
            </div>
          </Card>

          {/* Tech Stacks */}
          <Card shadow="lg" padding="lg" className="text-center">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-3xl font-bold" style={{ color: SejongColors.primary }}>
                {stats.totalTechStacks}개
              </h3>
              <p className="text-sm text-gray-600 mt-1">추천 기술스택</p>
            </div>
          </Card>

          {/* Average Difficulty */}
          <Card shadow="lg" padding="lg" className="text-center">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-4">
                <ProgressBar
                  value={stats.avgDifficulty}
                  max={5}
                  color={SejongColors.gold}
                  size="lg"
                  showPercentage={false}
                />
              </div>
              <h3 className="text-3xl font-bold" style={{ color: SejongColors.gold }}>
                {'⭐'.repeat(Math.round(stats.avgDifficulty))}
              </h3>
              <p className="text-sm text-gray-600 mt-1">평균 난이도</p>
            </div>
          </Card>
        </div>

        {/* Priority Distribution */}
        <Card shadow="lg" padding="lg">
          <h3 className="text-lg font-bold mb-4" style={{ color: SejongColors.primary }}>
            📌 우선순위별 과목 분포
          </h3>
          <BarChart
            data={[
              {
                label: '높음 (필수)',
                value: stats.priorityCount.high,
                color: PRIORITY_COLORS.high
              },
              {
                label: '중간 (권장)',
                value: stats.priorityCount.medium,
                color: PRIORITY_COLORS.medium
              },
              {
                label: '낮음 (선택)',
                value: stats.priorityCount.low,
                color: PRIORITY_COLORS.low
              },
            ]}
            showValues={true}
          />
        </Card>
      </section>

      <Divider variant="gradient" spacing="xl" />

      {/* Career Summary */}
      <section>
        <Card shadow="xl" padding="lg">
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: SejongColors.primary }}>
              📊 진로 요약
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">{careerSummary}</p>
          </div>
        </Card>
      </section>

      {/* Current Skills Analysis */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card shadow="lg" padding="lg" className="border-l-4" style={{ borderLeftColor: SejongColors.primary }}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: SejongColors.primary }}>
            <span>💪</span>
            현재 강점
          </h3>

          {/* Visual Chart */}
          <div className="mb-6 p-4 bg-linear-to-br from-green-50 to-white rounded-lg">
            <BarChart
              data={currentSkills.strengths.slice(0, 5).map((_strength, index) => ({
                label: `강점 ${index + 1}`,
                value: 100 - (index * 15), // Visual representation
                color: SejongColors.primary
              }))}
              height={150}
              showValues={false}
            />
          </div>

          <ul className="space-y-3">
            {currentSkills.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700 flex items-start gap-2">
                <span className="text-green-500 mt-1 text-lg">✓</span>
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Gaps */}
        <Card shadow="lg" padding="lg" className="border-l-4" style={{ borderLeftColor: SejongColors.gold }}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: SejongColors.gold }}>
            <span>🎯</span>
            보완 필요 영역
          </h3>

          {/* Visual Chart */}
          <div className="mb-6 p-4 bg-linear-to-br from-amber-50 to-white rounded-lg">
            <BarChart
              data={currentSkills.gaps.slice(0, 5).map((_gap, index) => ({
                label: `보완 ${index + 1}`,
                value: 100 - (index * 15), // Visual representation
                color: SejongColors.gold
              }))}
              height={150}
              showValues={false}
            />
          </div>

          <ul className="space-y-3">
            {currentSkills.gaps.map((gap, index) => (
              <li key={index} className="text-gray-700 flex items-start gap-2">
                <span className="text-amber-500 mt-1 text-lg">→</span>
                <span className="leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Divider variant="gradient" spacing="xl" />

      {/* Learning Path Timeline */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2" style={{ color: SejongColors.primary }}>
            <span>🗺️</span>
            추천 학습 경로
          </h2>
          <p className="text-gray-600">
            단계별로 따라가며 목표 진로를 향해 나아가세요
          </p>
        </div>

        <Timeline items={timelineItems} />
      </section>

      <Divider variant="gradient" spacing="xl" />

      {/* Detailed Course Recommendations */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2" style={{ color: SejongColors.primary }}>
            <span>📚</span>
            상세 과목 정보
          </h2>
          <p className="text-gray-600 text-sm">
            각 학기별 추천 과목과 우선순위를 확인하세요
          </p>
        </div>

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
                    className="p-4 bg-gray-50 rounded-lg border-l-4 hover:bg-gray-100 transition-colors"
                    style={{
                      borderLeftColor: course.priority
                        ? PRIORITY_COLORS[course.priority]
                        : SejongColors.secondary,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{course.name}</h4>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
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
      </section>

      {/* Additional Advice */}
      {advice && (
        <>
          <Divider variant="gradient" spacing="xl" />
          <section>
            <Card shadow="xl" padding="lg" className="bg-linear-to-br from-primary-50 to-white">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: SejongColors.primary }}>
                  <span>💡</span>
                  추가 조언
                </h3>
                <p className="text-gray-700 leading-relaxed">{advice}</p>
              </div>
            </Card>
          </section>
        </>
      )}

      <Divider variant="gradient" spacing="xl" />

      {/* Action Buttons */}
      <section className="flex justify-center gap-4">
        <Button variant="outline" size="lg" onClick={() => window.print()}>
          📄 PDF로 저장
        </Button>
        {onReset && (
          <Button variant="primary" size="lg" onClick={onReset}>
            🔄 새 로드맵 생성
          </Button>
        )}
      </section>

      {/* Footer Note */}
      <footer className="text-center text-sm text-gray-500 pb-8">
        <p className="leading-relaxed">
          💡 이 로드맵은 AI가 생성한 추천사항입니다.<br />
          실제 수강 계획은 담당 교수님 및 학과 사무실과 상담하여 결정하세요.
        </p>
      </footer>
    </div>
  );
}
