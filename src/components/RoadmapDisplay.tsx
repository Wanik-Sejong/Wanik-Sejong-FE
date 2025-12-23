'use client';

import { useMemo, useCallback } from 'react';
import { Card, StatCard, FeatureCard } from './ui/Card';
import { Hero, SectionHeader } from './ui/Hero';
import {
  AnimatedTimelineSection,
  AnimatedRoadmapIllustration,
  CourseCard,
  TechStackCard,
  ActivityCard,
} from './roadmap';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Divider } from './ui/Divider';
import { BarChart } from './ui/Chart';
import { SejongColors } from '@/styles/colors';
import { convertLearningPathToPhases } from '@/lib/roadmap-utils';
import { convertRoadmapToMarkdown } from '@/lib/roadmap-markdown';
import { downloadMarkdownFile, sanitizeFilename, generateTimestampedFilename } from '@/lib/file-download';
import { Icon } from './ui/Icon';
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

  // 전체 학습 경로를 그대로 사용 (필터링 제거)

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

    // Count tech stacks
    let totalTechStacks = 0;
    learningPath.forEach(phase => {
      if (phase.techStacks) {
        totalTechStacks += phase.techStacks.length;
      }
    });

    return {
      totalCourses,
      totalPhases,
      priorityCount,
      totalTechStacks,
    };
  }, [learningPath]);

  // Convert learning path to timeline roadmap format
  const timelinePhases = useMemo(
    () => convertLearningPathToPhases(learningPath),
    [learningPath]
  );

  // Deduplicate recommended subjects by courseCode
  const uniqueRecommendedSubjects = useMemo(() => {
    if (!roadmap.recommendedSubjects) return [];

    const seen = new Set<string>();
    const duplicates: string[] = [];

    const uniqueSubjects = roadmap.recommendedSubjects.filter((subject) => {
      if (seen.has(subject.courseCode)) {
        duplicates.push(`${subject.courseName} (${subject.courseCode})`);
        return false;
      }
      seen.add(subject.courseCode);
      return true;
    });

    if (duplicates.length > 0) {
      console.warn(
        `⚠️ [RoadmapDisplay] 중복 과목 제거됨 (${duplicates.length}개):`,
        duplicates
      );
    }

    return uniqueSubjects;
  }, [roadmap.recommendedSubjects]);

  // Markdown 다운로드 핸들러
  const handleDownloadMarkdown = useCallback(() => {
    try {
      // 1. Markdown 변환
      const markdownContent = convertRoadmapToMarkdown(roadmap);

      // 2. 파일명 생성
      // 진로 요약에서 첫 단어 추출 (예: "프론트엔드 개발자" → "프론트엔드")
      const careerKeyword = roadmap.careerSummary
        .split(' ')[0]
        .replace(/[^가-힣a-zA-Z0-9]/g, '');

      const sanitizedKeyword = sanitizeFilename(careerKeyword) || '로드맵';
      const filename = generateTimestampedFilename(`로드맵_${sanitizedKeyword}`, '.md');

      // 3. 다운로드
      downloadMarkdownFile(markdownContent, filename);

    } catch (error) {
      console.error('❌ Failed to download roadmap:', error);
      alert('로드맵 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [roadmap]);

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
            <Button variant="primary" size="lg" onClick={handleDownloadMarkdown}>
              <span className="flex items-center gap-2">
                <Icon name="file-pdf" size={20} />
                Markdown으로 저장
              </span>
            </Button>
            {onReset && (
              <Button variant="outline" size="lg" onClick={onReset}>
                <span className="flex items-center gap-2">
                  <Icon name="refresh" size={20} />
                  새 로드맵 생성
                </span>
              </Button>
            )}
          </>
        }
      />

      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* ========== PART 1: 분석 및 진단 ========== */}
        <div className="space-y-12">
          {/* Journey Overview Section */}
          <section>
            <SectionHeader
              badge="Journey Overview"
              title="학습 여정 한눈에"
              description="전체 로드맵의 핵심 통계를 확인하세요"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="총 추천 과목"
                value={stats.totalCourses}
                description="단계별 필수 및 권장 과목"
                iconName="books"
                gradient={true}
                gradientFrom={SejongColors.primary}
                gradientTo={SejongColors.secondary}
                hoverEffect="glow"
              />

              <StatCard
                title="학습 단계"
                value={stats.totalPhases}
                description="체계적인 단계별 학습 경로"
                iconName="map"
                hoverEffect="scale"
              />

              <StatCard
                title="추천 기술스택"
                value={stats.totalTechStacks}
                description="현업에서 요구하는 핵심 기술"
                iconName="laptop"
                hoverEffect="lift"
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
                iconName="strong"
                title="현재 강점"
                description={`${currentSkills.strengths.length}개의 강점 영역을 보유하고 있습니다`}
                items={currentSkills.strengths}
                accent="primary"
                align="left"
              />

              {/* Gaps */}
              <FeatureCard
                iconName="weakness"
                title="보완 필요 영역"
                description={`${currentSkills.gaps.length}개의 발전 가능 영역이 있습니다`}
                items={currentSkills.gaps}
                accent="gold"
                align="left"
              />
            </div>
          </section>
        </div>

        <Divider variant="gradient" spacing="xl" label="학습 로드맵" />

        {/* ========== PART 2: 학습 로드맵 ========== */}
        <div className="space-y-12">
          {/* Learning Path Timeline */}
          <section>
            <SectionHeader
              badge="Learning Roadmap"
              title="추천 학습 경로"
              description="단계별로 따라가며 목표 진로를 향해 나아가세요"
              align="center"
            />

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
                학습 경로 정보가 없습니다.
              </p>
            </div>
          )}
          </section>

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
                        <Icon name="laptop" size={20} color={SejongColors.primary} />
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
                        <Icon name="target" size={20} color={SejongColors.primary} />
                        <span style={{ color: SejongColors.primary }}>추천 활동</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phase.activities.map((activity, activityIndex) => (
                          <ActivityCard
                            key={activityIndex}
                            activity={activity}
                            index={activityIndex}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <Divider variant="gradient" spacing="xl" label="AI 추천 및 조언" />

        {/* ========== PART 3: AI 추천 및 조언 ========== */}
        <div className="space-y-12">
          {/* AI Recommended Subjects */}
          {uniqueRecommendedSubjects.length > 0 && (
            <section>
              <SectionHeader
                badge="AI Recommendations"
                title="AI 추천 과목 목록"
                description={`당신의 진로 목표에 적합한 ${uniqueRecommendedSubjects.length}개 과목을 추천합니다`}
                align="center"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniqueRecommendedSubjects.map((subject, index) => (
                  <Card key={`${subject.courseCode}-${index}`} shadow="md" padding="md" className="hover:shadow-lg transition-shadow">
                    {/* 과목명 (최우선 표시) */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-extrabold text-lg md:text-xl leading-snug flex-1 pr-2"
                          style={{ color: SejongColors.primary }}>
                        {subject.courseName}
                      </h3>
                      <Badge variant="secondary" size="sm">
                        {index + 1}위
                      </Badge>
                    </div>

                    {/* 학년 + 과목타입 */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="font-medium">{subject.gradeLevel}학년 권장</span>
                      <span className="text-gray-400">•</span>
                      <span>{subject.courseType}</span>
                    </div>

                    {/* 기타 정보 (학수번호, 학점, 강의언어) */}
                    <div className="space-y-1 mb-3">
                      <p className="text-sm text-gray-600">
                        학수번호: {subject.courseCode}
                      </p>
                      {subject.credits && (
                        <p className="text-sm text-gray-600">
                          학점: {subject.credits}
                        </p>
                      )}
                      {subject.lectureLanguage && (
                        <p className="text-xs text-gray-500">
                          강의언어: {subject.lectureLanguage}
                        </p>
                      )}
                    </div>

                    {/* 추천 이유 */}
                    {subject.reasons && subject.reasons.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 font-medium">추천 이유:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {subject.reasons.slice(0, 2).map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Additional Advice */}
          {advice && (
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
          )}
        </div>

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
