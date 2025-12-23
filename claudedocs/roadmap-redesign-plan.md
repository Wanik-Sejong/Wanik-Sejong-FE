# 로드맵 UI/UX 전체 개편 설계

## 🎯 설계 개요

**프로젝트**: 완익세종 로드맵 페이지 전면 개편
**프로젝트 타입**: Next.js 16 (React 19, App Router)
**설계 범위**: 로드맵 페이지 전체 UI/UX 리뉴얼

**핵심 목표**:
1. ✅ **Showcase UI 디자인 언어 통일** - 일관된 사용자 경험 제공
2. ✅ **시각적 임팩트 강화** - 현대적이고 세련된 디자인
3. ✅ **사용성 개선** - 직관적인 네비게이션과 정보 구조
4. ✅ **인터랙션 강화** - 부드러운 애니메이션과 피드백
5. ✅ **모바일 최적화** - 반응형 디자인과 터치 친화적 UI

---

## 🔍 현황 분석

### Showcase UI의 핵심 디자인 패턴

**1. 컴포넌트 시스템**
- `Hero` - 대형 헤더 섹션 (일러스트 + 타이틀 + 액션)
- `SectionHeader` - 섹션 구분 헤더 (Badge + Title + Subtitle)
- `Card` - 기본 카드 컨테이너 (그림자, 패딩)
- `StatCard` - 통계 카드 (아이콘 + 수치 + 설명 + 트렌드)
- `FeatureCard` - 기능 카드 (아이콘 + 타이틀 + 설명 + Accent 컬러)
- `ProcessFlow` - 프로세스 플로우 (단계별 아이콘 + 설명)
- `Timeline` - 타임라인 (수직, 상태 표시)
- `CallToAction` - CTA 섹션 (큰 타이틀 + 버튼 + 일러스트)

**2. 디자인 스타일**
- **색상**: SejongColors (Primary Red, Gold, Secondary Gray)
- **타이포그래피**: 깔끔한 Sans-serif, 계층적 폰트 크기
- **간격**: 넓은 여백 (py-16, px-4, gap-8)
- **그리드**: 반응형 Grid (1열 → 2열 → 3열)
- **카드**: Rounded corners (rounded-2xl), Shadow (shadow-lg, shadow-xl)
- **배경**: Gradient (bg-linear-to-br from-white via-gray-50 to-white)

**3. 애니메이션**
- Framer Motion 활용
- Smooth transitions
- Hover effects
- Scroll animations (TimelineRoadmap)

### 현재 로드맵 페이지 문제점

**1. 정보 과부하**
- 모든 정보를 한 페이지에 나열 (스크롤이 너무 긺)
- 섹션 간 시각적 구분이 약함
- 중요 정보와 부가 정보의 위계가 불명확

**2. 시각적 임팩트 부족**
- Hero 섹션 부재
- 통계 섹션의 시각화가 단조로움
- 색상과 아이콘 활용이 제한적

**3. 인터랙션 부족**
- 정적인 정보 나열
- 탭 전환 외 인터랙션 요소 부족
- 사용자 참여를 유도하는 요소 미흡

**4. 모바일 최적화 미흡**
- 가로 스크롤 타임라인이 모바일에서 사용성 저하
- 통계 차트가 작은 화면에서 가독성 문제

---

## 🎨 디자인 컨셉

### 테마: "Journey to Success" (성공으로의 여정)

**핵심 메타포**: 로드맵을 단순한 과목 리스트가 아닌 "성장의 여정"으로 시각화

**디자인 철학**:
1. **Progress Visualization** - 진행 상황을 시각적으로 명확히
2. **Storytelling** - 학습 여정을 스토리텔링 방식으로 전달
3. **Motivation** - 성취감과 동기부여를 주는 UI
4. **Clarity** - 복잡한 정보를 명쾌하게 정리

---

## 🏗️ 새로운 페이지 구조

### 전체 레이아웃 (6개 메인 섹션)

```
┌────────────────────────────────────────────┐
│  1. Hero Section (영웅 헤더)               │
│     - 환영 메시지 + 생성 일시              │
│     - 일러스트 + 빠른 액션 버튼            │
│     - 높이: 70vh                          │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  2. Journey Overview (여정 개요)           │
│     - 4개 StatCard (Grid 2x2)             │
│     - 총 과목, 단계, 기술스택, 평균 난이도 │
│     - 각 카드에 아이콘 + 애니메이션        │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  3. Your Starting Point (현재 위치)        │
│     - 2개 FeatureCard (강점 / 보완 영역)  │
│     - 바 차트 + 체크리스트 스타일          │
│     - 시각적 대비 (Green vs Orange)        │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  4. Learning Roadmap (학습 경로)            │
│     - 교내/교외 탭 (기존)                  │
│     - 개선된 타임라인 (카드 스타일)        │
│     - 단계별 아코디언 + 확장 가능          │
│     - 스크롤 애니메이션 유지               │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  5. Course Deep Dive (과목 상세)           │
│     - 학기별 아코디언 카드                 │
│     - 과목 카드 (우선순위 + 이유)          │
│     - 기술스택 카드 (난이도 + 리소스)      │
│     - 활동 카드 (추가 활동)                │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  6. Next Steps CTA (다음 단계)             │
│     - CallToAction 컴포넌트                │
│     - PDF 다운로드 + 새 로드맵 생성        │
│     - 일러스트 + 동기부여 메시지           │
└────────────────────────────────────────────┘
```

---

## 📐 섹션별 상세 설계

### 1. Hero Section (영웅 헤더)

**목적**: 사용자를 환영하고 로드맵의 가치를 즉시 전달

**디자인 스펙**:
```tsx
<Hero
  badge="AI Generated Roadmap"
  title="나만의 학습 로드맵"
  subtitle="AI가 분석한 맞춤형 커리어 경로"
  description={`${사용자_진로목표}를 향한 ${총_단계}단계 여정이 준비되었습니다.
                생성 일시: ${generatedAt}`}
  illustration={
    <div className="relative w-full h-full">
      {/* 로드맵 일러스트 또는 애니메이션 SVG */}
      <AnimatedRoadmapIllustration />
    </div>
  }
  actions={
    <>
      <Button variant="primary" size="lg" icon="📥">
        PDF 다운로드
      </Button>
      <Button variant="outline" size="lg" icon="🔄">
        새 로드맵 생성
      </Button>
    </>
  }
/>
```

**개선 포인트**:
- ✅ 시각적 임팩트 극대화 (전체 화면 70vh)
- ✅ 개인화된 환영 메시지
- ✅ 빠른 액션 버튼 배치
- ✅ 일러스트로 시선 유도

---

### 2. Journey Overview (여정 개요)

**목적**: 로드맵의 전체 규모를 한눈에 파악

**디자인 스펙**:
```tsx
<section className="max-w-7xl mx-auto px-4 py-16">
  <SectionHeader
    badge="Overview"
    title="당신의 학습 여정"
    subtitle="AI가 분석한 맞춤형 학습 경로의 전체 규모"
  />

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
    <StatCard
      title="추천 과목"
      value={`${stats.totalCourses}개`}
      description="교내 정규 과목 및 교외 활동"
      icon="📚"
      trend="up"
      trendValue={`${stats.totalPhases}학기`}
    />

    <StatCard
      title="학습 단계"
      value={`${stats.totalPhases}단계`}
      description="체계적인 단계별 로드맵"
      icon="🗺️"
    />

    <StatCard
      title="기술 스택"
      value={`${stats.totalTechStacks}개`}
      description="습득할 핵심 기술과 도구"
      icon="💻"
    />

    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-lg font-bold mb-4 text-center" style={{ color: SejongColors.primary }}>
        평균 난이도
      </h3>
      <DonutChart
        value={stats.avgDifficulty}
        max={5}
        size={150}
        color={SejongColors.gold}
        label="학습 난이도"
      />
      <p className="text-center text-sm text-gray-600 mt-4">
        {'⭐'.repeat(Math.round(stats.avgDifficulty))} / 5
      </p>
    </div>
  </div>
</section>
```

**개선 포인트**:
- ✅ 4개 통계를 Grid 레이아웃으로 균형있게 배치
- ✅ DonutChart로 난이도 시각화 강화
- ✅ 아이콘으로 직관성 향상
- ✅ Trend 표시로 동기부여

---

### 3. Your Starting Point (현재 위치)

**목적**: 현재 역량 분석 결과를 명확하고 동기부여적으로 표시

**디자인 스펙**:
```tsx
<section className="max-w-7xl mx-auto px-4 py-16">
  <SectionHeader
    badge="Your Current State"
    title="현재 위치 분석"
    subtitle="강점을 극대화하고, 보완 영역을 채워나가세요"
  />

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
    {/* 강점 카드 */}
    <FeatureCard
      icon="💪"
      title="Your Strengths"
      description="이미 보유한 강력한 역량들"
      accent="success"
      content={
        <div className="mt-6 space-y-4">
          {/* 상위 5개 강점만 표시, 나머지는 "더보기" */}
          {currentSkills.strengths.slice(0, 5).map((strength, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100
                            flex items-center justify-center text-green-600">
                ✓
              </div>
              <p className="text-gray-700">{strength}</p>
            </div>
          ))}

          {currentSkills.strengths.length > 5 && (
            <Button variant="ghost" size="sm">
              + {currentSkills.strengths.length - 5}개 더보기
            </Button>
          )}

          {/* 진행도 바 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ProgressBar
              label="종합 역량 지수"
              value={75}
              color="#10B981"
              size="lg"
              showPercentage
            />
          </div>
        </div>
      }
    />

    {/* 보완 영역 카드 */}
    <FeatureCard
      icon="🎯"
      title="Growth Areas"
      description="개선이 필요한 영역과 학습 방향"
      accent="warning"
      content={
        <div className="mt-6 space-y-4">
          {currentSkills.gaps.slice(0, 5).map((gap, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100
                            flex items-center justify-center text-orange-600">
                →
              </div>
              <p className="text-gray-700">{gap}</p>
            </div>
          ))}

          {currentSkills.gaps.length > 5 && (
            <Button variant="ghost" size="sm">
              + {currentSkills.gaps.length - 5}개 더보기
            </Button>
          )}

          {/* 목표 진행도 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ProgressBar
              label="목표 달성률"
              value={35}
              color="#F59E0B"
              size="lg"
              showPercentage
            />
            <p className="text-xs text-gray-500 mt-2">
              이 로드맵을 완료하면 85%까지 상승합니다
            </p>
          </div>
        </div>
      }
    />
  </div>
</section>
```

**개선 포인트**:
- ✅ 2개 FeatureCard로 강점/보완 영역 대비
- ✅ 체크리스트 스타일로 가독성 향상
- ✅ 진행도 바로 현재/목표 상태 시각화
- ✅ "더보기" 버튼으로 정보 밀도 조절

---

### 4. Learning Roadmap (학습 경로) - 개선

**목적**: 단계별 학습 경로를 직관적이고 인터랙티브하게 표시

**현재 문제점**:
- 가로 스크롤 타임라인이 모바일에서 불편
- 클릭 시 모달이 열리는 방식이 정보 접근성 저하
- 교내/교외 구분이 있지만 시각적 차이가 미미

**개선 방안**:

**Option 1: 아코디언 + 카드 스타일 (추천)**
```tsx
<section className="max-w-7xl mx-auto px-4 py-16">
  <SectionHeader
    badge="Your Journey"
    title="추천 학습 경로"
    subtitle="단계별로 따라가며 목표 진로를 향해 나아가세요"
  />

  {/* 교내/교외 탭 (기존 유지) */}
  <RoadmapTabs activeTab={activeTab} onTabChange={setActiveTab} />

  {/* 스크롤 애니메이션 섹션 */}
  <AnimatedTimelineSection
    phases={timelinePhases}
    renderStyle="accordion-cards"  // 새로운 prop
  />
</section>

// AnimatedTimelineSection 내부 개선
function AccordionRoadmap({ phases }) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(phases[0]?.id);

  return (
    <div className="space-y-6">
      {phases.map((phase, index) => (
        <motion.div
          key={phase.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* 아코디언 헤더 */}
          <button
            onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
            className="w-full"
          >
            <Card
              shadow="lg"
              className="p-6 cursor-pointer hover:shadow-xl transition-all"
              style={{
                borderLeft: `4px solid ${phase.color}`,
                backgroundColor: expandedPhase === phase.id ? `${phase.color}10` : 'white'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* 아이콘 */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{
                      background: phase.gradient,
                      boxShadow: `0 4px 12px ${phase.color}40`
                    }}
                  >
                    {phase.icon}
                  </div>

                  {/* 제목 */}
                  <div className="text-left">
                    <h3 className="text-2xl font-bold" style={{ color: phase.color }}>
                      {phase.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{phase.duration}</p>
                  </div>
                </div>

                {/* 활동 개수 뱃지 + 화살표 */}
                <div className="flex items-center gap-3">
                  <Badge variant="primary">
                    {phase.activities.length}개 활동
                  </Badge>
                  <motion.div
                    animate={{ rotate: expandedPhase === phase.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon className="w-6 h-6 text-gray-400" />
                  </motion.div>
                </div>
              </div>
            </Card>
          </button>

          {/* 아코디언 콘텐츠 */}
          <AnimatePresence>
            {expandedPhase === phase.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Card className="mt-4 p-6 bg-gray-50">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    주요 활동
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.activities.map((activity, idx) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-lg p-4 border-l-4"
                        style={{ borderColor: phase.color }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center
                                      justify-center text-sm font-bold text-white"
                            style={{ backgroundColor: phase.color }}
                          >
                            {idx + 1}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
```

**Option 2: 수직 타임라인 + 인터랙티브 (대안)**
- 기존 가로 타임라인을 수직으로 변경
- 모바일 친화적
- 각 노드 클릭 시 하단에 상세 정보 슬라이드 업

**개선 포인트**:
- ✅ 모바일 최적화 (아코디언 방식)
- ✅ 정보 접근성 향상 (클릭 없이도 개요 파악)
- ✅ 시각적 계층 구조 명확화
- ✅ 애니메이션으로 부드러운 전환

---

### 5. Course Deep Dive (과목 상세) - 개선

**목적**: 과목별 상세 정보를 체계적으로 제공

**현재 문제점**:
- 모든 과목을 한 번에 나열 (정보 과부하)
- 우선순위와 이유가 텍스트로만 표시

**개선 방안**:
```tsx
<section className="max-w-7xl mx-auto px-4 py-16">
  <SectionHeader
    badge="Details"
    title="상세 과목 정보"
    subtitle="각 학기별 추천 과목과 우선순위를 확인하세요"
  />

  <div className="space-y-6 mt-12">
    {learningPath.map((phase, phaseIndex) => (
      <Card key={phaseIndex} shadow="lg" padding="lg">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2"
             style={{ borderColor: `${getPhaseColor(phaseIndex)}20` }}>
          <div>
            <h3 className="text-2xl font-bold" style={{ color: getPhaseColor(phaseIndex) }}>
              {phase.period}
            </h3>
            <p className="text-gray-600 mt-1">{phase.goal}</p>
          </div>
          <Badge variant="primary" size="lg">
            {phase.courses.length}개 과목
          </Badge>
        </div>

        {/* 과목 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phase.courses.map((course, courseIndex) => (
            <motion.div
              key={courseIndex}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-xl p-5 border-2 border-gray-200
                        hover:border-${PRIORITY_COLORS[course.priority]} transition-all"
            >
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-gray-800 flex-1 mr-2">
                  {course.name}
                </h4>
                <Badge
                  variant={course.priority === 'high' ? 'primary' :
                          course.priority === 'medium' ? 'gold' : 'secondary'}
                  size="sm"
                >
                  {PRIORITY_LABELS[course.priority]}
                </Badge>
              </div>

              {/* 타입 */}
              <div className="flex items-center gap-2 mb-3">
                <Tag variant="secondary" size="sm">{course.type}</Tag>
              </div>

              {/* 이유 */}
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {course.reason}
              </p>

              {/* 선수 과목 (있는 경우) */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    선수 과목
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {course.prerequisites.map((prereq, idx) => (
                      <Tag key={idx} variant="secondary" size="xs">
                        {prereq}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 기술스택 섹션 (있는 경우) */}
        {phase.techStacks && phase.techStacks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
              💻 추천 기술스택
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phase.techStacks.map((tech, idx) => (
                <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50
                                          rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-gray-800">{tech.name}</h5>
                    <Badge variant={PRIORITY_VARIANTS[tech.priority]} size="sm">
                      {PRIORITY_LABELS[tech.priority]}
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-600 mb-3">{tech.reason}</p>

                  {/* 난이도 */}
                  {tech.difficulty && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          학습 난이도
                        </span>
                        <span className="text-xs text-gray-600">
                          {'⭐'.repeat(tech.difficulty)}
                        </span>
                      </div>
                      <ProgressBar
                        value={tech.difficulty}
                        max={5}
                        color={getDifficultyColor(tech.difficulty)}
                        size="sm"
                        showPercentage={false}
                      />
                    </div>
                  )}

                  {/* 카테고리 */}
                  <Tag variant="primary" size="xs">{tech.category}</Tag>

                  {/* 리소스 (있는 경우) */}
                  {tech.resources && tech.resources.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tech.resources.map((resource, ridx) => (
                        <a
                          key={ridx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800
                                    underline flex items-center gap-1"
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
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
              🎯 추가 활동
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {phase.activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-gray-50
                                          rounded-lg p-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full
                                bg-green-100 flex items-center justify-center
                                text-green-600 text-sm font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {activity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    ))}
  </div>
</section>
```

**개선 포인트**:
- ✅ 과목을 카드 그리드로 배치 (가독성 향상)
- ✅ 우선순위를 색상과 뱃지로 시각화
- ✅ 호버 효과로 인터랙티브 강화
- ✅ 기술스택과 추가 활동을 별도 섹션으로 구분

---

### 6. Next Steps CTA (다음 단계)

**목적**: 사용자의 다음 행동을 유도

**디자인 스펙**:
```tsx
<section className="max-w-7xl mx-auto px-4 py-16">
  <CallToAction
    title="준비되셨나요?"
    description="이 로드맵을 따라 목표를 향해 나아가세요. 저장하거나 새로운 로드맵을 생성할 수 있습니다."
    primaryAction={{
      label: 'PDF로 저장',
      onClick: () => window.print(),
      icon: '📥'
    }}
    secondaryAction={{
      label: '새 로드맵 생성',
      onClick: onReset,
      icon: '🔄'
    }}
    illustration={
      <div className="text-8xl animate-bounce">🚀</div>
    }
  />
</section>
```

**개선 포인트**:
- ✅ 명확한 CTA (행동 유도)
- ✅ 일러스트로 시선 유도
- ✅ 동기부여 메시지

---

## 🎨 디자인 시스템 개선

### 컴포넌트 확장

**1. 새로운 컴포넌트 필요**
```tsx
// 1. AnimatedRoadmapIllustration - Hero 섹션용 일러스트
export function AnimatedRoadmapIllustration() {
  return (
    <motion.svg>
      {/* 로드맵 경로 애니메이션 SVG */}
    </motion.svg>
  );
}

// 2. AccordionRoadmap - 아코디언 스타일 타임라인
export function AccordionRoadmap({ phases }) {
  // 상세 설계 참고
}

// 3. CourseCard - 과목 카드
export function CourseCard({ course }) {
  // 상세 설계 참고
}

// 4. TechStackCard - 기술스택 카드
export function TechStackCard({ tech }) {
  // 상세 설계 참고
}
```

**2. 기존 컴포넌트 개선**
```tsx
// StatCard - 호버 효과 강화
<StatCard
  // ... existing props
  hoverEffect="lift"  // 새로운 prop
  gradient={true}     // 새로운 prop
/>

// FeatureCard - content prop 추가
<FeatureCard
  // ... existing props
  content={<CustomContent />}  // 새로운 prop
/>
```

### 색상 시스템 확장

```typescript
// SejongColors에 추가
export const SejongColors = {
  // ... existing colors

  // 그라데이션 추가
  gradients: {
    primaryToGold: 'linear-gradient(135deg, #C31632 0%, #8B6F4E 100%)',
    goldToSecondary: 'linear-gradient(135deg, #8B6F4E 0%, #51626F 100%)',
    infoToPrimary: 'linear-gradient(135deg, #3B82F6 0%, #C31632 100%)',
  },

  // 난이도별 색상
  difficulty: {
    1: '#10B981', // Easy - Green
    2: '#3B82F6', // Medium-Easy - Blue
    3: '#F59E0B', // Medium - Orange
    4: '#EF4444', // Hard - Red
    5: '#C31632', // Very Hard - Sejong Primary
  },

  // 상태별 색상
  status: {
    completed: '#10B981',
    active: '#3B82F6',
    pending: '#F59E0B',
    locked: '#9CA3AF',
  },
};
```

---

## 📱 반응형 디자인 전략

### 브레이크포인트

```css
/* Mobile First */
mobile: 320px - 640px   (1열 그리드)
tablet: 641px - 1024px  (2열 그리드)
desktop: 1025px+        (3-4열 그리드)
```

### 반응형 조정

**Hero Section**
- Mobile: 높이 축소 (50vh), 일러스트 숨김
- Tablet: 높이 60vh, 일러스트 작게
- Desktop: 높이 70vh, 일러스트 full

**StatCard Grid**
- Mobile: 1열 (세로 스택)
- Tablet: 2열
- Desktop: 4열

**Course Grid**
- Mobile: 1열
- Tablet: 2열
- Desktop: 3열

**TimelineRoadmap**
- Mobile: 아코디언 방식 (수직)
- Tablet: 아코디언 유지
- Desktop: 아코디언 또는 가로 타임라인 선택

---

## 🎬 애니메이션 전략

### 1. 페이지 로드 애니메이션

```tsx
// Hero Section - Fade in + Slide up
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
  <Hero />
</motion.div>

// StatCards - Stagger children
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {statCards.map((card, i) => (
    <motion.div
      key={i}
      variants={itemVariants}
      custom={i}
    >
      <StatCard {...card} />
    </motion.div>
  ))}
</motion.div>
```

### 2. 스크롤 애니메이션

```tsx
// Parallax 효과
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

<motion.div style={{ y }}>
  {/* Content */}
</motion.div>

// Reveal on scroll
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

### 3. 인터랙션 애니메이션

```tsx
// Hover effects
<motion.div
  whileHover={{
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  {/* Content */}
</motion.div>

// Number count-up
<motion.span
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 2 }}
>
  {useCountUp(targetValue)}
</motion.span>
```

---

## 🚀 구현 우선순위

### Phase 1: 기반 컴포넌트 (1-2일)
1. ✅ Hero Section 구현
2. ✅ SectionHeader 활용
3. ✅ StatCard 개선 (hover, gradient)
4. ✅ FeatureCard content prop 추가

### Phase 2: 레이아웃 개편 (2-3일)
1. ✅ Journey Overview 섹션
2. ✅ Your Starting Point 섹션
3. ✅ 페이지 전체 구조 재배치

### Phase 3: 타임라인 개선 (2-3일)
1. ✅ AccordionRoadmap 컴포넌트
2. ✅ 교내/교외 탭 통합
3. ✅ 스크롤 애니메이션 유지

### Phase 4: 상세 정보 개선 (1-2일)
1. ✅ CourseCard 컴포넌트
2. ✅ TechStackCard 컴포넌트
3. ✅ 과목 상세 섹션 재구성

### Phase 5: CTA & 마무리 (1일)
1. ✅ CallToAction 섹션
2. ✅ 반응형 최적화
3. ✅ 애니메이션 polish

**총 예상 기간**: 7-11일

---

## 📊 성공 지표

### 사용자 경험 지표
- ✅ 페이지 로드 시간 < 2초
- ✅ First Contentful Paint < 1.5초
- ✅ Time to Interactive < 3초
- ✅ 모바일 사용성 점수 > 90/100

### 비즈니스 지표
- ✅ PDF 다운로드 전환율 증가
- ✅ 새 로드맵 생성 전환율 증가
- ✅ 평균 페이지 체류 시간 증가
- ✅ 이탈률 감소

---

## 📌 다음 단계

**즉시 실행 가능**:
1. `/implement` - Phase 1 컴포넌트 구현 시작
2. `src/components/roadmap/` 디렉토리에 새 컴포넌트 추가
3. `src/components/RoadmapDisplay.tsx` 리팩토링

**준비 사항**:
- ✅ 로드맵 일러스트 SVG 준비
- ✅ 아이콘 세트 확정
- ✅ 애니메이션 타이밍 테스트

**문서화**:
- ✅ 컴포넌트 Storybook 작성
- ✅ 디자인 가이드 문서
- ✅ 사용자 가이드

---

## 🎨 디자인 참고

### Showcase UI 재사용 컴포넌트
- ✅ Hero
- ✅ SectionHeader
- ✅ StatCard
- ✅ FeatureCard
- ✅ CallToAction
- ✅ Card
- ✅ Button
- ✅ Badge, Tag
- ✅ DonutChart, BarChart, ProgressBar

### 새로 생성할 컴포넌트
- AccordionRoadmap
- CourseCard
- TechStackCard
- AnimatedRoadmapIllustration

---

**설계 목표**: "Showcase UI의 디자인 언어를 유지하면서, 로드맵 페이지를 더욱 직관적이고 인터랙티브하게 개선"
