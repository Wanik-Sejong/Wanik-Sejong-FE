'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import {
  Card,
  StatCard,
  FeatureCard,
  Hero,
  SectionHeader,
  CallToAction,
  ProcessFlow,
  Timeline,
  Button,
  DonutChart,
  BarChart,
  ProgressBar,
  Badge,
  StatusBadge,
  Tag
} from '@/components/ui';
import { SejongColors } from '@/styles/colors';

export default function ShowcasePage() {
  const handleStartClick = useCallback(() => {
  }, []);

  const handleLearnMoreClick = useCallback(() => {
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white">
      {/* Hero Section */}
      <Hero
        badge="완익세종"
        title="취향에 맞는 진로를"
        subtitle="어디에?"
        description="AI 기반으로 학생의 이수 과목과 희망 진로를 분석하여 맞춤형 학습 로드맵을 제공합니다. 개별화된 취향 분석을 통해 나만의 커리어 경로를 찾아보세요."
        illustration={
          <div className="relative w-96 h-96">
            <Image
              src="/images/logos/sejong-logo.png"
              alt="세종대학교"
              width={300}
              height={300}
              className="object-contain mx-auto"
            />
          </div>
        }
        actions={
          <>
            <Button variant="primary" size="lg">
              로드맵 생성하기 🚀
            </Button>
            <Button variant="outline" size="lg">
              사용 가이드
            </Button>
          </>
        }
      />

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          badge="Research"
          title="개별화된 취향과 증사업군"
          subtitle="같은 취향의 사람과 교류하자!"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <StatCard
            title="플랫폼 이용 의사"
            value="87.3%"
            description="설문 응답자 중 87.3%가 진로 분석 플랫폼 이용 의사 보유"
            iconName="map"
            trend="up"
            trendValue="12.3%"
          />

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-bold mb-6 text-center" style={{ color: SejongColors.primary }}>
              같은 취향의 사람과 교류
            </h3>
            <DonutChart
              value={67}
              max={100}
              size={200}
              label="공감도"
              showPercentage
            />
          </div>

          <StatCard
            title="취향 플랫폼스 광용하는 것에"
            value="60.7%"
            description="플랫폼을 통한 체계적인 진로 설계 선호"
            iconName="target"
          />
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          badge="Problem"
          title="지도 서비스에서는"
          subtitle="취향을 담은 장소 찾기 어렵군"
        />

        <ProcessFlow
          steps={[
            {
              icon: '📍',
              title: '지도 검색 시점',
              description: '검색 키워드를 이용한 검색만 가능, 사용자 취향 기반 장소 검색 불가'
            },
            {
              icon: '📱',
              title: 'SNS 검색을 통한',
              description: '소셜 미디어에서 정보 검색 시 신뢰도 높은 정보 필터링에 시간 소요'
            },
            {
              icon: '🎯',
              title: '일일히 모으는',
              description: '정보 수집에 과도한 시간이 소요되어 효율적인 학습 경로 설계 어려움'
            }
          ]}
        />
      </section>

      {/* Solution Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          badge="Solutions"
          title="다양한 취향과 맞춤형 장소 정보."
          subtitle="편할하기에 불편하니까!"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            iconName="map"
            title="Various"
            description="내외부 타인 정보 없이 검증된 취향 정보를 기반으로 신뢰도 높은 맞춤 장소 추천"
            accent="primary"
          />

          <FeatureCard
            iconName="star"
            title="Reliable"
            description="검증 취향별 커뮤니티에서 신뢰도 높은 사용자의 리뷰 정보 제공"
            accent="secondary"
          />

          <FeatureCard
            iconName="rocket"
            title="Motivating"
            description="커뮤니티를 통한 사용자 간 정보 교류로 학습 의욕 증진 및 정보 활용도 제고"
            accent="gold"
          />
        </div>
      </section>

      {/* Progress Bars Example */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <Card shadow="xl" padding="lg">
          <h3 className="text-2xl font-bold mb-6" style={{ color: SejongColors.primary }}>
            역량 갭 분석
          </h3>

          <div className="space-y-6">
            <ProgressBar
              label="딥러닝"
              value={85}
              color={SejongColors.primary}
              size="lg"
            />
            <ProgressBar
              label="Python"
              value={92}
              color={SejongColors.gold}
              size="lg"
            />
            <ProgressBar
              label="자료구조"
              value={78}
              color={SejongColors.secondary}
              size="lg"
            />
            <ProgressBar
              label="알고리즘"
              value={65}
              color={SejongColors.primary}
              size="lg"
            />
          </div>
        </Card>
      </section>

      {/* Bar Chart Example */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <Card shadow="xl" padding="lg">
          <h3 className="text-2xl font-bold mb-6" style={{ color: SejongColors.primary }}>
            이수 과목 통계
          </h3>

          <BarChart
            height={250}
            data={[
              { label: '전공필수', value: 45, color: SejongColors.primary },
              { label: '전공선택', value: 32, color: SejongColors.gold },
              { label: '교양', value: 28, color: SejongColors.secondary }
            ]}
          />
        </Card>
      </section>

      {/* Timeline Example */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <SectionHeader
          title="학습 로드맵 타임라인"
          description="AI가 생성한 맞춤형 학습 경로"
        />

        <Timeline
          items={[
            {
              icon: '📚',
              title: '2025년 여름방학',
              subtitle: '기초 역량 강화',
              description: 'Coursera "Machine Learning Specialization" 수강 - ML 기초 다지기. 토이 프로젝트: 추천 시스템 구현으로 포트폴리오 구축',
              date: '7-8월',
              status: 'completed'
            },
            {
              icon: '🎓',
              title: '2025년 2학기',
              subtitle: '심화 과정',
              description: '기계학습 수강 - AI 엔지니어 필수 과목. AI 학회 가입으로 네트워킹 및 스터디 참여',
              date: '9-12월',
              status: 'active'
            },
            {
              icon: '💻',
              title: '2025년 겨울방학',
              subtitle: '실전 준비',
              description: '코딩테스트 대비 알고리즘 학습. 인턴십 지원 및 프로젝트 포트폴리오 완성',
              date: '1-2월',
              status: 'pending'
            }
          ]}
        />
      </section>

      {/* Badges Example */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <Card shadow="lg" padding="lg">
          <h3 className="text-2xl font-bold mb-6" style={{ color: SejongColors.primary }}>
            상태 뱃지
          </h3>

          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="gold">Gold</Badge>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="primary" dot>진행중</Badge>
            <Badge variant="success" dot>완료</Badge>
            <Badge variant="warning" dot>대기중</Badge>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatusBadge status="active" />
            <StatusBadge status="pending" />
            <StatusBadge status="completed" />
            <StatusBadge status="cancelled" />
          </div>
        </Card>
      </section>

      {/* Tags Example */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <Card shadow="lg" padding="lg">
          <h3 className="text-2xl font-bold mb-6" style={{ color: SejongColors.primary }}>
            관심 분야 태그
          </h3>

          <div className="flex flex-wrap gap-3">
            <Tag variant="primary">AI/ML</Tag>
            <Tag variant="secondary">백엔드 개발</Tag>
            <Tag variant="gold">데이터 분석</Tag>
            <Tag variant="primary" onRemove={() => {}}>
              Python
            </Tag>
            <Tag variant="secondary" onRemove={() => {}}>
              딥러닝
            </Tag>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <CallToAction
          title="지도 취향을 사람을 위해 공유하는 것 같습니다!?!"
          description="AI 기반 맞춤형 로드맵으로 당신의 진로를 설계하세요. 지금 바로 시작하실 수 있습니다."
          primaryAction={{
            label: '로드맵 생성하기',
            onClick: handleStartClick
          }}
          secondaryAction={{
            label: '더 알아보기',
            onClick: handleLearnMoreClick
          }}
          illustration={
            <div className="text-8xl">🚀</div>
          }
        />
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <Image
            src="/images/logos/sejong-logo.png"
            alt="세종대학교"
            width={100}
            height={100}
            className="mx-auto mb-6 brightness-0 invert opacity-80"
          />
          <h3 className="text-xl font-bold mb-2">완익세종</h3>
          <p className="text-gray-400 mb-6">
            AI 기반 진로-교과목 로드맵 추천 서비스
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Sejong University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
