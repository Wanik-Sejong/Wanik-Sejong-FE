# 완익세종 구현 워크플로우

> **AI 기반 진로-교과목 로드맵 추천 시스템 구현 계획**
> 생성일: 2025년 12월 23일
> 프로젝트 기간: 해커톤 48시간
> 기반 문서: [PRD.md](./PRD.md)

---

## 📋 목차

1. [워크플로우 개요](#1-워크플로우-개요)
2. [기술 스택 및 환경 설정](#2-기술-스택-및-환경-설정)
3. [Phase 1: Foundation (0-12시간)](#3-phase-1-foundation-0-12시간)
4. [Phase 2: AI Core (12-24시간)](#4-phase-2-ai-core-12-24시간)
5. [Phase 3: Roadmap Generation (24-36시간)](#5-phase-3-roadmap-generation-24-36시간)
6. [Phase 4: Polish & Deploy (36-48시간)](#6-phase-4-polish--deploy-36-48시간)
7. [병렬 처리 전략](#7-병렬-처리-전략)
8. [품질 관리 체크리스트](#8-품질-관리-체크리스트)
9. [리스크 완화 계획](#9-리스크-완화-계획)

---

## 1. 워크플로우 개요

### 1.1 구현 원칙

```yaml
Priority_First: MVP 기능 우선 → 부가 기능 후순위
Parallel_Execution: 독립적 작업 병렬 진행
Quality_Gates: 각 Phase 완료 시 검증
Risk_Mitigation: 리스크 높은 항목 조기 착수
```

### 1.2 Phase별 목표

| Phase | 시간 | 우선순위 | 핵심 목표 | 성공 지표 |
|-------|------|---------|----------|-----------|
| **Phase 1** | 0-12h | P0 | 데이터 파이프라인 구축 | 엑셀 업로드 → 대시보드 표시 |
| **Phase 2** | 12-24h | P0 | AI 통합 및 분석 | 진로 선택 → 갭 분석 완료 |
| **Phase 3** | 24-36h | P0 | 로드맵 생성 및 표시 | 완전한 로드맵 생성 플로우 |
| **Phase 4** | 36-48h | P1-P2 | 완성도 향상 및 배포 | 프로덕션 레디 상태 |

### 1.3 크리티컬 패스

```
[엑셀 파싱] → [DB 저장] → [AI 분류] → [진로 선택] → [역량 매핑] → [갭 분석] → [로드맵 생성] → [시각화]
```

---

## 2. 기술 스택 및 환경 설정

### 2.1 프로젝트 구조

```
wanik-sejong/
├── frontend/                 # Next.js 16 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/
│   │   │   ├── career/
│   │   │   ├── roadmap/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/          # 재사용 컴포넌트
│   │   │   ├── upload/
│   │   │   ├── charts/
│   │   │   └── roadmap/
│   │   ├── lib/
│   │   │   ├── api.ts       # API 클라이언트
│   │   │   ├── supabase.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   └── hooks/
│   ├── public/
│   │   └── images/
│   │       └── logos/
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── upload.py
│   │   │   ├── courses.py
│   │   │   ├── ai.py
│   │   │   └── roadmaps.py
│   │   ├── services/
│   │   │   ├── parser_service.py
│   │   │   ├── ai_service.py
│   │   │   └── roadmap_service.py
│   │   ├── models/
│   │   │   └── database.py
│   │   ├── schemas/
│   │   └── db/
│   │       └── migrations/
│   ├── requirements.txt
│   └── .env
│
├── docs/
│   ├── PRD.md
│   ├── WORKFLOW.md          # 이 파일
│   └── API.md
│
└── README.md
```

### 2.2 환경 변수 설정

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://twbakqeemdcaljkymywk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wanik_sejong

# Supabase
SUPABASE_URL=https://twbakqeemdcaljkymywk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Redis (선택사항)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGINS=["http://localhost:3000"]

# File Upload
UPLOAD_DIR=./app/static/uploads
MAX_FILE_SIZE=10485760  # 10MB
```

### 2.3 의존성 설치

#### Frontend
```bash
cd frontend
npm install next@16 react react-dom typescript
npm install @supabase/supabase-js
npm install @tanstack/react-query zustand
npm install tailwindcss postcss autoprefixer
npm install chart.js react-chartjs-2
npm install react-dropzone
npm install @types/node @types/react @types/react-dom
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install fastapi uvicorn[standard]
pip install pandas openpyxl
pip install pydantic pydantic-settings
pip install python-multipart
pip install openai anthropic langchain
pip install supabase
pip install psycopg2-binary sqlalchemy
pip install redis
pip install python-jose[cryptography] passlib[bcrypt]
```

---

## 3. Phase 1: Foundation (0-12시간)

### 3.1 작업 분할 전략

| 팀원 | 작업 영역 | 예상 시간 |
|------|----------|-----------|
| **Backend Dev** | DB 스키마 + 파싱 API | 8h |
| **Frontend Dev** | 프로젝트 설정 + 업로드 UI | 8h |
| **DevOps** | 환경 설정 + Supabase | 4h |

### 3.2 Backend 작업 (8시간)

#### 3.2.1 PostgreSQL 스키마 생성 (2시간)

**📁 `backend/app/db/schema.sql`**

```sql
-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    admission_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 이수 교과목 테이블
CREATE TABLE completed_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    category VARCHAR(20),
    credits DECIMAL(2,1),
    grade VARCHAR(5),
    grade_point DECIMAL(2,1),
    year INTEGER,
    semester VARCHAR(20),
    competencies JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 진로 카테고리 테이블
CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    required_competencies JSONB,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 로드맵 테이블
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    career_id UUID REFERENCES careers(id),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    gap_analysis JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 로드맵 항목 테이블
CREATE TABLE roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    period VARCHAR(50),
    period_type VARCHAR(20),
    priority VARCHAR(20),
    competencies JSONB,
    reason TEXT,
    metadata JSONB,
    is_completed BOOLEAN DEFAULT FALSE,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI 응답 캐시 테이블
CREATE TABLE ai_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    cache_type VARCHAR(50),
    request_hash VARCHAR(64),
    response JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_completed_courses_user ON completed_courses(user_id);
CREATE INDEX idx_roadmaps_user ON roadmaps(user_id);
CREATE INDEX idx_roadmap_items_roadmap ON roadmap_items(roadmap_id);
CREATE INDEX idx_ai_cache_key ON ai_cache(cache_key);
CREATE INDEX idx_ai_cache_expires ON ai_cache(expires_at);
```

**✅ 검증 방법:**
```bash
psql -U postgres -d wanik_sejong -f backend/app/db/schema.sql
psql -U postgres -d wanik_sejong -c "\dt"  # 테이블 목록 확인
```

#### 3.2.2 엑셀 파싱 서비스 (3시간)

**📁 `backend/app/services/parser_service.py`**

```python
import pandas as pd
from typing import List, Dict
import hashlib

class TranscriptParser:
    """기이수성적조회 엑셀 파일 파서"""

    def __init__(self):
        self.column_mapping = {
            'Unnamed: 1': '년도',
            'Unnamed: 2': '학기',
            'Unnamed: 3': '학수번호',
            'Unnamed: 4': '교과목명',
            'Unnamed: 5': '이수구분',
            'Unnamed: 6': '교직영역',
            'Unnamed: 7': '선택영역',
            'Unnamed: 8': '학점',
            'Unnamed: 9': '평가방식',
            'Unnamed: 10': '등급',
            'Unnamed: 11': '평점',
            'Unnamed: 12': '개설학과코드'
        }

    def parse_excel(self, file_path: str) -> List[Dict]:
        """
        엑셀 파일을 파싱하여 교과목 목록 반환

        Args:
            file_path: 엑셀 파일 경로

        Returns:
            List[Dict]: 교과목 정보 딕셔너리 리스트
        """
        try:
            # 첫 3행 스킵 (헤더)
            df = pd.read_excel(file_path, skiprows=3)

            # 컬럼명 매핑
            df = df.rename(columns=self.column_mapping)

            # NaN 제거
            df = df.dropna(subset=['교과목명'])

            # 데이터 타입 변환
            df['학점'] = pd.to_numeric(df['학점'], errors='coerce')
            df['평점'] = pd.to_numeric(df['평점'], errors='coerce')
            df['년도'] = pd.to_numeric(df['년도'], errors='coerce').astype('Int64')

            # 딕셔너리 리스트로 변환
            courses = []
            for _, row in df.iterrows():
                course = {
                    'year': int(row['년도']) if pd.notna(row['년도']) else None,
                    'semester': str(row['학기']) if pd.notna(row['학기']) else None,
                    'course_code': str(row['학수번호']) if pd.notna(row['학수번호']) else None,
                    'course_name': str(row['교과목명']),
                    'category': str(row['이수구분']) if pd.notna(row['이수구분']) else None,
                    'credits': float(row['학점']) if pd.notna(row['학점']) else None,
                    'grade': str(row['등급']) if pd.notna(row['등급']) else None,
                    'grade_point': float(row['평점']) if pd.notna(row['평점']) else None,
                    'department_code': str(row['개설학과코드']) if pd.notna(row['개설학과코드']) else None
                }
                courses.append(course)

            return courses

        except Exception as e:
            raise ValueError(f"엑셀 파일 파싱 실패: {str(e)}")

    def calculate_statistics(self, courses: List[Dict]) -> Dict:
        """이수 현황 통계 계산"""
        stats = {
            'total_courses': len(courses),
            'total_credits': sum(c['credits'] for c in courses if c['credits']),
            'by_category': {},
            'by_grade': {},
            'gpa': 0.0
        }

        # 이수구분별 집계
        for course in courses:
            category = course['category']
            if category:
                if category not in stats['by_category']:
                    stats['by_category'][category] = {'count': 0, 'credits': 0}
                stats['by_category'][category]['count'] += 1
                stats['by_category'][category]['credits'] += course['credits'] or 0

        # 성적별 집계
        for course in courses:
            grade = course['grade']
            if grade:
                stats['by_grade'][grade] = stats['by_grade'].get(grade, 0) + 1

        # 평점 계산 (P/NP 제외)
        graded_courses = [c for c in courses if c['grade_point'] is not None]
        if graded_courses:
            total_points = sum(c['grade_point'] * c['credits'] for c in graded_courses if c['credits'])
            total_credits = sum(c['credits'] for c in graded_courses if c['credits'])
            stats['gpa'] = round(total_points / total_credits, 2) if total_credits > 0 else 0.0

        return stats
```

#### 3.2.3 업로드 API 엔드포인트 (3시간)

**📁 `backend/app/api/upload.py`**

```python
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from pathlib import Path

from app.services.parser_service import TranscriptParser
from app.db.database import get_db
from app.models import CompletedCourse
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])
parser = TranscriptParser()

UPLOAD_DIR = Path("./app/static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/transcript")
async def upload_transcript(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    기이수성적조회 엑셀 파일 업로드 및 파싱

    - 파일 저장
    - 엑셀 파싱
    - DB 저장
    - 통계 계산
    - 파일 삭제 (개인정보 보호)
    """
    # 파일 형식 검증
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="엑셀 파일만 업로드 가능합니다")

    # 파일 크기 검증 (10MB)
    file_path = UPLOAD_DIR / f"{current_user.id}_{file.filename}"

    try:
        # 파일 저장
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 엑셀 파싱
        courses_data = parser.parse_excel(str(file_path))

        # 기존 데이터 삭제 (재업로드 시)
        db.query(CompletedCourse).filter(
            CompletedCourse.user_id == current_user.id
        ).delete()

        # DB 저장
        course_objects = []
        for course_data in courses_data:
            course = CompletedCourse(
                user_id=current_user.id,
                **course_data
            )
            course_objects.append(course)

        db.bulk_save_objects(course_objects)
        db.commit()

        # 통계 계산
        stats = parser.calculate_statistics(courses_data)

        return {
            "success": True,
            "message": f"{len(courses_data)}개 교과목 업로드 완료",
            "courses_count": len(courses_data),
            "statistics": stats
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"파일 처리 실패: {str(e)}")

    finally:
        # 파일 삭제 (개인정보 보호)
        if file_path.exists():
            file_path.unlink()


@router.get("/courses/completed")
async def get_completed_courses(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """이수 교과목 목록 조회"""
    courses = db.query(CompletedCourse).filter(
        CompletedCourse.user_id == current_user.id
    ).order_by(CompletedCourse.year.desc(), CompletedCourse.semester).all()

    return {
        "courses": [
            {
                "id": str(course.id),
                "course_name": course.course_name,
                "course_code": course.course_code,
                "category": course.category,
                "credits": course.credits,
                "grade": course.grade,
                "year": course.year,
                "semester": course.semester,
                "competencies": course.competencies
            }
            for course in courses
        ]
    }


@router.get("/courses/stats")
async def get_course_statistics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """이수 현황 통계 조회"""
    courses = db.query(CompletedCourse).filter(
        CompletedCourse.user_id == current_user.id
    ).all()

    courses_data = [
        {
            'credits': course.credits,
            'grade': course.grade,
            'grade_point': course.grade_point,
            'category': course.category
        }
        for course in courses
    ]

    stats = parser.calculate_statistics(courses_data)

    return stats
```

### 3.3 Frontend 작업 (8시간)

#### 3.3.1 업로드 페이지 (4시간)

**📁 `frontend/src/app/upload/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/transcript', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('업로드 실패');
      }

      const result = await response.json();

      // 대시보드로 이동
      router.push('/dashboard');

    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 중 오류 발생');
    } finally {
      setUploading(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            기이수성적 업로드
          </h1>
          <p className="text-gray-600">
            세종대학교 포털에서 다운로드한 기이수성적조회 엑셀 파일을 업로드하세요
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}
          `}
        >
          <input {...getInputProps()} disabled={uploading} />

          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {uploading ? (
            <p className="text-gray-600">업로드 중...</p>
          ) : isDragActive ? (
            <p className="text-blue-600">파일을 여기에 놓으세요</p>
          ) : (
            <div>
              <p className="text-gray-900 font-medium mb-1">
                파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-sm text-gray-500">
                .xlsx 또는 .xls 파일만 가능 (최대 10MB)
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📖 사용 가이드</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. 세종대학교 포털 로그인</li>
            <li>2. 수업 → 기이수성적조회 메뉴 선택</li>
            <li>3. 엑셀 다운로드 버튼 클릭</li>
            <li>4. 다운로드한 파일을 이곳에 업로드</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
```

#### 3.3.2 대시보드 페이지 (4시간)

**📁 `frontend/src/app/dashboard/page.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface CourseStats {
  total_courses: number;
  total_credits: number;
  gpa: number;
  by_category: Record<string, { count: number; credits: number }>;
  by_grade: Record<string, number>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/courses/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('통계 조회 실패');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">통계 로딩 중...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">이수 내역이 없습니다</p>
          <button
            onClick={() => router.push('/upload')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            파일 업로드하기
          </button>
        </div>
      </div>
    );
  }

  // 차트 데이터
  const categoryData = {
    labels: Object.keys(stats.by_category),
    datasets: [{
      label: '이수 학점',
      data: Object.values(stats.by_category).map(c => c.credits),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }]
  };

  const gradeData = {
    labels: Object.keys(stats.by_grade),
    datasets: [{
      label: '과목 수',
      data: Object.values(stats.by_grade),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">이수 현황 대시보드</h1>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">총 이수 과목</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total_courses}개</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">총 이수 학점</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total_credits}학점</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">평점</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.gpa} / 4.5</p>
          </div>
        </div>

        {/* 차트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">이수구분별 학점</h2>
            <Pie data={categoryData} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">성적 분포</h2>
            <Bar data={gradeData} />
          </div>
        </div>

        {/* 다음 단계 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/career')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            진로 설정하러 가기 →
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3.4 Phase 1 검증 체크리스트

```yaml
Backend:
  - [ ] PostgreSQL 스키마 생성 완료
  - [ ] 엑셀 파싱 서비스 테스트 통과
  - [ ] 업로드 API 200 응답 확인
  - [ ] 파일 업로드 후 자동 삭제 확인

Frontend:
  - [ ] 파일 드래그 앤 드롭 동작 확인
  - [ ] 업로드 진행률 표시 확인
  - [ ] 대시보드 차트 렌더링 확인
  - [ ] 통계 데이터 정확성 검증

Integration:
  - [ ] Frontend → Backend API 통신 성공
  - [ ] 엑셀 업로드 → DB 저장 → 대시보드 표시 전체 플로우 동작
  - [ ] 에러 핸들링 동작 확인
```

---

## 4. Phase 2: AI Core (12-24시간)

### 4.1 AI 서비스 통합 (6시간)

#### 4.1.1 AI 서비스 기반 구조

**📁 `backend/app/services/ai_service.py`**

```python
from typing import List, Dict, Optional
import os
import json
import hashlib
from openai import OpenAI
from anthropic import Anthropic

class AIService:
    """AI API 통합 서비스"""

    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    async def map_competencies(self, job_title: str, sub_category: str) -> Dict:
        """
        AI #2: 진로-역량 매핑
        진로에 필요한 핵심 역량 도출
        """
        prompt = f"""당신은 IT 채용 전문가입니다.
다음 직무에 필요한 핵심 역량을 분석해주세요.

[직무 정보]
- 직무명: {job_title}
- 분야: {sub_category}

다음 형식으로 5-8개의 핵심 역량을 도출해주세요:
- 기술 역량 (Hard Skills): 구체적인 기술 스택 포함
- 소프트 스킬 (Soft Skills): 필요한 비기술적 역량

각 역량에 대해 중요도(필수/권장)와 숙련도 레벨(1-5)을 포함해주세요.

JSON 형식으로 응답:
{{
  "required_competencies": [
    {{
      "name": "역량명",
      "importance": "필수" or "권장",
      "level": 1-5,
      "description": "설명"
    }}
  ],
  "soft_skills": ["skill1", "skill2"]
}}
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.7
            )

            result = json.loads(response.choices[0].message.content)
            return result

        except Exception as e:
            raise Exception(f"역량 매핑 실패: {str(e)}")

    async def classify_courses(self, courses: List[Dict]) -> List[Dict]:
        """
        AI #3: 이수 교과목 역량 분류
        교과목이 어떤 역량과 연결되는지 분석
        """
        courses_text = "\n".join([
            f"- {c['course_name']} (성적: {c['grade']}, 학점: {c['credits']})"
            for c in courses
        ])

        prompt = f"""당신은 대학 교육과정 분석 전문가입니다.
다음 교과목들이 어떤 직무 역량과 연결되는지 분석해주세요.

[이수 교과목 목록]
{courses_text}

각 교과목에 대해:
1. 관련 역량 (competencies): 해당 과목으로 습득 가능한 역량
2. 습득 정도 (proficiency_gained): 성적을 반영한 역량 습득 수준 (0.0-1.0)
   - A+/A0: 0.9-1.0
   - B+/B0: 0.7-0.8
   - C+/C0: 0.5-0.6
   - D+/D0: 0.3-0.4
3. 관련 직무 (career_relevance): 이 역량이 필요한 직무들

JSON 형식으로 응답:
{{
  "classified_courses": [
    {{
      "course_name": "과목명",
      "competencies": ["역량1", "역량2"],
      "proficiency_gained": 0.8,
      "career_relevance": ["직무1", "직무2"]
    }}
  ]
}}
"""

        try:
            response = self.anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4096,
                messages=[{"role": "user", "content": prompt}]
            )

            result = json.loads(response.content[0].text)
            return result["classified_courses"]

        except Exception as e:
            raise Exception(f"교과목 분류 실패: {str(e)}")

    async def analyze_gap(
        self,
        target_career: str,
        required_competencies: List[Dict],
        current_competencies: List[Dict]
    ) -> Dict:
        """
        AI #4: 역량 갭 분석
        현재 보유 역량과 목표 역량 간의 차이 분석
        """
        prompt = f"""당신은 커리어 코치입니다.
학생의 현재 역량과 목표 직무의 필요 역량을 비교 분석해주세요.

[목표 직무]
{target_career}

[필요 역량]
{json.dumps(required_competencies, ensure_ascii=False, indent=2)}

[현재 보유 역량]
{json.dumps(current_competencies, ensure_ascii=False, indent=2)}

분석 결과를 JSON 형식으로 제공:
{{
  "gap_analysis": {{
    "overall_readiness": 0.0-1.0,
    "gaps": [
      {{
        "competency": "역량명",
        "required_level": 4,
        "current_level": 1,
        "gap": 3,
        "priority": "높음/중간/낮음",
        "recommendation": "개선 방안"
      }}
    ],
    "strengths": [
      {{
        "competency": "역량명",
        "current_level": 4,
        "note": "설명"
      }}
    ]
  }}
}}
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.5
            )

            result = json.loads(response.choices[0].message.content)
            return result

        except Exception as e:
            raise Exception(f"갭 분석 실패: {str(e)}")
```

### 4.2 로드맵 생성 API (핵심, 6시간)

**📁 `backend/app/services/roadmap_service.py`**

```python
class RoadmapService:
    """로드맵 생성 서비스"""

    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service

    async def generate_roadmap(
        self,
        user_info: Dict,
        gap_analysis: Dict,
        available_courses: List[Dict]
    ) -> Dict:
        """
        AI #5: 로드맵 생성 (핵심 기능)
        학기별/방학별 구체적인 학습 계획 생성
        """
        prompt = f"""당신은 대학생 진로 설계 전문 컨설턴트입니다.
학생의 현재 상황과 목표를 바탕으로 구체적인 학습 로드맵을 생성해주세요.

[학생 정보]
- 학과: {user_info['department']}
- 현재 학기: {user_info['current_semester']}
- 남은 학기: {user_info['remaining_semesters']}
- 목표 직무: {user_info['target_career']}

[역량 갭 분석 결과]
{json.dumps(gap_analysis, ensure_ascii=False, indent=2)}

[개설 교과목 목록]
{json.dumps(available_courses[:20], ensure_ascii=False, indent=2)}

[요청사항]
1. 학기별로 수강해야 할 교과목 추천 (선후관계 고려)
2. 방학별 활동 추천:
   - 온라인 강의 (구체적인 강의명, 플랫폼, 링크)
   - 자격증 (준비 기간 포함)
   - 프로젝트 (결과물 명시)
   - 코딩 테스트 대비
   - 인턴십/대외활동
3. 각 항목에 대해:
   - 우선순위 (필수/높음/중간/낮음)
   - 관련 역량
   - 추천 이유
   - 예상 소요 시간

JSON 형식으로 응답해주세요.
"""

        try:
            response = self.ai_service.anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=8192,
                temperature=0.7,
                messages=[{"role": "user", "content": prompt}]
            )

            result = json.loads(response.content[0].text)
            return result

        except Exception as e:
            raise Exception(f"로드맵 생성 실패: {str(e)}")
```

### 4.3 Phase 2 검증 체크리스트

```yaml
AI_Integration:
  - [ ] OpenAI API 연동 테스트
  - [ ] Claude API 연동 테스트
  - [ ] 역량 매핑 API 응답 검증
  - [ ] 교과목 분류 API 정확도 확인
  - [ ] 갭 분석 결과 정합성 검증
  - [ ] 로드맵 생성 JSON 구조 확인

Caching:
  - [ ] Redis 연결 확인
  - [ ] 캐시 저장/조회 동작 확인
  - [ ] 캐시 만료 시간 설정 확인

Error_Handling:
  - [ ] AI API 장애 시 Fallback 동작
  - [ ] Rate Limiting 동작 확인
```

---

## 5. Phase 3: Roadmap Generation (24-36시간)

### 5.1 로드맵 타임라인 UI (6시간)

**📁 `frontend/src/components/roadmap/Timeline.tsx`**

```typescript
interface RoadmapPeriod {
  period_id: string;
  period_name: string;
  type: 'semester' | 'vacation';
  duration?: string;
  items: RoadmapItem[];
}

interface RoadmapItem {
  id: string;
  type: 'course' | 'online_course' | 'project' | 'certification' | 'extracurricular';
  title: string;
  duration?: string;
  priority: '필수' | '높음' | '중간' | '낮음';
  competencies: string[];
  reason: string;
  metadata?: Record<string, any>;
}

export function RoadmapTimeline({ periods }: { periods: RoadmapPeriod[] }) {
  return (
    <div className="space-y-8">
      {periods.map((period) => (
        <div key={period.period_id} className="border rounded-lg p-6 bg-white shadow">
          {/* 기간 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {period.type === 'semester' ? '📚' : '🏖️'} {period.period_name}
            </h3>
            {period.duration && (
              <span className="text-sm text-gray-600">{period.duration}</span>
            )}
          </div>

          {/* 항목 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {period.items.map((item) => (
              <RoadmapItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RoadmapItemCard({ item }: { item: RoadmapItem }) {
  const typeIcons = {
    course: '🎓',
    online_course: '📚',
    project: '💻',
    certification: '📝',
    extracurricular: '👥'
  };

  const priorityColors = {
    '필수': 'bg-red-100 text-red-800',
    '높음': 'bg-orange-100 text-orange-800',
    '중간': 'bg-yellow-100 text-yellow-800',
    '낮음': 'bg-green-100 text-green-800'
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{typeIcons[item.type]}</span>
        <span className={`text-xs px-2 py-1 rounded ${priorityColors[item.priority]}`}>
          {item.priority}
        </span>
      </div>

      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>

      {item.duration && (
        <p className="text-sm text-gray-600 mb-2">{item.duration}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {item.competencies.map((comp, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded"
          >
            {comp}
          </span>
        ))}
      </div>

      <button className="text-sm text-blue-600 hover:underline">
        자세히 보기 →
      </button>
    </div>
  );
}
```

### 5.2 로드맵 페이지 (6시간)

**📁 `frontend/src/app/roadmap/page.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { RoadmapTimeline } from '@/components/roadmap/Timeline';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const response = await fetch('/api/roadmaps/latest', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('로드맵 조회 실패');

      const data = await response.json();
      setRoadmap(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>로드맵 로딩 중...</p>
    </div>;
  }

  if (!roadmap) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">생성된 로드맵이 없습니다</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          로드맵 생성하기
        </button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {roadmap.title}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              전체 준비도: {Math.round(roadmap.gap_analysis.overall_readiness * 100)}%
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${roadmap.gap_analysis.overall_readiness * 100}%` }}
              />
            </div>
          </div>
        </div>

        <RoadmapTimeline periods={roadmap.periods} />
      </div>
    </div>
  );
}
```

---

## 6. Phase 4: Polish & Deploy (36-48시간)

### 6.1 UI/UX 개선 (4시간)

```yaml
Responsive_Design:
  - 모바일 레이아웃 최적화
  - 태블릿 뷰 조정
  - 터치 인터랙션 개선

Accessibility:
  - ARIA 라벨 추가
  - 키보드 네비게이션
  - 색상 대비 개선

Animation:
  - 페이지 전환 애니메이션
  - 로딩 스피너
  - 호버 효과
```

### 6.2 배포 (4시간)

#### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

#### Backend (Railway)
```bash
cd backend
railway login
railway init
railway up
```

### 6.3 발표 자료 (4시간)

**구성:**
1. 문제 정의 (2분)
2. 솔루션 소개 (3분)
3. 기술 스택 (2분)
4. 라이브 데모 (5분)
5. AI 활용 방법 (3분)

---

## 7. 병렬 처리 전략

### 7.1 팀원별 작업 분담

```yaml
Backend_Developer:
  Phase_1: DB 스키마 + 파싱 API
  Phase_2: AI 서비스 통합
  Phase_3: 로드맵 생성 API
  Phase_4: 배포 및 최적화

Frontend_Developer:
  Phase_1: 업로드 UI + 대시보드
  Phase_2: 진로 선택 UI
  Phase_3: 로드맵 타임라인 UI
  Phase_4: UI/UX 폴리싱

DevOps:
  Phase_1: 환경 설정
  Phase_2: AI API 설정
  Phase_3: 배포 준비
  Phase_4: 모니터링 설정
```

### 7.2 독립적 병렬 작업

```yaml
Parallel_Track_1:
  - 사용자 인증 시스템 (Supabase)
  - 진로 카테고리 DB 구축
  - UI 컴포넌트 라이브러리

Parallel_Track_2:
  - 엑셀 파싱 로직
  - 차트 시각화
  - AI 프롬프트 최적화
```

---

## 8. 품질 관리 체크리스트

### 8.1 기술 품질

```yaml
Performance:
  - [ ] 페이지 로드 시간 < 2초
  - [ ] AI API 응답 < 5초
  - [ ] 파일 업로드 성공률 > 95%

Code_Quality:
  - [ ] TypeScript strict mode
  - [ ] ESLint 통과
  - [ ] 에러 바운더리 구현

Security:
  - [ ] 파일 업로드 후 즉시 삭제
  - [ ] API 인증 구현
  - [ ] CORS 설정
```

### 8.2 사용자 경험

```yaml
Usability:
  - [ ] 모바일 반응형
  - [ ] 에러 메시지 명확
  - [ ] 로딩 상태 표시

Accessibility:
  - [ ] 키보드 네비게이션
  - [ ] ARIA 라벨
  - [ ] 색상 대비 충분
```

---

## 9. 리스크 완화 계획

### 9.1 시간 부족 대응

**MVP 기능만 구현 (36시간):**
```yaml
Core_Only:
  - 엑셀 업로드 파싱 ✅
  - 진로 카테고리 선택 ✅
  - AI 로드맵 생성 ✅
  - 타임라인 표시 ✅

Skip_If_Needed:
  - 진로 자연어 입력 ❌
  - 드래그 앤 드롭 편집 ❌
  - PDF 내보내기 ❌
```

### 9.2 AI API 장애 대응

```yaml
Fallback_Strategy:
  Primary: Claude 3.5 Sonnet
  Fallback_1: GPT-4o
  Fallback_2: GPT-4o-mini
  Emergency: 정적 템플릿 기반 추천
```

### 9.3 배포 실패 대응

```yaml
Deployment_Plan_B:
  Frontend: Vercel → Netlify
  Backend: Railway → Fly.io → Render
  Database: Supabase → Neon → local PostgreSQL
```

---

## 문서 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2025-12-23 | Claude | 최초 작성 |

---

> **완익세종** - 체계적인 워크플로우로 48시간 내 완성 🚀
