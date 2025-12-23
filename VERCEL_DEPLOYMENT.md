# Vercel 배포 가이드

## 🚀 빠른 배포 (3분)

### 1단계: GitHub 저장소 확인
✅ **완료**: 코드가 이미 GitHub에 푸시되었습니다.
- Repository: `https://github.com/Wanik-Sejong/Wanik-Sejong-FE.git`

---

### 2단계: Vercel 프로젝트 생성

1. **Vercel 로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 목록에서 `Wanik-Sejong-FE` 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 설정됨)
   - **Output Directory**: `.next` (자동 설정됨)

---

### 3단계: 환경 변수 설정 ⚠️ 중요!

**Environment Variables 섹션에서 다음 변수들을 추가하세요:**

#### 필수 환경 변수

```bash
# Mock 모드 비활성화 (Production에서는 실제 AI 사용)
NEXT_PUBLIC_USE_MOCK=false

# Gemini API Key (AI 로드맵 생성용)
GEMINI_API_KEY=AIzaSyAakcMPi69qTs19xeAcA6sVTL7UM8Z2RRc

# Backend API URL (Spring Boot 서버)
NEXT_PUBLIC_API_URL=https://hackathon.yeo-li.com
```

#### 환경 변수 입력 방법

각 변수를 개별적으로 추가:
1. **Key**: `NEXT_PUBLIC_USE_MOCK`
   - **Value**: `false`
   - **Environment**: Production, Preview, Development 모두 체크

2. **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyAakcMPi69qTs19xeAcA6sVTL7UM8Z2RRc`
   - **Environment**: Production, Preview, Development 모두 체크

3. **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://hackathon.yeo-li.com`
   - **Environment**: Production, Preview, Development 모두 체크

---

### 4단계: 배포 실행

1. **"Deploy" 버튼 클릭**
2. 빌드 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 "Visit" 버튼으로 사이트 확인

---

## 📊 배포 후 확인사항

### ✅ 체크리스트

- [ ] 메인 페이지가 정상적으로 로드됨
- [ ] 파일 업로드 기능 작동 (Excel 파일)
- [ ] 진로 입력 기능 작동
- [ ] AI 로드맵 생성 기능 작동 (Gemini API 호출)
- [ ] 챗봇 기능 작동 (오른쪽 하단 버튼)
- [ ] 반응형 디자인 확인 (모바일/데스크톱)

### 🔍 테스트 시나리오

1. **성적표 업로드 테스트**
   - 샘플 Excel 파일 업로드
   - 자동으로 진로 입력 화면으로 전환되는지 확인

2. **AI 로드맵 생성 테스트**
   - 진로 입력 (예: "AI/ML 엔지니어")
   - "로드맵 생성하기" 클릭
   - 10-20초 내에 로드맵이 생성되는지 확인

3. **로드맵 확인 테스트**
   - 진로 요약 섹션 확인
   - 현재 역량 분석 확인
   - Phase 카드 클릭하여 상세 정보 확인
   - 기술스택 탭 확인

4. **챗봇 테스트**
   - 챗봇 버튼 클릭
   - 간단한 질문 입력 (예: "데이터구조 교수님 누구세요?")
   - 응답 확인

---

## 🌐 배포 URL

배포 완료 후 Vercel이 자동으로 할당한 URL:
```
https://wanik-sejong-fe-xxxxx.vercel.app
```

또는 커스텀 도메인 설정 가능.

---

## 🔧 설정 파일 확인

### `next.config.ts`

현재 설정:
```typescript
const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
```

**특별한 Vercel 설정 불필요** - 기본 Next.js 설정으로 작동합니다.

---

## 🚨 배포 시 주의사항

### 1. 환경 변수 누락 시
**증상**: 로드맵 생성 시 에러 발생
**해결**: Vercel 대시보드 → Settings → Environment Variables에서 추가

### 2. GEMINI_API_KEY 오류
**증상**: "Gemini API 키가 설정되지 않았습니다" 에러
**해결**:
- Vercel 환경 변수에서 `GEMINI_API_KEY` 값 확인
- 재배포: Deployments → 최신 배포 → Redeploy

### 3. CORS 에러
**증상**: Backend API 호출 시 CORS 에러
**해결**:
- Backend 서버에서 Vercel 도메인 허용 필요
- Spring Boot `@CrossOrigin` 설정 확인

### 4. 빌드 실패
**증상**: 배포 중 빌드 에러
**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# TypeScript 에러 확인
npx tsc --noEmit
```

---

## 🔄 자동 배포 설정

### GitHub 연동
✅ **이미 설정됨**: GitHub `main` 브랜치에 푸시하면 자동으로 재배포됩니다.

### 배포 트리거
- `main` 브랜치에 푸시 → 자동 배포
- Pull Request 생성 → Preview 배포
- 수동 재배포 → Vercel 대시보드에서 "Redeploy" 클릭

---

## 📈 성능 최적화 (선택사항)

### 1. Edge Functions 활용
현재는 Serverless Functions 사용 중.
필요 시 API Routes를 Edge로 마이그레이션 가능.

### 2. 이미지 최적화
Next.js Image 컴포넌트 사용 권장:
```typescript
import Image from 'next/image';

<Image src="/logo.svg" width={100} height={100} alt="Logo" />
```

### 3. 캐싱 전략
Vercel이 자동으로 Static 페이지와 이미지 캐싱 처리.

---

## 🎯 커스텀 도메인 설정 (선택사항)

### 도메인 추가 방법

1. **Vercel 대시보드**
   - Settings → Domains
   - "Add Domain" 클릭

2. **DNS 설정**
   - A Record 또는 CNAME 추가
   - Vercel이 제공하는 값 입력

3. **SSL 인증서**
   - 자동으로 Let's Encrypt 인증서 발급

---

## 📊 모니터링

### Vercel Analytics
- Real-time 방문자 통계
- 성능 지표 (Core Web Vitals)
- API 호출 로그

### 로그 확인
- Vercel 대시보드 → Deployments → 배포 선택 → Logs
- Runtime Logs에서 서버 사이드 에러 확인

---

## 🆘 문제 해결

### 배포는 성공했는데 페이지가 안 열림
1. Vercel 대시보드 → Deployment 로그 확인
2. 빌드 에러 메시지 확인
3. 환경 변수 설정 재확인

### AI 로드맵 생성이 안 됨
1. `GEMINI_API_KEY` 환경 변수 확인
2. `NEXT_PUBLIC_USE_MOCK=false` 확인
3. API 호출 로그 확인

### 챗봇이 작동 안 함
1. Backend API 연결 확인 (`NEXT_PUBLIC_API_URL`)
2. CORS 설정 확인
3. Network 탭에서 API 호출 실패 여부 확인

---

## 📞 추가 지원

### Vercel 공식 문서
- https://vercel.com/docs

### Next.js 배포 가이드
- https://nextjs.org/docs/deployment

### 팀 연락처
- GitHub Issues: https://github.com/Wanik-Sejong/Wanik-Sejong-FE/issues

---

## ✅ 배포 완료 체크리스트

최종 확인:
- [ ] GitHub에 최신 코드 푸시됨
- [ ] Vercel 프로젝트 생성됨
- [ ] 환경 변수 3개 모두 설정됨 (NEXT_PUBLIC_USE_MOCK, GEMINI_API_KEY, NEXT_PUBLIC_API_URL)
- [ ] 빌드 성공 (초록색 체크)
- [ ] 배포 URL 접속 가능
- [ ] 파일 업로드 기능 테스트 완료
- [ ] AI 로드맵 생성 테스트 완료
- [ ] 챗봇 기능 테스트 완료
- [ ] 모바일 반응형 확인 완료

---

**🎉 배포 성공! 이제 발표 준비를 시작하세요!**
