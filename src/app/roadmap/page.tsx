'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RoadmapDisplay } from '@/components/RoadmapDisplay';
import { Button } from '@/components/ui/Button';
import { SejongColors } from '@/styles/colors';
import type { Roadmap, TranscriptData, CareerGoal } from '@/lib/types';

export default function RoadmapPage() {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load roadmap from sessionStorage
    const roadmapData = sessionStorage.getItem('roadmap');

    if (roadmapData) {
      try {
        const parsed = JSON.parse(roadmapData);
        setRoadmap(parsed);
      } catch (error) {
        console.error('Failed to parse roadmap data:', error);
      }
    }

    setLoading(false);
  }, []);

  const handleReset = useCallback(() => {
    // Clear sessionStorage
    sessionStorage.removeItem('roadmap');
    sessionStorage.removeItem('transcript');
    sessionStorage.removeItem('careerGoal');

    // Navigate back to home
    router.push('/');
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-gray-50 to-white">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div
              className="w-3 h-3 rounded-full animate-bounce"
              style={{ backgroundColor: SejongColors.primary, animationDelay: '0ms' }}
            />
            <div
              className="w-3 h-3 rounded-full animate-bounce"
              style={{ backgroundColor: SejongColors.primary, animationDelay: '150ms' }}
            />
            <div
              className="w-3 h-3 rounded-full animate-bounce"
              style={{ backgroundColor: SejongColors.primary, animationDelay: '300ms' }}
            />
          </div>
          <p className="text-gray-600">로드맵을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-gray-50 to-white">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: SejongColors.primary }}>
            로드맵 데이터를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-8">
            세션이 만료되었거나 로드맵이 생성되지 않았습니다.
            <br />
            처음부터 다시 시작해주세요.
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push('/')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white py-12 px-4">
      <RoadmapDisplay roadmap={roadmap} onReset={handleReset} />
    </div>
  );
}
