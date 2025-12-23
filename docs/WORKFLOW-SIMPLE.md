# 완익세종 MVP 워크플로우 (24시간 해커톤)

> **"엑셀 업로드 → 진로 입력 → AI 로드맵 생성"**
> 3가지 핵심 기능만 완성하면 끝!

---

## 📋 목차

1. [MVP 체크리스트](#mvp-체크리스트-5개)
2. [시간별 작업 계획](#시간별-작업-계획-24시간)
3. [기술 스택 (현재 프로젝트 기준)](#기술-스택)
4. [Phase 1: 프로젝트 셋업 (0-3시간)](#phase-1-프로젝트-셋업-0-3시간)
5. [Phase 2: 엑셀 파싱 (3-6시간)](#phase-2-엑셀-파싱-3-6시간)
6. [Phase 3: AI 로드맵 생성 (6-12시간)](#phase-3-ai-로드맵-생성-6-12시간)
7. [Phase 4: UI 완성 (12-18시간)](#phase-4-ui-완성-12-18시간)
8. [Phase 5: 마무리 (18-24시간)](#phase-5-마무리-18-24시간)
9. [핵심 코드 스니펫](#핵심-코드-스니펫)

---

## MVP 체크리스트 (5개)

```yaml
필수_기능:
  - [ ] ✅ 엑셀 파일 업로드 됨
  - [ ] ✅ 과목명 파싱 됨
  - [ ] ✅ 진로 입력 가능
  - [ ] ✅ LLM 호출해서 로드맵 받아옴
  - [ ] ✅ 화면에 로드맵 표시됨

추가_기능_나중에:
  - [ ] 로드맵 수정 기능
  - [ ] PDF 내보내기
  - [ ] 여러 진로 비교
```

**이 5개만 되면 MVP 완성! 🎯**

---

## 시간별 작업 계획 (24시간)

| 시간 | Phase | 핵심 작업 | 산출물 |
|------|-------|----------|--------|
| **0-3h** | Phase 1 | 프로젝트 셋업, 파일 업로드 UI | 파일 업로드 화면 동작 |
| **3-6h** | Phase 2 | 엑셀 파싱 로직 (Apache POI) | 과목명 추출 API |
| **6-12h** | Phase 3 | LLM 연동, 로드맵 생성 | AI 로드맵 생성 API |
| **12-18h** | Phase 4 | 결과 화면 UI, 마크다운 렌더링 | 로드맵 표시 화면 |
| **18-24h** | Phase 5 | 디자인 정리, 버그 수정, 발표 준비 | 완성된 데모 |

---

## 기술 스택

### 현재 프로젝트 환경
```yaml
Frontend:
  Framework: Next.js 16 (App Router)
  Language: TypeScript
  Styling: Tailwind CSS 4
  Colors: Sejong Brand Colors (완익세종 컬러 시스템)

Backend:
  선택지_1: Next.js API Routes (추천, 간단함)
  선택지_2: FastAPI (Python)
  선택지_3: Spring Boot (Java)

AI:
  Primary: OpenAI API (gpt-4o)
  Fallback: Claude API (claude-3-5-sonnet)

File_Parsing:
  선택지_1: xlsx 라이브러리 (Node.js) ⭐ 추천
  선택지_2: Apache POI (Java)
  선택지_3: pandas + openpyxl (Python)

Database:
  개발: 로컬 JSON 파일 또는 메모리 저장 (빠름)
  프로덕션: Supabase PostgreSQL (이미 설정됨)

Deployment:
  Frontend: Vercel (자동 배포)
  Backend: Vercel Serverless Functions (추천)
```

### 추천: Next.js Full-Stack 접근
```
이유:
✅ Frontend + Backend 한 프로젝트에서 관리
✅ Vercel 배포 자동화
✅ TypeScript로 통일
✅ API Routes로 간단히 구현
```

---

## Phase 1: 프로젝트 셋업 (0-3시간)

### 1.1 의존성 설치

```bash
cd frontend  # 또는 프로젝트 루트

# 엑셀 파싱
npm install xlsx

# AI API
npm install openai

# 마크다운 렌더링
npm install react-markdown remark-gfm

# 파일 업로드
npm install react-dropzone
```

### 1.2 환경 변수 설정

**`.env.local`**
```bash
# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Claude API (백업용)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (이미 설정됨)
NEXT_PUBLIC_SUPABASE_URL=https://twbakqeemdcaljkymywk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1.3 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 홈 (업로드 화면)
│   ├── roadmap/
│   │   └── page.tsx                # 로드맵 결과 화면
│   └── api/
│       ├── parse-excel/
│       │   └── route.ts            # 엑셀 파싱 API
│       └── generate-roadmap/
│           └── route.ts            # AI 로드맵 생성 API
├── components/
│   ├── FileUpload.tsx              # 파일 업로드 컴포넌트
│   ├── CareerInput.tsx             # 진로 입력 폼
│   └── RoadmapDisplay.tsx          # 로드맵 표시 컴포넌트
├── lib/
│   ├── openai.ts                   # OpenAI 클라이언트
│   └── types.ts                    # TypeScript 타입
└── styles/
    └── colors.ts                   # 세종대 컬러 (이미 생성됨)
```

### 1.4 파일 업로드 UI 구현

**`src/components/FileUpload.tsx`**

```typescript
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SejongColors } from '@/styles/colors';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export function FileUpload({ onFileSelected }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-all duration-200
        ${isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 bg-white hover:border-primary-400'
        }
      `}
      style={{
        borderColor: isDragActive ? SejongColors.primary : undefined,
        backgroundColor: isDragActive ? SejongColors.primary50 : undefined
      }}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        {isDragActive ? (
          <p className="text-primary-600 font-medium">
            파일을 여기에 놓으세요 📂
          </p>
        ) : (
          <div>
            <p className="text-gray-900 font-medium mb-1">
              기이수성적조회 엑셀 파일 업로드
            </p>
            <p className="text-sm text-gray-500">
              클릭하거나 드래그 앤 드롭 (.xlsx, .xls)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 1.5 홈 페이지 (업로드 화면)

**`src/app/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { SejongColors } from '@/styles/colors';

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [courses, setCourses] = useState<string[]>([]);

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/parse-excel', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('파싱 실패');

      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      alert('파일 파싱 실패: ' + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: SejongColors.primary }}
          >
            완익세종 🎓
          </h1>
          <p className="text-gray-600">
            AI 기반 진로-교과목 로드맵 추천 서비스
          </p>
        </div>

        {/* 파일 업로드 */}
        {!courses.length && (
          <FileUpload onFileSelected={handleFileSelected} />
        )}

        {/* 로딩 */}
        {uploading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-500" />
            <p className="mt-4 text-gray-600">파일 분석 중...</p>
          </div>
        )}

        {/* 파싱 결과 */}
        {courses.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">
              ✅ 이수 과목: {courses.length}개 확인됨
            </h2>
            <div className="bg-gray-50 rounded p-4 max-h-40 overflow-y-auto mb-6">
              {courses.slice(0, 10).map((course, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  {course}
                </div>
              ))}
              {courses.length > 10 && (
                <div className="text-sm text-gray-500 mt-2">
                  외 {courses.length - 10}개...
                </div>
              )}
            </div>

            <button
              onClick={() => {
                sessionStorage.setItem('courses', JSON.stringify(courses));
                router.push('/roadmap');
              }}
              className="w-full py-3 rounded-lg font-medium text-white transition-colors"
              style={{
                backgroundColor: SejongColors.primary,
              }}
            >
              진로 입력하고 로드맵 생성하기 →
            </button>
          </div>
        )}

        {/* 사용 가이드 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📖 사용 방법</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. 세종대학교 포털 → 수업 → 기이수성적조회</li>
            <li>2. 엑셀 다운로드 버튼 클릭</li>
            <li>3. 다운로드한 파일을 위에 업로드</li>
            <li>4. 희망 진로 입력 후 로드맵 생성!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 2: 엑셀 파싱 (3-6시간)

### 2.1 엑셀 파싱 API

**`src/app/api/parse-excel/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다' },
        { status: 400 }
      );
    }

    // 파일을 ArrayBuffer로 읽기
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // XLSX 파싱
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // JSON으로 변환
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // 헤더 3행 스킵, 과목명 추출
    const courses: string[] = [];

    for (let i = 3; i < data.length; i++) {
      const row = data[i] as any[];
      if (row && row.length > 4) {
        const courseName = row[4]; // 교과목명은 5번째 컬럼 (index 4)
        if (courseName && typeof courseName === 'string') {
          courses.push(courseName.trim());
        }
      }
    }

    // 중복 제거
    const uniqueCourses = Array.from(new Set(courses));

    return NextResponse.json({
      success: true,
      courses: uniqueCourses,
      count: uniqueCourses.length
    });

  } catch (error) {
    console.error('엑셀 파싱 에러:', error);
    return NextResponse.json(
      { error: '엑셀 파싱 실패' },
      { status: 500 }
    );
  }
}
```

### 2.2 TypeScript 타입 정의

**`src/lib/types.ts`**

```typescript
export interface RoadmapRequest {
  courses: string[];
  career: string;
  remainingSemesters: number;
  department?: string;
}

export interface RoadmapResponse {
  roadmap: string;  // 마크다운 형식
  success: boolean;
}

export interface ParsedCourse {
  courseName: string;
  category?: string;
  grade?: string;
}
```

---

## Phase 3: AI 로드맵 생성 (6-12시간)

### 3.1 OpenAI 클라이언트 설정

**`src/lib/openai.ts`**

```typescript
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRoadmap(
  courses: string[],
  career: string,
  remainingSemesters: number,
  department: string = '컴퓨터공학과'
): Promise<string> {
  const prompt = `당신은 대학생 진로 설계 전문가입니다.

[학생 정보]
- 전공: ${department}
- 이수한 과목들: ${courses.join(', ')}
- 희망 진로: ${career}
- 남은 학기: ${remainingSemesters}학기

위 정보를 바탕으로 학기별, 방학별 로드맵을 만들어주세요.

각 기간마다 추천 항목:
- 학기: 수강할 과목, 참여할 활동, 학회/동아리
- 방학: 온라인 강의 (구체적인 강의명과 플랫폼), 자격증, 프로젝트, 코딩테스트 준비, 인턴십

**마크다운 체크리스트 형식으로 작성해주세요.**
각 항목에 왜 추천하는지 한 줄로 설명해주세요.

형식 예시:
## 2025년 여름방학
- [ ] Coursera "Machine Learning Specialization" 수강 - ML 기초 다지기
- [ ] 토이 프로젝트: 추천 시스템 구현 - 포트폴리오 구축

## 2025년 2학기
- [ ] 기계학습 수강 - AI 엔지니어 필수 과목
- [ ] AI 학회 가입 - 네트워킹 및 스터디
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '당신은 대학생 진로 설계 전문 상담사입니다. 학생의 현재 상황을 분석하여 구체적이고 실행 가능한 로드맵을 제공합니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const roadmap = response.choices[0]?.message?.content || '';
    return roadmap;

  } catch (error) {
    console.error('OpenAI API 에러:', error);
    throw new Error('로드맵 생성 실패');
  }
}
```

### 3.2 로드맵 생성 API

**`src/app/api/generate-roadmap/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateRoadmap } from '@/lib/openai';
import type { RoadmapRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: RoadmapRequest = await request.json();
    const { courses, career, remainingSemesters, department } = body;

    // 입력 검증
    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { error: '이수 과목 정보가 없습니다' },
        { status: 400 }
      );
    }

    if (!career) {
      return NextResponse.json(
        { error: '희망 진로를 입력해주세요' },
        { status: 400 }
      );
    }

    // AI 로드맵 생성
    const roadmap = await generateRoadmap(
      courses,
      career,
      remainingSemesters,
      department
    );

    return NextResponse.json({
      success: true,
      roadmap,
      metadata: {
        coursesCount: courses.length,
        career,
        remainingSemesters,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('로드맵 생성 에러:', error);
    return NextResponse.json(
      { error: '로드맵 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 처리 (CORS)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
```

---

## Phase 4: UI 완성 (12-18시간)

### 4.1 진로 입력 컴포넌트

**`src/components/CareerInput.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { SejongColors } from '@/styles/colors';

interface CareerInputProps {
  coursesCount: number;
  onGenerate: (career: string, semesters: number) => void;
  loading: boolean;
}

export function CareerInput({ coursesCount, onGenerate, loading }: CareerInputProps) {
  const [career, setCareer] = useState('');
  const [semesters, setSemesters] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (career.trim()) {
      onGenerate(career.trim(), semesters);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-green-600 mb-4">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">
            이수 과목 {coursesCount}개 확인됨
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            희망 진로 💼
          </label>
          <input
            type="text"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            placeholder="예: AI 엔지니어, 백엔드 개발자, 데이터 분석가"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            남은 학기 📅
          </label>
          <select
            value={semesters}
            onChange={(e) => setSemesters(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={1}>1학기</option>
            <option value={2}>2학기</option>
            <option value={3}>3학기</option>
            <option value={4}>4학기</option>
            <option value={5}>5학기</option>
            <option value={6}>6학기</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !career.trim()}
        className="w-full mt-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: SejongColors.primary }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            로드맵 생성 중...
          </span>
        ) : (
          '🚀 로드맵 생성하기'
        )}
      </button>
    </form>
  );
}
```

### 4.2 로드맵 표시 컴포넌트

**`src/components/RoadmapDisplay.tsx`**

```typescript
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SejongColors } from '@/styles/colors';

interface RoadmapDisplayProps {
  roadmap: string;
  career: string;
}

export function RoadmapDisplay({ roadmap, career }: RoadmapDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6 pb-6 border-b">
        <h1 className="text-2xl font-bold mb-2" style={{ color: SejongColors.primary }}>
          🎯 {career} 로드맵
        </h1>
        <p className="text-gray-600">
          AI가 생성한 맞춤형 학습 계획입니다
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mt-8 mb-4 pb-2 border-b-2"
                  style={{ borderColor: SejongColors.primary }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold mt-6 mb-3">
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul className="space-y-3 my-4">
                {children}
              </ul>
            ),
            li: ({ children }) => {
              const text = String(children);
              const isChecklist = text.includes('[ ]');

              return (
                <li className={`
                  ${isChecklist ? 'flex items-start gap-3' : ''}
                  text-gray-700
                `}>
                  {isChecklist && (
                    <input
                      type="checkbox"
                      className="mt-1 rounded"
                      style={{ accentColor: SejongColors.primary }}
                    />
                  )}
                  {children}
                </li>
              );
            },
            p: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4">
                {children}
              </p>
            ),
          }}
        >
          {roadmap}
        </ReactMarkdown>
      </div>

      <div className="mt-8 pt-6 border-t flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          📄 인쇄하기
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(roadmap)}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          📋 복사하기
        </button>
      </div>
    </div>
  );
}
```

### 4.3 로드맵 페이지

**`src/app/roadmap/page.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CareerInput } from '@/components/CareerInput';
import { RoadmapDisplay } from '@/components/RoadmapDisplay';

export default function RoadmapPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [career, setCareer] = useState('');

  useEffect(() => {
    // sessionStorage에서 과목 목록 가져오기
    const storedCourses = sessionStorage.getItem('courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      // 과목 정보가 없으면 홈으로
      router.push('/');
    }
  }, [router]);

  const handleGenerate = async (careerInput: string, semesters: number) => {
    setCareer(careerInput);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courses,
          career: careerInput,
          remainingSemesters: semesters,
          department: '컴퓨터공학과'
        })
      });

      if (!response.ok) throw new Error('로드맵 생성 실패');

      const data = await response.json();
      setRoadmap(data.roadmap);

    } catch (error) {
      alert('로드맵 생성 실패: ' + error);
    } finally {
      setLoading(false);
    }
  };

  if (!courses.length) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>로딩 중...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {!roadmap ? (
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">
              진로 정보 입력
            </h1>
            <CareerInput
              coursesCount={courses.length}
              onGenerate={handleGenerate}
              loading={loading}
            />
          </div>
        ) : (
          <div>
            <button
              onClick={() => setRoadmap(null)}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              ← 다시 생성하기
            </button>
            <RoadmapDisplay roadmap={roadmap} career={career} />
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Phase 5: 마무리 (18-24시간)

### 5.1 디자인 체크리스트

```yaml
UI_개선:
  - [ ] 세종대 컬러 시스템 일관성 확인
  - [ ] 반응형 디자인 (모바일 대응)
  - [ ] 로딩 상태 애니메이션
  - [ ] 에러 메시지 표시

UX_개선:
  - [ ] 파일 업로드 피드백
  - [ ] 진로 입력 자동완성 (선택사항)
  - [ ] 로드맵 체크박스 상호작용
  - [ ] 뒤로가기 버튼
```

### 5.2 버그 수정 체크리스트

```yaml
필수_테스트:
  - [ ] 엑셀 파일 업로드 테스트 (다양한 파일)
  - [ ] 파싱 결과 정확도 확인
  - [ ] AI API 에러 핸들링
  - [ ] 로드맵 마크다운 렌더링 확인
  - [ ] 모바일 화면 테스트

성능_최적화:
  - [ ] API 응답 시간 확인 (<5초)
  - [ ] 파일 크기 제한 확인
  - [ ] 로딩 상태 표시
```

### 5.3 배포

**Vercel 배포 (자동)**
```bash
# GitHub에 푸시하면 자동 배포
git add .
git commit -m "feat: MVP 완성"
git push origin main

# Vercel에서 자동으로 빌드 & 배포
```

**환경 변수 설정 (Vercel 대시보드)**
```
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
```

### 5.4 발표 준비

**데모 시나리오 (3분)**

1. **문제 소개 (30초)**
   - "대학생들이 진로에 맞는 과목 선택에 어려움을 겪습니다"

2. **솔루션 소개 (30초)**
   - "완익세종은 AI로 맞춤형 로드맵을 생성합니다"

3. **라이브 데모 (90초)**
   - 엑셀 파일 업로드 → 과목 확인
   - 진로 입력 (AI 엔지니어)
   - 로드맵 생성 & 결과 확인

4. **기술 스택 (30초)**
   - Next.js, OpenAI API, 세종대 브랜드 컬러 시스템

---

## 핵심 코드 스니펫

### AI 프롬프트 (복붙용)

```typescript
const ROADMAP_PROMPT = `당신은 대학생 진로 설계 전문가입니다.

[학생 정보]
- 전공: {department}
- 이수한 과목들: {courses}
- 희망 진로: {career}
- 남은 학기: {remainingSemesters}학기

위 정보를 바탕으로 학기별, 방학별 로드맵을 만들어주세요.

각 기간마다 추천 항목:
- 학기: 수강할 과목, 참여할 활동
- 방학: 온라인 강의, 자격증, 프로젝트, 코딩테스트 준비

마크다운 체크리스트 형식으로 작성해주세요.
각 항목에 왜 추천하는지 한 줄로 설명해주세요.`;
```

### 엑셀 파싱 핵심 로직

```typescript
// XLSX 파일 읽기
const workbook = XLSX.read(buffer, { type: 'buffer' });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// 헤더 3행 스킵, 과목명 추출 (5번째 컬럼)
const courses = data
  .slice(3)
  .map(row => row[4])
  .filter(name => name && typeof name === 'string');
```

---

## 최종 체크리스트

### MVP 완성 확인
- [ ] ✅ 엑셀 파일 업로드 됨
- [ ] ✅ 과목명 파싱 됨
- [ ] ✅ 진로 입력 가능
- [ ] ✅ LLM 호출해서 로드맵 받아옴
- [ ] ✅ 화면에 로드맵 표시됨

### 배포 준비
- [ ] GitHub 푸시 완료
- [ ] Vercel 환경 변수 설정
- [ ] 배포 URL 동작 확인
- [ ] 모바일 화면 테스트

### 발표 준비
- [ ] 데모 시나리오 작성
- [ ] 데모 데이터 준비
- [ ] 발표 자료 (3-5분)
- [ ] 팀원 역할 분담

---

## 문서 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2025-12-23 | Claude | 초안 작성 (Simple PRD 기반) |

---

> **완익세종** - 24시간 해커톤 MVP 완성 가이드 🚀
> "엑셀 업로드 → 진로 입력 → AI 로드맵 생성" 3가지만 완성하면 끝!
