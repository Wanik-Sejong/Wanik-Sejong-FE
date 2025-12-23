# 완익세종 UI 컴포넌트 라이브러리

> shadcn/ui 스타일의 재사용 가능한 컴포넌트 모음
> 세종대학교 브랜드 컬러 시스템 적용

---

## 📦 설치된 컴포넌트

### Layout & Structure
- ✅ **Card** - 기본 카드, 통계 카드, 기능 카드
- ✅ **Hero** - 히어로 섹션, 섹션 헤더, CTA
- ✅ **ProcessFlow** - 프로세스 플로우, 타임라인

### Form Elements
- ✅ **Input** - 텍스트 입력, 텍스트에리어, 셀렉트
- ✅ **Button** - 버튼, 아이콘 버튼

### Data Display
- ✅ **Chart** - 도넛 차트, 바 차트, 프로그레스 바
- ✅ **Badge** - 뱃지, 태그, 상태 뱃지

---

## 🎨 컬러 시스템

모든 컴포넌트는 [src/styles/colors.ts](../src/styles/colors.ts)의 세종대 브랜드 컬러를 사용합니다:

```typescript
import { SejongColors } from '@/styles/colors';

// Primary Colors
SejongColors.primary        // #C31632 (세종 크림슨)
SejongColors.secondary      // #51626F (세종 그레이)
SejongColors.gold           // #8B6F4E (세종 골드)

// Tints (50-900)
SejongColors.primary50      // 매우 밝은 핑크
SejongColors.primary500     // 오리지널 (primary)
SejongColors.primary900     // 매우 어두운 레드
```

---

## 📖 사용 방법

### 1. Card 컴포넌트

```typescript
import { Card, StatCard, FeatureCard } from '@/components/ui';

// 기본 카드
<Card shadow="lg" hover padding="md">
  <h3>제목</h3>
  <p>내용</p>
</Card>

// 통계 카드
<StatCard
  title="플랫폼 이용 의사"
  value="87.3%"
  description="설문 응답자 중 87.3%가 이용 의사 보유"
  icon="📊"
  trend="up"
  trendValue="12.3%"
/>

// 기능 카드
<FeatureCard
  icon="📍"
  title="Various"
  description="검증된 취향 정보 기반 신뢰도 높은 추천"
  accent="primary"
/>
```

### 2. Hero 섹션

```typescript
import { Hero } from '@/components/ui';

<Hero
  badge="완익세종"
  title="취향에 맞는 진로를"
  subtitle="어디에?"
  description="AI 기반으로 학생의 이수 과목과 희망 진로를 분석하여..."
  illustration={<div>일러스트</div>}
  actions={
    <>
      <Button variant="primary" size="lg">시작하기</Button>
      <Button variant="outline" size="lg">더 알아보기</Button>
    </>
  }
/>
```

### 3. ProcessFlow (3단계 프로세스)

```typescript
import { ProcessFlow } from '@/components/ui';

<ProcessFlow
  steps={[
    {
      icon: '📍',
      title: '1단계',
      description: '설명'
    },
    {
      icon: '📱',
      title: '2단계',
      description: '설명'
    },
    {
      icon: '🎯',
      title: '3단계',
      description: '설명'
    }
  ]}
/>
```

### 4. Timeline (타임라인)

```typescript
import { Timeline } from '@/components/ui';

<Timeline
  items={[
    {
      icon: '📚',
      title: '2025년 여름방학',
      subtitle: '기초 역량 강화',
      description: 'Coursera ML 강의 수강...',
      date: '7-8월',
      status: 'completed'
    },
    {
      icon: '🎓',
      title: '2025년 2학기',
      subtitle: '심화 과정',
      description: '기계학습 수강...',
      date: '9-12월',
      status: 'active'
    }
  ]}
/>
```

### 5. Chart (차트)

```typescript
import { DonutChart, BarChart, ProgressBar } from '@/components/ui';

// 도넛 차트
<DonutChart
  value={67}
  max={100}
  size={200}
  label="공감도"
  showPercentage
/>

// 바 차트
<BarChart
  data={[
    { label: '전공필수', value: 45, color: SejongColors.primary },
    { label: '전공선택', value: 32, color: SejongColors.gold }
  ]}
/>

// 프로그레스 바
<ProgressBar
  label="딥러닝"
  value={85}
  color={SejongColors.primary}
  size="lg"
/>
```

### 6. Button

```typescript
import { Button, IconButton } from '@/components/ui';

// 기본 버튼
<Button variant="primary" size="lg">
  로드맵 생성하기 🚀
</Button>

<Button variant="outline" size="md" fullWidth>
  더 알아보기
</Button>

<Button variant="ghost" size="sm" loading>
  처리 중...
</Button>

// 아이콘 버튼
<IconButton
  icon={<svg>...</svg>}
  label="닫기"
  variant="ghost"
  size="md"
/>
```

### 7. Input

```typescript
import { Input, Textarea, Select } from '@/components/ui';

// 텍스트 입력
<Input
  label="이메일"
  type="email"
  placeholder="your@email.com"
  error="유효한 이메일을 입력하세요"
  required
  fullWidth
/>

// 텍스트에리어
<Textarea
  label="희망 진로"
  rows={4}
  placeholder="예: AI 엔지니어, 백엔드 개발자"
  helperText="구체적으로 작성해주세요"
/>

// 셀렉트
<Select
  label="남은 학기"
  options={[
    { value: '1', label: '1학기' },
    { value: '2', label: '2학기' },
    { value: '3', label: '3학기' }
  ]}
  placeholder="선택하세요"
/>
```

### 8. Badge & Tag

```typescript
import { Badge, Tag, StatusBadge } from '@/components/ui';

// 뱃지
<Badge variant="primary">Primary</Badge>
<Badge variant="success" dot>진행중</Badge>

// 상태 뱃지
<StatusBadge status="active" />
<StatusBadge status="completed" />
<StatusBadge status="pending" />
<StatusBadge status="cancelled" />

// 태그
<Tag variant="primary">AI/ML</Tag>
<Tag variant="secondary" onRemove={() => console.log('Removed')}>
  Python
</Tag>
```

---

## 🎯 디자인 원칙

### 1. 세종대 브랜드 아이덴티티
- ✅ 세종 크림슨(#C31632)을 Primary 컬러로 사용
- ✅ 세종 그레이, 골드를 보조 컬러로 활용
- ✅ Tint 시스템(50-900)으로 일관된 컬러 팔레트

### 2. 접근성 (Accessibility)
- ✅ 충분한 색상 대비 (WCAG AA 기준)
- ✅ 키보드 네비게이션 지원
- ✅ ARIA 라벨 적용
- ✅ Focus state 명확히 표시

### 3. 반응형 디자인
- ✅ Mobile-first 접근
- ✅ Tailwind CSS 반응형 유틸리티 활용
- ✅ Grid/Flexbox 레이아웃

### 4. 애니메이션
- ✅ 부드러운 전환 (200ms ease)
- ✅ Hover 효과 (scale, opacity)
- ✅ Loading 상태 표시

---

## 📁 파일 구조

```
src/components/ui/
├── Badge.tsx          # 뱃지, 태그, 상태 뱃지
├── Button.tsx         # 버튼, 아이콘 버튼
├── Card.tsx           # 카드, 통계 카드, 기능 카드
├── Chart.tsx          # 도넛 차트, 바 차트, 프로그레스 바
├── Hero.tsx           # 히어로, 섹션 헤더, CTA
├── Input.tsx          # 입력, 텍스트에리어, 셀렉트
├── ProcessFlow.tsx    # 프로세스 플로우, 타임라인
└── index.ts           # 컴포넌트 내보내기
```

---

## 🚀 예제 페이지

컴포넌트 사용 예제는 [/showcase](http://localhost:3000/showcase) 페이지에서 확인할 수 있습니다:

```bash
npm run dev
# http://localhost:3000/showcase
```

---

## 💡 베스트 프랙티스

### 1. 색상 사용
```typescript
// ✅ Good - 세종 컬러 시스템 사용
style={{ color: SejongColors.primary }}

// ❌ Bad - 하드코딩된 색상
style={{ color: '#C31632' }}
```

### 2. 간격 (Spacing)
```typescript
// ✅ Good - Tailwind 유틸리티 사용
className="p-6 mb-4 gap-3"

// ❌ Bad - 인라인 스타일
style={{ padding: '24px', marginBottom: '16px' }}
```

### 3. 타입 안정성
```typescript
// ✅ Good - TypeScript 타입 활용
interface MyComponentProps {
  title: string;
  value: number;
}

// ❌ Bad - any 타입 사용
const MyComponent = (props: any) => { }
```

---

## 🔧 커스터마이징

### 새 컴포넌트 추가
```bash
# 1. 컴포넌트 파일 생성
src/components/ui/MyComponent.tsx

# 2. index.ts에 export 추가
export { MyComponent } from './MyComponent';

# 3. 사용
import { MyComponent } from '@/components/ui';
```

### 기존 컴포넌트 확장
```typescript
// 기존 컴포넌트를 확장하여 사용
import { Button } from '@/components/ui';

export function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}
```

---

## 📚 참고 자료

- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React 컴포넌트 패턴](https://www.patterns.dev/)
- [세종대학교 브랜드 가이드](https://www.sejong.ac.kr/)

---

## 문서 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2025-12-23 | Claude | 초안 작성 |

---

> **완익세종 UI 컴포넌트 라이브러리** - 세종대 브랜드 아이덴티티를 반영한 모던 컴포넌트 🎨
