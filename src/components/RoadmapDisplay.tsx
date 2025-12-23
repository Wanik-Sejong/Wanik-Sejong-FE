'use client';

import { useMemo, useState } from 'react';
import { Card, StatCard, FeatureCard } from './ui/Card';
import { Hero, SectionHeader } from './ui/Hero';
import {
  RoadmapTabs,
  AnimatedTimelineSection,
  AnimatedRoadmapIllustration,
  CourseCard,
  TechStackCard,
  type TabType
} from './roadmap';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Divider } from './ui/Divider';
import { BarChart } from './ui/Chart';
import { SejongColors } from '@/styles/colors';
import { convertLearningPathToPhases } from '@/lib/roadmap-utils';
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

export function RoadmapDisplay({ roadmap, onReset }: RoadmapDisplayProps) {
  const { careerSummary, currentSkills, learningPath, advice, generatedAt } = roadmap;

  // 교내/교외 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>('oncampus');

  // 교내/교외 필터링된 학습 경로
  const filteredLearningPath = useMemo(() => {
    return learningPath.filter((phase) => {
      // 과목의 type을 기준으로 필터링
      const courseTypes = phase.courses.map(c => c.type.toLowerCase());

      if (activeTab === 'oncampus') {
        // 교내: 전공, 교양, 일반선택 등 정규 과목
        return courseTypes.some(
          type => !type.includes('외부') && !type.includes('부트캠프') && !type.includes('인턴')
        );
      } else {
        // 교외: 외부강의, 부트캠프, 인턴십, 대외활동 등
        return courseTypes.some(
          type => type.includes('외부') || type.includes('부트캠프') || type.includes('인턴')
        );
      }
    });
  }, [learningPath, activeTab]);

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

  // Convert filtered learning path to timeline roadmap format
  const timelinePhases = useMemo(
    () => convertLearningPathToPhases(filteredLearningPath),
    [filteredLearningPath]
  );

  return (
    <div className="w-full space-y-16">
      {/* Hero Section */}
      <Hero
        badge="완익세종 AI 로드맵"
        title="나만의 학습 로드맵"
        subtitle="AI가 분석한 맞춤형 커리어 경로"
        description="당신의 강점과 목표를 바탕으로 설계된 개인 맞춤형 학습 경로입니다. 단계별로 따라가며 원하는 진로를 향해 나아가세요."
        illustration={<AnimatedRoadmapIllustration />}
        actions={
          <>
            <Button variant="primary" size="lg" onClick={() => window.print()}>
              📄 PDF로 저장
            </Button>
            {onReset && (
              <Button variant="outline" size="lg" onClick={onReset}>
                🔄 새 로드맵 생성
              </Button>
            )}
          </>
        }
      />

      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Journey Overview Section */}
        <section>
          <SectionHeader
            badge="Journey Overview"
            title="학습 여정 한눈에"
            description="전체 로드맵의 핵심 통계와 난이도 분포를 확인하세요"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="총 추천 과목"
              value={stats.totalCourses}
              description="단계별 필수 및 권장 과목"
              icon="📚"
              gradient={true}
              gradientFrom={SejongColors.primary}
              gradientTo={SejongColors.secondary}
              hoverEffect="glow"
            />

            <StatCard
              title="학습 단계"
              value={stats.totalPhases}
              description="체계적인 단계별 학습 경로"
              icon="🗺️"
              hoverEffect="scale"
            />

            <StatCard
              title="추천 기술스택"
              value={stats.totalTechStacks}
              description="현업에서 요구하는 핵심 기술"
              icon="💻"
              hoverEffect="lift"
            />

            <StatCard
              title="평균 난이도"
              value={`${stats.avgDifficulty.toFixed(1)}/5.0`}
              description="학습 경로 전체 난이도"
              icon="⭐"
              gradient={true}
              gradientFrom={SejongColors.gold}
              gradientTo="#FFA500"
              hoverEffect="glow"
            />
          </div>
        </section>

        {/* Priority Distribution */}
        <section>
          <SectionHeader
            badge="Priority Analysis"
            title="우선순위별 과목 분포"
            description="필수, 권장, 선택 과목의 균형을 확인하세요"
            align="center"
          />
          <Card shadow="lg" padding="lg">
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
          <SectionHeader
            badge="Career Analysis"
            title="진로 요약"
            description="AI가 분석한 당신의 커리어 방향과 목표"
            align="center"
          />
          <Card shadow="xl" padding="lg">
            <p className="text-gray-700 leading-relaxed text-base text-center">
              {careerSummary}
            </p>
          </Card>
        </section>

        <Divider variant="gradient" spacing="xl" />

        {/* Current Skills Analysis */}
        <section>
          <SectionHeader
            badge="Your Starting Point"
            title="현재 역량 분석"
            description="강점을 극대화하고 부족한 부분을 보완하세요"
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <FeatureCard
              icon="💪"
              title="현재 강점"
              description={`${currentSkills.strengths.length}개의 강점 영역을 보유하고 있습니다`}
              items={currentSkills.strengths}
              accent="primary"
              align="left"
            />

            {/* Gaps */}
            <FeatureCard
              icon="🎯"
              title="보완 필요 영역"
              description={`${currentSkills.gaps.length}개의 발전 가능 영역이 있습니다`}
              items={currentSkills.gaps}
              accent="gold"
              align="left"
            />
          </div>
        </section>

        <Divider variant="gradient" spacing="xl" />

        {/* Learning Path Timeline */}
        <section>
          <SectionHeader
            badge="Learning Roadmap"
            title="추천 학습 경로"
            description="단계별로 따라가며 목표 진로를 향해 나아가세요"
            align="center"
          />

          {/* 교내/교외 탭 */}
          <RoadmapTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 스크롤 애니메이션이 적용된 타임라인 */}
        {timelinePhases.length > 0 ? (
          <AnimatedTimelineSection
            phases={timelinePhases}
            enableDragScroll={true}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">
              {activeTab === 'oncampus'
                ? '교내 과목 정보가 없습니다.'
                : '교외 활동 정보가 없습니다.'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              다른 탭을 확인해보세요.
            </p>
          </div>
        )}
        </section>

        <Divider variant="gradient" spacing="xl" />

        {/* Detailed Course Recommendations */}
        <section>
          <SectionHeader
            badge="Course Deep Dive"
            title="상세 과목 정보"
            description="각 학기별 추천 과목과 우선순위를 확인하세요"
            align="center"
          />

          <div className="space-y-12">
            {learningPath.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="space-y-6">
                {/* Phase Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: SejongColors.primary }}>
                      {phase.period}
                    </h3>
                    <p className="text-gray-600">{phase.goal}</p>
                  </div>
                  <Badge variant="primary" size="lg">
                    {phase.courses.length}개 과목
                  </Badge>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {phase.courses.map((course, courseIndex) => (
                    <CourseCard key={courseIndex} course={course} index={courseIndex} />
                  ))}
                </div>

                {/* Tech Stacks Section */}
                {phase.techStacks && phase.techStacks.length > 0 && (
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>💻</span>
                      <span style={{ color: SejongColors.primary }}>추천 기술스택</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {phase.techStacks.map((tech, techIndex) => (
                        <TechStackCard key={techIndex} techStack={tech} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities Section */}
                {phase.activities && phase.activities.length > 0 && (
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>🎯</span>
                      <span style={{ color: SejongColors.primary }}>추천 활동</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phase.activities.map((activity, activityIndex) => (
                        <div
                          key={activityIndex}
                          className="p-4 rounded-lg bg-linear-to-br from-blue-50 to-white border border-blue-100"
                        >
                          <p className="text-sm text-gray-700 leading-relaxed">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Additional Advice */}
        {advice && (
          <>
            <Divider variant="gradient" spacing="xl" />
            <section>
              <SectionHeader
                badge="Personalized Advice"
                title="추가 조언"
                description="AI가 제공하는 맞춤형 학습 가이드"
                align="center"
              />
              <Card shadow="xl" padding="lg" className="bg-linear-to-br from-primary-50 to-white">
                <p className="text-gray-700 leading-relaxed text-center">{advice}</p>
              </Card>
            </section>
          </>
        )}

        {/* Footer Note */}
        <footer className="text-center text-sm text-gray-500 py-8">
          <p className="leading-relaxed">
            💡 이 로드맵은 AI가 생성한 추천사항입니다.<br />
            실제 수강 계획은 담당 교수님 및 학과 사무실과 상담하여 결정하세요.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            생성 일시: {new Date(generatedAt).toLocaleString('ko-KR')}
          </p>
        </footer>
      </div>
    </div>
  );
}
