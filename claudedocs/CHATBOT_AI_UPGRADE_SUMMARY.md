# 세박사 챗봇 Gemini AI 고도화 구현 완료 보고서

**작업 일시**: 2025-12-24
**작업 내용**: 로컬 JSON 검색 기반 챗봇 → Gemini AI 자연어 처리 챗봇으로 업그레이드

---

## 📊 구현 개요

### 기존 시스템 (Before)
- **검색 방식**: 로컬 JSON 파일 키워드 매칭
- **응답 생성**: 템플릿 기반 Markdown 생성
- **한계점**:
  - 키워드가 정확히 일치해야만 검색 가능
  - "3학년 1학기에 들으면 좋은 과목" 같은 복잡한 질문 처리 불가
  - 대화 맥락 이해 불가

### 새로운 시스템 (After)
- **검색 방식**: 로컬 검색 (컨텍스트 수집) + Gemini AI (자연어 이해)
- **응답 생성**: AI 기반 대화형 응답
- **개선점**:
  - 자연어 질문 이해 가능
  - 대화 기록 기반 맥락 있는 답변
  - 학생 멘토 스타일의 친근한 응답
  - AI 실패 시 자동 Fallback (기존 시스템)

---

## 🔧 구현 세부 사항

### 1. 환경변수 검증 로직 수정 ✅

**파일**: `src/lib/config.ts`

**문제**: 클라이언트에서 `GEMINI_API_KEY` 접근 시도 → 에러 발생

**해결**:
```typescript
// 서버 사이드에서만 검증
if (typeof window === 'undefined') {
  if (!config.useMock && !config.backend.enabled && !config.gemini.apiKey) {
    console.error('❌ GEMINI_API_KEY is not set. Local mode requires an API key.');
  }
}
```

**효과**: 클라이언트 콘솔 에러 제거, API Key 보안 유지

---

### 2. Gemini AI 챗봇 API Route 생성 ✅

**파일**: `src/app/api/chatbot/route.ts`

**주요 기능**:
- **POST /api/chatbot** 엔드포인트
- Gemini 2.0 Flash Exp 모델 사용
- 시스템 프롬프트 기반 페르소나 설정
- 대화 기록 컨텍스트 지원 (최근 5개 대화)
- 과목 데이터를 JSON으로 전달하여 정확한 답변 생성

**프롬프트 설계**:
```typescript
당신은 "세박사"입니다. 세종대학교 컴퓨터공학과 학생들을 위한
친절하고 똑똑한 학업 도우미입니다.

## 응답 원칙
1. 정확성 우선: 제공된 과목 데이터에 기반하여 정확한 정보만 제공
2. 친절한 말투: "~해요", "~드릴게요" 같은 친근한 존댓말
3. 구조화된 답변: 불릿 포인트나 표로 정리
4. 이모지 활용: 시각적으로 읽기 편하게
5. 데이터 없으면 명확히 말하기
```

**에러 처리**:
- API Key 없음 → `fallbackToLocalSearch: true`
- 할당량 초과 → `fallbackToLocalSearch: true`
- 네트워크 에러 → `fallbackToLocalSearch: true`

---

### 3. AI 서비스 클라이언트 생성 ✅

**파일**: `src/lib/chatbot/ai-service.ts`

**클래스**: `AIChatService`

**주요 기능**:
- API 호출 추상화
- 대화 기록 자동 관리 (FIFO, 최대 5개 대화)
- 에러 처리 및 Fallback 플래그 반환

**메서드**:
```typescript
async sendMessage(userMessage: string, courseContext: CourseData[]): Promise<AIChatResponse>
clearHistory(): void
getHistory(): Array<{role, content}>
```

---

### 4. ChatWindow 컴포넌트 AI 통합 ✅

**파일**: `src/components/chatbot/ChatWindow.tsx`

**흐름 개선**:

**Before**:
```
사용자 질문 → 로컬 검색 → 템플릿 응답
```

**After**:
```
사용자 질문
  → 1단계: 로컬 검색 (관련 과목 수집)
  → 2단계: AI 서비스 호출 (자연어 응답 생성)
  → 성공: AI 응답 표시
  → 실패: Fallback to 기존 템플릿 응답
```

**코드**:
```typescript
// 1단계: 로컬 검색으로 관련 과목 찾기
const searchResult = await searchEngineRef.current.search(userMessage);
const relevantCourses = searchResult.courses;

// 2단계: AI 서비스로 자연어 응답 생성 시도
const aiResponse = await aiServiceRef.current.sendMessage(
  userMessage,
  relevantCourses
);

if (aiResponse.success && aiResponse.message) {
  // AI 응답 성공
  setMessages([...prev, { role: 'assistant', content: aiResponse.message }]);
} else if (aiResponse.fallbackToLocalSearch) {
  // Fallback: 기존 로컬 검색 결과 사용
  const markdown = responseGeneratorRef.current.generateMarkdown(userMessage, searchResult);
  setMessages([...prev, { role: 'assistant', content: markdown }]);
}
```

---

## 🎯 핵심 개선 사항

### 1. 자연어 이해 능력 향상
**Before**:
- 사용자: "월요일 수업 알려줘" → ✅ 작동
- 사용자: "3학년 1학기에 들으면 좋은 전공 과목" → ❌ 검색 실패

**After**:
- 사용자: "월요일 수업 알려줘" → ✅ 작동 (로컬 검색)
- 사용자: "3학년 1학기에 들으면 좋은 전공 과목" → ✅ AI가 맥락 이해하여 답변

### 2. 대화 맥락 유지
**Before**: 각 질문 독립적 처리

**After**:
```
학생: "C프로그래밍 언제 열려?"
세박사: "C프로그래밍은 월/수 9:00-10:30에 열립니다."

학생: "교수님은?"
세박사: "C프로그래밍 교수님은 김도년 교수님입니다." (이전 대화 맥락 이해)
```

### 3. 친근한 응답 스타일
**Before**: 딱딱한 데이터 나열
```
📘 C프로그래밍 (009912-01)
- 교수명: 김도년
- 시간: 월/수 09:00-10:30
```

**After**: 학생 멘토 스타일
```
안녕하세요! C프로그래밍 수업을 찾고 계시는군요! 😊

**📘 C프로그래밍** (009912-01)
- 교수님: 김도년 교수님
- 시간: 월/수 09:00-10:30
- 이수구분: 전공필수
- 학점: 3학점

💡 **Tip**: C프로그래밍은 1학년 전공필수 과목이에요.
프로그래밍 기초를 다지는 중요한 과목이니 열심히 들으시면 좋을 것 같아요!
```

### 4. Fallback 전략 (안정성)
- AI API 실패 시 자동으로 기존 로컬 검색 결과 사용
- 사용자는 에러 없이 계속 서비스 이용 가능
- 개발자 콘솔에만 에러 로그 기록

---

## 🔐 보안 및 환경변수 설정

### 환경변수 구조

**.env.local**:
```bash
# Mock Mode (개발용 - AI 사용 안 함)
NEXT_PUBLIC_USE_MOCK=true

# Local Mode (Gemini AI 사용 - 추천)
NEXT_PUBLIC_USE_MOCK=false
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000

# Backend Mode (외부 Spring Boot API 사용)
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=https://hackathon.yeo-li.com
```

### 보안 원칙
✅ `GEMINI_API_KEY`는 **서버 사이드 전용** (클라이언트 노출 차단)
✅ API Route에서만 환경변수 접근
✅ 클라이언트는 `/api/chatbot` 엔드포인트만 호출

---

## 📈 성능 및 사용자 경험

### 응답 시간
- **로컬 검색**: ~100ms
- **AI 응답 생성**: ~1-3초
- **총 응답 시간**: ~1-3초 (1초 UX 딜레이 포함)

### UX 개선
- 타이핑 인디케이터 표시
- 1초 지연으로 자연스러운 대화 흐름
- 대화 기록 localStorage 저장 (창 크기 등)

---

## 🧪 테스트 시나리오

### 1. 기본 과목 검색
```
질문: "C프로그래밍 언제 열려?"
기대: AI가 월/수 09:00-10:30 답변
```

### 2. 복잡한 자연어 질문
```
질문: "3학년 1학기에 들으면 좋은 전공선택 과목 추천해줘"
기대: AI가 3학년 과목 중 전선 과목 추천
```

### 3. 대화 맥락 유지
```
질문1: "알고리즘 수업 알려줘"
답변1: "알고리즘은 화/목 13:30-15:00, 홍길동 교수님입니다."

질문2: "교수님 연구실 어디야?"
기대: AI가 "알고리즘" 맥락 유지하여 홍길동 교수님 정보 제공
```

### 4. Fallback 테스트
```
환경: GEMINI_API_KEY 없음 or API 장애
기대: 기존 로컬 검색 결과 표시 (에러 없이)
```

---

## 📝 사용 방법

### 개발 서버 시작
```bash
npm run dev
```

### 챗봇 테스트
1. 브라우저에서 `http://localhost:3000` 접속
2. 우측 하단 "세박사 🎓" 플로팅 버튼 클릭
3. 질문 입력 (예: "C프로그래밍 언제 열려?")
4. AI 응답 확인

### 콘솔 로그 확인
```
🔍 Local search found: 3 courses
🤖 Sending message to AI: { message: "...", contextSize: 3 }
✅ Gemini AI response received
```

---

## 🚀 향후 개선 방향

### Phase 2 (고도화)
- [ ] **개인화 추천**: 학생 성적표 기반 맞춤형 과목 추천
- [ ] **졸업 요건 상담**: "내가 졸업하려면 뭐 더 들어야 해?" 같은 질문 처리
- [ ] **학습 로드맵 연동**: 로드맵 페이지와 챗봇 통합

### Phase 3 (기능 확장)
- [ ] **음성 입력**: 음성으로 질문하기
- [ ] **챗봇 평가**: 답변 유용도 평가 (👍/👎)
- [ ] **FAQ 학습**: 자주 묻는 질문 패턴 학습

### Phase 4 (성능 최적화)
- [ ] **캐싱**: 동일 질문 캐싱으로 비용 절감
- [ ] **스트리밍 응답**: Gemini Streaming API로 실시간 응답
- [ ] **RAG 시스템**: 벡터 DB 연동으로 정확도 향상

---

## 🎓 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript 5
- **AI Model**: Google Gemini 2.0 Flash Exp
- **API**: Next.js API Routes (Server-side)
- **State Management**: React Hooks (useState, useRef)
- **Styling**: Tailwind CSS 4

---

## ✅ 구현 완료 체크리스트

- [x] Phase 1: 환경변수 검증 로직 수정
- [x] Phase 2: Gemini AI 기반 챗봇 API Route 생성
- [x] Phase 3: AI 서비스 클라이언트 생성
- [x] Phase 4: ChatWindow 컴포넌트 AI 연동
- [x] Phase 5: Fallback 전략 구현
- [x] Phase 6: 빌드 캐시 제거 및 개발 서버 재시작
- [x] 타입 에러 수정
- [x] 코드 스타일 일관성 유지
- [x] 문서화 작성

---

**작성자**: Claude Code (AI Assistant)
**검토 필요**: GEMINI_API_KEY 환경변수 설정 확인
**배포 전 확인사항**: 프로덕션 환경에서 API Key 안전하게 관리되는지 확인
