# Wanik-Sejong

Next.js 프로젝트입니다.

## 프로젝트 구조

```
wanik-sejong/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   ├── page.tsx      # 홈페이지
│   │   └── globals.css   # 전역 스타일
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── lib/              # 유틸리티 함수 및 헬퍼
│   ├── types/            # TypeScript 타입 정의
│   └── hooks/            # 커스텀 React Hooks
├── public/               # 정적 파일
└── package.json
```

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint

## 시작하기

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

## 개발 가이드

- `src/app/page.tsx`를 수정하여 페이지를 편집할 수 있습니다.
- 파일을 수정하면 페이지가 자동으로 업데이트됩니다.
- 새로운 컴포넌트는 `src/components/` 폴더에 추가하세요.

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
