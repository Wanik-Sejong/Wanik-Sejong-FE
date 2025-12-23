# GitHub Actions Secrets 설정 가이드

> Wanik-Sejong 프로젝트를 GitHub Actions에서 배포하기 위한 환경 변수 설정 가이드

---

## 📋 개요

GitHub Actions를 통해 프로덕션 환경에 배포할 때, 민감한 정보(API 키, 데이터베이스 비밀번호 등)는 **GitHub Secrets**에 저장하여 안전하게 관리해야 합니다.

이 문서는 Wanik-Sejong 프로젝트에 필요한 GitHub Actions Secrets 설정 방법을 설명합니다.

---

## 🔐 필수 Secrets 목록

### 1. Next.js 환경 변수

**중요**: Next.js는 서버 사이드와 클라이언트 사이드 환경 변수를 구분합니다.

| Secret 이름 | 실행 위치 | 필수 여부 | 설명 | 예시 값 |
|-------------|-----------|-----------|------|---------|
| `NEXT_PUBLIC_USE_MOCK` | 클라이언트 (브라우저) | ✅ | Mock 모드 활성화 여부 | `false` (프로덕션) |
| `OPENAI_API_KEY` | 서버 사이드 (Node.js) | ✅ | OpenAI API 키 (Next.js API Routes에서만 사용) | `sk-proj-xxxxxxxxxx` |
| `NEXT_PUBLIC_API_URL` | 클라이언트 (브라우저) | ❌ | API Base URL (선택사항) | `https://your-domain.com` |

**아키텍처 설명**:
```
브라우저 (Client)           Next.js API Routes (Server)      OpenAI API
─────────────────           ───────────────────────────      ──────────
React 컴포넌트              /api/generate-roadmap/route.ts
  ↓ fetch()                      ↓ OpenAI SDK
NEXT_PUBLIC_USE_MOCK  →    OPENAI_API_KEY (서버 전용)   →   GPT-4o
(브라우저 노출 가능)        (브라우저 절대 노출 안 됨)
```

### 2. 향후 Backend 환경 변수 (FastAPI 연동 시)

현재는 사용하지 않지만, CLAUDE.md에 언급된 백엔드 설정입니다.

| Secret 이름 | 설명 | 필수 여부 | 예시 값 |
|-------------|------|-----------|---------|
| `DATABASE_URL` | 데이터베이스 연결 URL | ❌ | `sqlite:///./app/db/eunsaem_church.db` |
| `SUPABASE_URL` | Supabase 프로젝트 URL | ❌ | `https://twbakqeemdcaljkymywk.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role 키 | ❌ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_ANON_KEY` | Supabase Anonymous 키 | ❌ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

---

## 📝 GitHub Secrets 설정 방법

### Step 1: GitHub Repository 접속

1. GitHub에서 프로젝트 저장소로 이동
2. **Settings** 탭 클릭
3. 왼쪽 사이드바에서 **Secrets and variables** → **Actions** 클릭

### Step 2: New Repository Secret 추가

1. **New repository secret** 버튼 클릭
2. 각 Secret을 아래 표를 참고하여 추가

---

## 🔧 Secret 설정 상세 가이드

### 1. NEXT_PUBLIC_USE_MOCK

**설명**: Mock 모드 활성화 여부 (프로덕션에서는 `false`)

**설정 방법**:
- **Name**: `NEXT_PUBLIC_USE_MOCK`
- **Value**: `false`

**주의사항**:
- 개발 환경: `true` (로컬 `.env.local`)
- 프로덕션 환경: `false` (GitHub Actions)

---

### 2. OPENAI_API_KEY

**설명**: OpenAI GPT-4o API 키

**발급 방법**:

1. [OpenAI Platform](https://platform.openai.com/api-keys) 접속
2. 로그인 후 **API keys** 메뉴 이동
3. **Create new secret key** 클릭
4. 키 이름 입력 (예: `wanik-sejong-production`)
5. 생성된 키 복사 (한 번만 표시됨)

**설정 방법**:
- **Name**: `OPENAI_API_KEY`
- **Value**: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**주의사항**:
- ⚠️ API 키는 절대 GitHub 코드에 커밋하지 마세요
- ⚠️ 키 생성 시 한 번만 표시되므로 안전한 곳에 백업
- ⚠️ OpenAI API 사용량에 따라 비용이 발생합니다
- ⚠️ OpenAI Dashboard에서 월별 사용량 제한 설정 권장

**비용 관리**:
- [OpenAI Usage Dashboard](https://platform.openai.com/usage)에서 사용량 모니터링
- Hard limit 설정: Settings → Billing → Usage limits

---

### 3. NEXT_PUBLIC_API_URL (선택사항)

**설명**: API Base URL (기본값: `http://localhost:3000`)

**설정 방법**:
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://your-production-domain.com`

**언제 설정하나요?**
- Vercel, Netlify 등에 배포할 때
- 커스텀 도메인을 사용할 때
- 백엔드와 프론트엔드가 분리된 경우

---

### 4. SUPABASE_URL (향후 사용)

**설명**: Supabase 프로젝트 URL

**발급 방법**:

1. [Supabase Dashboard](https://app.supabase.com/) 접속
2. 프로젝트 선택
3. **Settings** → **API** 이동
4. **Project URL** 복사

**설정 방법**:
- **Name**: `SUPABASE_URL`
- **Value**: `https://your-project-id.supabase.co`

**현재 상태**: 프로젝트에 주석 처리됨 (향후 사용 예정)

---

### 5. SUPABASE_SERVICE_ROLE_KEY (향후 사용)

**설명**: Supabase Service Role 키 (서버 사이드 전용)

**발급 방법**:

1. Supabase Dashboard → 프로젝트 선택
2. **Settings** → **API** 이동
3. **Project API keys** 섹션에서 **service_role** 키 복사

**설정 방법**:
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx`

**주의사항**:
- ⚠️ Service Role 키는 **절대 클라이언트에 노출하지 마세요**
- ⚠️ 모든 Row Level Security (RLS)를 우회하는 강력한 권한
- ⚠️ 서버 사이드에서만 사용

---

### 6. SUPABASE_ANON_KEY (향후 사용)

**설명**: Supabase Anonymous 키 (클라이언트 사이드용)

**발급 방법**:

1. Supabase Dashboard → 프로젝트 선택
2. **Settings** → **API** 이동
3. **Project API keys** 섹션에서 **anon** 키 복사

**설정 방법**:
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx`

**주의사항**:
- ✅ 클라이언트에 노출되어도 안전 (Row Level Security로 보호)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 설정 가능

---

## 🚀 GitHub Actions Workflow 예제

`.github/workflows/deploy.yml` 파일 예시:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          NEXT_PUBLIC_USE_MOCK: ${{ secrets.NEXT_PUBLIC_USE_MOCK }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**추가 필요 Secrets** (Vercel 배포 시):
- `VERCEL_TOKEN`: Vercel 액세스 토큰
- `VERCEL_ORG_ID`: Vercel Organization ID
- `VERCEL_PROJECT_ID`: Vercel Project ID

---

## ✅ 설정 확인 체크리스트

### 프로덕션 배포 전 확인사항

- [ ] `NEXT_PUBLIC_USE_MOCK=false` 설정됨
- [ ] `OPENAI_API_KEY` 정상적으로 설정됨
- [ ] OpenAI API 키 유효성 확인 ([API 테스트](https://platform.openai.com/playground))
- [ ] OpenAI 월별 사용량 제한 설정됨
- [ ] `.env.local` 파일이 `.gitignore`에 포함됨
- [ ] GitHub Secrets에 민감 정보가 안전하게 저장됨
- [ ] 로컬 `.env.local`과 GitHub Secrets 값 일치 확인

### 배포 후 확인사항

- [ ] 프로덕션 환경에서 API 정상 동작 확인
- [ ] OpenAI API 호출 성공 여부 확인
- [ ] 에러 로그 모니터링 (Vercel Logs, Sentry 등)
- [ ] OpenAI API 사용량 모니터링

---

## 🔍 트러블슈팅

### 문제 1: "OpenAI API 키가 설정되지 않았습니다" 에러

**원인**: `OPENAI_API_KEY` Secret이 설정되지 않았거나 잘못됨

**해결 방법**:
1. GitHub Repository → Settings → Secrets and variables → Actions
2. `OPENAI_API_KEY`가 정확히 설정되었는지 확인
3. 키 값 앞뒤 공백 제거 확인
4. 새로운 키로 재생성 후 재설정

---

### 문제 2: GitHub Actions에서 빌드 실패

**원인**: 환경 변수가 workflow에 전달되지 않음

**해결 방법**:

`.github/workflows/deploy.yml` 파일에서 `env` 섹션 확인:

```yaml
env:
  NEXT_PUBLIC_USE_MOCK: ${{ secrets.NEXT_PUBLIC_USE_MOCK }}
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

---

### 문제 3: OpenAI API Rate Limit 초과

**원인**: API 호출 횟수가 제한을 초과함

**해결 방법**:
1. [OpenAI Usage Dashboard](https://platform.openai.com/usage)에서 사용량 확인
2. Rate Limit 업그레이드 또는 캐싱 전략 도입
3. 요청 빈도 제한 (Throttling) 구현

---

### 문제 4: Secret 값이 반영되지 않음

**원인**: GitHub Actions는 Secrets 변경 시 자동으로 재실행되지 않음

**해결 방법**:
1. Secret 값 변경 후 새로운 커밋 푸시
2. 또는 GitHub Actions에서 **Re-run jobs** 클릭

---

## 📚 추가 자료

### 공식 문서

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### 보안 가이드

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

## 📞 지원

- **이슈 트래킹**: [GitHub Issues](https://github.com/your-org/wanik-sejong/issues)
- **문의**: [프로젝트 담당자]

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-12-23
**작성자**: Claude Code (AI Assistant)
