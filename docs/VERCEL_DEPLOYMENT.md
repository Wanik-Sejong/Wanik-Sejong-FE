# Vercel 배포 가이드

## ✅ 배포 완료

프로젝트가 Vercel에 성공적으로 배포되었습니다!

### 배포 URL
- **Production URL**: https://wanik-sejong-ctidzy8gx-em-h20s-projects.vercel.app

---

## 🔧 환경 변수 설정 (중요!)

배포된 앱이 정상 작동하려면 Vercel 대시보드에서 환경 변수를 설정해야 합니다.

### 1. Vercel 대시보드 접속

1. https://vercel.com/dashboard 접속
2. `wanik-sejong` 프로젝트 선택
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **Environment Variables** 선택

### 2. 필수 환경 변수 추가

다음 환경 변수를 추가하세요:

#### GEMINI_API_KEY
```
Name: GEMINI_API_KEY
Value: AIzaSyAakcMPi69qTs19xeAcA6sVTL7UM8Z2RRc
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### NEXT_PUBLIC_USE_MOCK
```
Name: NEXT_PUBLIC_USE_MOCK
Value: false
Environments: ✅ Production, ✅ Preview
```

#### NEXT_PUBLIC_API_URL
```
Name: NEXT_PUBLIC_API_URL
Value: https://hackathon.yeo-li.com
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### 3. 재배포

환경 변수 추가 후 자동으로 재배포됩니다. 또는 수동으로 재배포하려면:

```bash
vercel --prod
```

---

## 🚀 빠른 배포 명령어

### 프로덕션 배포
```bash
vercel --prod
```

### 프리뷰 배포 (테스트용)
```bash
vercel
```

### 배포 상태 확인
```bash
vercel ls
```

### 로그 확인
```bash
vercel logs
```

---

## 📋 배포 체크리스트

배포 전 확인 사항:

- [x] `npm run build` 로컬에서 성공
- [x] Vercel CLI 설치 및 로그인
- [x] 프로덕션 배포 실행
- [ ] Vercel 대시보드에서 환경 변수 설정
- [ ] 배포된 URL 접속하여 동작 확인
- [ ] Excel 업로드 테스트
- [ ] AI 로드맵 생성 테스트

---

## 🔍 트러블슈팅

### 1. "GEMINI_API_KEY is not defined" 에러

**원인**: 환경 변수가 설정되지 않음

**해결**:
1. Vercel 대시보드 → Settings → Environment Variables
2. `GEMINI_API_KEY` 추가
3. 재배포 (자동 또는 `vercel --prod`)

### 2. "API call failed" 에러

**원인**: `NEXT_PUBLIC_API_URL`이 잘못 설정됨

**해결**:
1. 환경 변수에서 `NEXT_PUBLIC_API_URL` 확인
2. 백엔드 서버 URL이 올바른지 확인 (https://hackathon.yeo-li.com)
3. 백엔드 서버가 실행 중인지 확인

### 3. 빌드 실패

**원인**: TypeScript 타입 에러 또는 의존성 문제

**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 체크
npx tsc --noEmit

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 🌐 도메인 연결 (선택사항)

커스텀 도메인을 연결하려면:

1. Vercel 대시보드 → Settings → Domains
2. 도메인 입력 (예: wanik-sejong.com)
3. DNS 설정 업데이트 (A Record 또는 CNAME)
4. SSL 자동 발급 대기 (보통 1-2분)

---

## 📊 배포 통계

- **빌드 시간**: ~47초
- **배포 시간**: ~1분
- **번들 크기**: ~4.3MB
- **Node.js 버전**: 20.x (Vercel 기본값)

---

## 🔗 유용한 링크

- **프로젝트 대시보드**: https://vercel.com/em-h20s-projects/wanik-sejong
- **배포 로그**: https://vercel.com/em-h20s-projects/wanik-sejong/deployments
- **환경 변수 설정**: https://vercel.com/em-h20s-projects/wanik-sejong/settings/environment-variables
- **도메인 설정**: https://vercel.com/em-h20s-projects/wanik-sejong/settings/domains

---

## 💡 프로 팁

1. **브랜치 자동 배포**: `main` 브랜치에 푸시하면 자동으로 프로덕션 배포
2. **프리뷰 배포**: 다른 브랜치에 푸시하면 프리뷰 URL 생성
3. **롤백**: 대시보드에서 이전 배포로 즉시 롤백 가능
4. **Analytics**: Vercel Analytics로 방문자 추적 (유료)
5. **Edge Functions**: API Routes가 자동으로 Edge에 배포

---

## 🎯 다음 단계

1. ✅ Vercel 대시보드에서 환경 변수 설정
2. ✅ 배포된 URL 접속하여 테스트
3. ✅ 팀원들과 URL 공유
4. ✅ 발표 자료에 배포 URL 추가
5. ✅ (선택) 커스텀 도메인 연결

**배포 완료! 🎉**
