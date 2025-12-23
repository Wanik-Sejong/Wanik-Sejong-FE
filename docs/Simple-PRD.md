# 완익세종 (完益世宗) - PRD

> AI 기반 진로-교과목 로드맵 추천 서비스  
> 해커톤용 간소화 버전 v1.0

---

## 1. 한 줄 요약

**"기이수성적 엑셀 업로드 → 희망 진로 입력 → AI가 학기별/방학별 로드맵 생성"**

---

## 2. 문제 & 솔루션

| 문제 | 솔루션 |
|------|--------|
| 진로에 뭘 들어야 할지 모름 | AI가 분석해서 추천 |
| 수강 순서를 모름 | 선후관계 고려해서 정리 |
| 방학에 뭐 할지 모름 | 강의/자격증/프로젝트 추천 |

---

## 3. 핵심 기능 (3개만)

### 기능 1: 엑셀 업로드 & 파싱
- 기이수성적조회.xlsx 파일 업로드
- 교과목명, 학점, 성적 자동 추출

### 기능 2: 진로 입력
- 희망 진로 텍스트로 입력
- 예: "AI 엔지니어", "백엔드 개발자"

### 기능 3: AI 로드맵 생성
- LLM에게 이수 과목 + 희망 진로 전달
- 학기별/방학별 할 일 받아서 표시

---

## 4. AI 사용 방식 (심플 버전)

### 한 번의 LLM 호출로 끝!

```
[입력]
- 이수 과목 목록 (엑셀에서 파싱)
- 희망 진로
- 남은 학기 수

[LLM에게 보내는 프롬프트]
"
너는 대학생 진로 상담사야.

학생 정보:
- 학과: 컴퓨터공학과  
- 이수 과목: 자료구조, 알고리즘, 딥러닝, 데이터베이스...
- 희망 진로: AI 엔지니어
- 남은 학기: 3학기

다음 형식으로 로드맵을 만들어줘:

## 2025 여름방학
- [ ] 할 일 1
- [ ] 할 일 2

## 2025 2학기  
- [ ] 수강할 과목
- [ ] 비교과 활동

## 2025 겨울방학
- [ ] 할 일

...
"

[출력]
→ 마크다운 형태의 로드맵 텍스트
→ 그대로 화면에 렌더링
```

### 끝. 이게 전부임.

---

## 5. 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React + Tailwind (또는 Thymeleaf) |
| Backend | **Spring Boot 3.x** + Java 17 |
| AI | OpenAI API 또는 Claude API (RestTemplate/WebClient) |
| DB | H2 (개발) / MySQL or PostgreSQL |
| 엑셀 파싱 | Apache POI |
| 배포 | AWS EC2 / Railway / Heroku |

### Spring Boot 의존성
```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'  // 또는 React 별도
    implementation 'org.apache.poi:poi-ooxml:5.2.5'  // 엑셀 파싱
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.h2database:h2'
    
    // LLM 호출용
    implementation 'org.springframework.boot:spring-boot-starter-webflux'  // WebClient
}
```

---

## 6. 데이터 흐름

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   엑셀 파일   │ ──→ │  Apache POI  │ ──→ │  LLM 호출    │
│   업로드     │     │  파싱        │     │  (WebClient) │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │  로드맵 출력  │
                                          │  (마크다운)   │
                                          └──────────────┘
```

---

## 6-1. Spring Boot 핵심 코드 예시

### Controller
```java
@RestController
@RequestMapping("/api")
public class RoadmapController {
    
    @Autowired
    private RoadmapService roadmapService;
    
    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadExcel(@RequestParam MultipartFile file) {
        List<String> courses = roadmapService.parseExcel(file);
        return ResponseEntity.ok(courses);
    }
    
    @PostMapping("/generate")
    public ResponseEntity<String> generateRoadmap(@RequestBody RoadmapRequest request) {
        String roadmap = roadmapService.generateRoadmap(request);
        return ResponseEntity.ok(roadmap);
    }
}
```

### Service - 엑셀 파싱
```java
@Service
public class RoadmapService {
    
    public List<String> parseExcel(MultipartFile file) {
        List<String> courses = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (int i = 3; i <= sheet.getLastRowNum(); i++) {  // 3번째 행부터
                Row row = sheet.getRow(i);
                if (row != null) {
                    Cell cell = row.getCell(4);  // 교과목명 컬럼
                    if (cell != null) {
                        courses.add(cell.getStringCellValue());
                    }
                }
            }
        }
        return courses;
    }
}
```

### Service - LLM 호출
```java
@Service
public class LLMService {
    
    private final WebClient webClient;
    
    public LLMService() {
        this.webClient = WebClient.builder()
            .baseUrl("https://api.openai.com/v1")
            .defaultHeader("Authorization", "Bearer " + API_KEY)
            .build();
    }
    
    public String callLLM(String prompt) {
        Map<String, Object> body = Map.of(
            "model", "gpt-4o",
            "messages", List.of(Map.of("role", "user", "content", prompt))
        );
        
        return webClient.post()
            .uri("/chat/completions")
            .bodyValue(body)
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}
```

### DTO
```java
@Data
public class RoadmapRequest {
    private List<String> courses;    // 이수 과목
    private String career;           // 희망 진로
    private int remainingSemesters;  // 남은 학기
}
```

---

## 7. 화면 구성 (3개)

### 화면 1: 업로드
```
┌─────────────────────────────┐
│                             │
│    📁 엑셀 파일 업로드       │
│    (드래그 앤 드롭)          │
│                             │
│    [업로드하기]              │
└─────────────────────────────┘
```

### 화면 2: 진로 입력
```
┌─────────────────────────────┐
│  이수 과목: 23개 확인됨 ✓    │
│                             │
│  희망 진로: [AI 엔지니어  ]  │
│  남은 학기: [3학기 ▼]        │
│                             │
│    [로드맵 생성하기]         │
└─────────────────────────────┘
```

### 화면 3: 로드맵 결과
```
┌─────────────────────────────┐
│  🎯 AI 엔지니어 로드맵       │
├─────────────────────────────┤
│  ## 2025 여름방학            │
│  - [ ] Coursera ML 강의      │
│  - [ ] 토이 프로젝트         │
│                             │
│  ## 2025 2학기              │
│  - [ ] 기계학습 수강         │
│  - [ ] AI 학회 가입          │
│                             │
│  ## 2025 겨울방학            │
│  - [ ] 코딩테스트 준비       │
│  ...                        │
└─────────────────────────────┘
```

---

## 8. 해커톤 개발 일정

| 시간 | 작업 |
|------|------|
| 0-3h | 프로젝트 셋업, 파일 업로드 UI |
| 3-6h | 엑셀 파싱 로직 |
| 6-12h | LLM 연동, 로드맵 생성 |
| 12-18h | 결과 화면 UI |
| 18-24h | 디자인 정리, 버그 수정 |
| 24h+ | 발표 준비 |

---

## 9. MVP 체크리스트

- [ ] 엑셀 파일 업로드 됨
- [ ] 과목명 파싱 됨
- [ ] 진로 입력 가능
- [ ] LLM 호출해서 로드맵 받아옴
- [ ] 화면에 로드맵 표시됨

**이거 5개만 되면 MVP 완성!**

---

## 10. 프롬프트 예시 (복붙용)

```
당신은 대학생 진로 설계 전문가입니다.

[학생 정보]
- 전공: {department}
- 이수한 과목들: {courses}
- 희망 진로: {career}
- 남은 학기: {remaining}학기

위 정보를 바탕으로 학기별, 방학별 로드맵을 만들어주세요.

각 기간마다 추천 항목:
- 학기: 수강할 과목, 참여할 활동
- 방학: 온라인 강의, 자격증, 프로젝트, 코딩테스트 준비

마크다운 체크리스트 형식으로 작성해주세요.
각 항목에 왜 추천하는지 한 줄로 설명해주세요.
```

---

## 부록: 파싱할 엑셀 구조

```
년도 | 학기 | 학수번호 | 교과목명 | 이수구분 | 학점 | 등급
2025 | 1학기 | 004310 | 운영체제 | 전필 | 3 | C+
2025 | 1학기 | 010881 | 딥러닝 | 전선 | 3 | A0
...
```

**파싱할 것: 교과목명, 이수구분, 등급**  
(나머지는 무시해도 됨)

---
