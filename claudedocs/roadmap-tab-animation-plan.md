# 로드맵 교내/교외 탭 및 스크롤 애니메이션 구현 계획

## 📋 요구사항 요약

1. **교내/교외 탭 전환 기능**
   - 로드맵에 "교내" / "교외" 탭 추가
   - 교내 = 세종대 정규 과목 (전공필수, 전공선택, 교양 등)
   - 교외 = 외부 활동 (외부강의, 부트캠프, 대외활동 등)
   - 클릭 시 해당 데이터만 필터링하여 표시

2. **SliverAppBar 스타일 스크롤 애니메이션**
   - 교내 탭 활성화 상태에서 스크롤 다운
   - 타임라인 영역이 확대 (scale 1.0 → 1.1)
   - 스크롤 업 시 원래 크기로 복귀
   - Framer Motion의 useScroll + useTransform 활용

---

## 🎯 구현 목표

### Phase 1: 데이터 구조 확장
- ✅ `RecommendedCourse.type` 필드 활용 (이미 존재)
- AI 프롬프트에 교내/교외 구분 명시 요청
- 데이터 필터링 로직 구현

### Phase 2: UI 컴포넌트
- 탭 컴포넌트 생성 (`RoadmapTabs`)
- Pill 스타일 디자인 (SejongColors 적용)
- 상태 관리 (useState)

### Phase 3: 스크롤 애니메이션
- useScroll 훅으로 스크롤 감지
- useTransform으로 scale 값 계산
- motion.div로 TimelineRoadmap 래핑

### Phase 4: 통합 및 테스트
- RoadmapDisplay에 탭과 애니메이션 통합
- 반응형 테스트
- 접근성 검증

---

## 🏗️ 아키텍처 설계

### 컴포넌트 구조
```
RoadmapDisplay
├── RoadmapTabs (새로 생성)
│   ├── Tab: 교내 (기본 활성)
│   └── Tab: 교외
└── AnimatedTimelineSection (새로 생성)
    └── TimelineRoadmap (기존)
```

### 상태 관리
```typescript
const [activeTab, setActiveTab] = useState<'oncampus' | 'offcampus'>('oncampus');

const filteredPhases = useMemo(() => {
  return learningPath.filter(phase => {
    // courses의 type 기준으로 필터링
    const hasOnCampusCourses = phase.courses.some(
      course => course.type !== '외부강의' && course.type !== '부트캠프'
    );

    if (activeTab === 'oncampus') {
      return hasOnCampusCourses;
    } else {
      return !hasOnCampusCourses;
    }
  });
}, [learningPath, activeTab]);
```

---

## 📝 상세 구현 단계

### Step 1: RoadmapTabs 컴포넌트 생성

**파일**: `src/components/roadmap/RoadmapTabs.tsx`

```typescript
'use client';

import { motion } from 'framer-motion';
import { SejongColors } from '@/styles/colors';

export type TabType = 'oncampus' | 'offcampus';

interface RoadmapTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function RoadmapTabs({ activeTab, onTabChange }: RoadmapTabsProps) {
  const tabs: { value: TabType; label: string; icon: string }[] = [
    { value: 'oncampus', label: '교내', icon: '🏫' },
    { value: 'offcampus', label: '교외', icon: '🌐' },
  ];

  return (
    <div className="flex justify-center gap-3 mb-8">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <motion.button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className="relative px-8 py-3 rounded-full font-semibold text-base transition-all"
            style={{
              backgroundColor: isActive ? SejongColors.primary : '#F3F4F6',
              color: isActive ? '#FFFFFF' : SejongColors.text.primary,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}

            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: SejongColors.primary,
                  boxShadow: `0 4px 12px ${SejongColors.primary}40`,
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {tab.icon} {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
```

**타입 정의 추가**: `src/types/roadmap.types.ts`

```typescript
export type TabType = 'oncampus' | 'offcampus';

export interface RoadmapTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}
```

---

### Step 2: AnimatedTimelineSection 컴포넌트 생성

**파일**: `src/components/roadmap/AnimatedTimelineSection.tsx`

```typescript
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TimelineRoadmap } from './TimelineRoadmap';
import type { RoadmapPhase } from '@/types/roadmap.types';

interface AnimatedTimelineSectionProps {
  phases: RoadmapPhase[];
  enableDragScroll?: boolean;
}

export function AnimatedTimelineSection({
  phases,
  enableDragScroll = true,
}: AnimatedTimelineSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 스크롤 진행도 추적 (0 ~ 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'], // 섹션이 뷰포트에 들어올 때부터 나갈 때까지
  });

  // 스크롤 진행도에 따라 scale 값 변환
  // 0.0 (시작) → 1.0
  // 0.5 (중간) → 1.1 (최대 확대)
  // 1.0 (끝) → 1.0
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1.0, 1.1, 1.1, 1.0]
  );

  // 투명도도 함께 조절 (선택사항)
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  return (
    <div ref={sectionRef} className="w-full -mx-4 px-4 overflow-hidden">
      <motion.div
        style={{ scale, opacity }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      >
        <TimelineRoadmap phases={phases} enableDragScroll={enableDragScroll} />
      </motion.div>
    </div>
  );
}
```

---

### Step 3: RoadmapDisplay 수정

**파일**: `src/components/RoadmapDisplay.tsx`

**수정 영역**: 상단 imports + 상태 관리 + 탭 렌더링

```typescript
// 1. Import 추가
import { useState } from 'react';
import { RoadmapTabs, type TabType } from './roadmap/RoadmapTabs';
import { AnimatedTimelineSection } from './roadmap/AnimatedTimelineSection';

// 2. 컴포넌트 내부에 상태 추가 (line 37 근처)
export function RoadmapDisplay({ roadmap, onReset }: RoadmapDisplayProps) {
  const { careerSummary, currentSkills, learningPath, advice, generatedAt } = roadmap;

  // 교내/교외 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>('oncampus');

  // 3. 필터링 로직 추가 (기존 stats useMemo 뒤)
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

  // 4. timelinePhases 계산 시 filteredLearningPath 사용
  const timelinePhases = useMemo(
    () => convertLearningPathToPhases(filteredLearningPath),
    [filteredLearningPath]
  );

  // 5. 렌더링 부분 수정 (line 279-404 영역)
  // 기존:
  // <section>
  //   <div className="text-center mb-8">
  //     <h2>추천 학습 경로</h2>
  //   </div>
  //   <div className="w-full -mx-4 px-4 overflow-hidden">
  //     <TimelineRoadmap phases={timelinePhases} enableDragScroll={true} />
  //   </div>
  // </section>

  // 새로운:
  <section>
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2"
          style={{ color: SejongColors.primary }}>
        <span>🗺️</span>
        추천 학습 경로
      </h2>
      <p className="text-gray-600">
        단계별로 따라가며 목표 진로를 향해 나아가세요
      </p>
    </div>

    {/* 교내/교외 탭 */}
    <RoadmapTabs activeTab={activeTab} onTabChange={setActiveTab} />

    {/* 스크롤 애니메이션이 적용된 타임라인 */}
    <AnimatedTimelineSection
      phases={timelinePhases}
      enableDragScroll={true}
    />
  </section>
}
```

---

### Step 4: 컴포넌트 Export 추가

**파일**: `src/components/roadmap/index.ts`

```typescript
// 기존 exports...

// Tab and Animation Components
export { RoadmapTabs } from './RoadmapTabs';
export { AnimatedTimelineSection } from './AnimatedTimelineSection';
export type { TabType } from './RoadmapTabs';
```

---

## 🎨 스타일링 세부사항

### 탭 디자인
- **Active 상태**: SejongColors.primary 배경, 흰색 텍스트, 그림자 효과
- **Inactive 상태**: 회색 배경 (#F3F4F6), 기본 텍스트 색상
- **Hover 효과**: scale(1.05)
- **Tap 효과**: scale(0.95)
- **전환 애니메이션**: Framer Motion layoutId로 부드러운 전환

### 스크롤 애니메이션
- **Scale 범위**: 1.0 (정상) → 1.1 (확대) → 1.0 (복귀)
- **Opacity 범위**: 0.8 → 1.0 → 0.8
- **전환 타이밍**: Spring 애니메이션 (stiffness: 100, damping: 30)
- **트리거 영역**: 섹션이 뷰포트에 30% 진입 시 시작

---

## ⚠️ 주의사항

### 1. 데이터 필터링
- **빈 결과 처리**: 교외 활동이 없을 경우 안내 메시지 표시
- **과목 타입 표준화**: AI 응답에서 일관된 type 값 보장 필요
- **하이브리드 phase**: 교내+교외 과목 혼합 시 어떻게 분류할지 결정

### 2. 성능 최적화
- **useMemo**: 필터링 결과 캐싱
- **useCallback**: 탭 변경 핸들러 메모이제이션
- **throttle/debounce**: 스크롤 이벤트 최적화 (Framer Motion이 자동 처리)

### 3. 접근성
- **키보드 네비게이션**: Tab 키로 탭 간 이동, Enter/Space로 활성화
- **ARIA 속성**: role="tablist", role="tab", aria-selected
- **Screen reader**: 현재 활성 탭 안내

### 4. 반응형
- **모바일**: 탭 크기 축소, 스크롤 애니메이션 감소 (scale 1.0 → 1.05)
- **태블릿**: 중간 크기 유지
- **데스크톱**: 전체 효과 적용

---

## ✅ 테스트 체크리스트

### 기능 테스트
- [ ] 교내 탭 클릭 → 교내 과목만 표시
- [ ] 교외 탭 클릭 → 교외 활동만 표시
- [ ] 탭 전환 시 부드러운 애니메이션
- [ ] 스크롤 다운 → 타임라인 확대
- [ ] 스크롤 업 → 타임라인 축소

### UI/UX 테스트
- [ ] 탭 active 상태 시각적으로 명확
- [ ] 애니메이션이 부드럽고 자연스러움
- [ ] 빈 데이터 시 적절한 메시지 표시
- [ ] SejongColors 일관성 유지

### 반응형 테스트
- [ ] 모바일 (375px): 탭이 한 줄에 표시
- [ ] 태블릿 (768px): 적절한 간격 유지
- [ ] 데스크톱 (1440px): 최적의 레이아웃

### 접근성 테스트
- [ ] 키보드로 탭 전환 가능
- [ ] Screen reader가 탭 상태 읽음
- [ ] Focus 표시 명확

### 성능 테스트
- [ ] 빠른 스크롤 시 버벅임 없음
- [ ] 탭 전환 시 지연 없음
- [ ] 많은 phase 개수 시에도 원활

---

## 🚀 배포 전 확인사항

1. **AI 프롬프트 업데이트**
   - 백엔드에서 과목 type을 "전공필수", "전공선택", "교양", "외부강의", "부트캠프" 등으로 명확히 구분
   - 예시 프롬프트 추가:
     ```
     "courses의 type은 다음 중 하나여야 함:
      - 교내: 전공필수, 전공선택, 교양필수, 교양선택, 일반선택
      - 교외: 외부강의, 부트캠프, 인턴십, 대외활동"
     ```

2. **타입 안전성**
   - RecommendedCourse.type을 union type으로 제한 고려
   - 런타임 검증 추가

3. **에러 처리**
   - 필터링 결과가 비어있을 때 UX 개선
   - 네트워크 에러 시 fallback UI

---

## 📊 예상 영향 범위

### 수정 파일 (3개)
1. `src/components/RoadmapDisplay.tsx` - 탭 상태 및 렌더링
2. `src/types/roadmap.types.ts` - 타입 정의 추가

### 새로 생성 파일 (2개)
3. `src/components/roadmap/RoadmapTabs.tsx` - 탭 컴포넌트
4. `src/components/roadmap/AnimatedTimelineSection.tsx` - 애니메이션 섹션

### 수정 Export (1개)
5. `src/components/roadmap/index.ts` - Export 추가

---

## 🎯 다음 단계

1. **Phase 1 구현**: RoadmapTabs 컴포넌트 생성
2. **Phase 2 구현**: AnimatedTimelineSection 생성
3. **Phase 3 구현**: RoadmapDisplay 통합
4. **Phase 4 구현**: 타입 정의 및 Export
5. **테스트**: 브라우저에서 시각적 확인 및 동작 검증
6. **최적화**: 성능 및 접근성 개선

구현 진행 승인 시 `/sc:implement` 명령어로 시작합니다.
