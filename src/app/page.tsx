'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FileUpload } from '@/components/FileUpload';
import { CareerInput } from '@/components/CareerInput';
import { Hero } from '@/components/ui/Hero';
import { Button } from '@/components/ui/Button';
import { SejongColors } from '@/styles/colors';
import { generateRoadmap } from '@/lib/api-client';
import type { TranscriptData } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'career'>("upload");
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleUploadSuccess = useCallback((data: TranscriptData) => {
    setTranscriptData(data);
    setStep('career');
  }, []);

  const handleCareerSubmit = async (careerGoal: string) => {
    if (!transcriptData) {
      alert('성적표 데이터가 없습니다. 다시 업로드해주세요.');
      setStep('upload');
      return;
    }

    setGenerating(true);

    try {
      const result = await generateRoadmap(transcriptData, careerGoal);

      if (result.success && result.data) {
        // Store roadmap in sessionStorage for roadmap page
        sessionStorage.setItem('roadmap', JSON.stringify(result.data));
        sessionStorage.setItem('transcript', JSON.stringify(transcriptData));
        sessionStorage.setItem('careerGoal', careerGoal);

        // Navigate to roadmap page
        router.push('/roadmap');
      } else {
        // Detailed error message based on error type
        let errorMessage = '로드맵 생성 중 오류가 발생했습니다.';

        if (result.error) {
          if (result.error.includes('timeout')) {
            errorMessage = '⏱️ 요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
          } else if (result.error.includes('network') || result.error.includes('fetch')) {
            errorMessage = '🌐 네트워크 연결을 확인해주세요.';
          } else if (result.error.includes('API key') || result.error.includes('unauthorized')) {
            errorMessage = '🔑 API 인증에 실패했습니다. 관리자에게 문의하세요.';
          } else {
            errorMessage = `❌ ${result.error}`;
          }
        }

        alert(errorMessage);
        setGenerating(false);
      }
    } catch (error) {
      // User-friendly error message
      let userMessage = '로드맵 생성 중 예상치 못한 오류가 발생했습니다.';
      if (error instanceof TypeError) {
        userMessage = '🔧 데이터 형식 오류가 발생했습니다. 페이지를 새로고침 후 다시 시도해주세요.';
      }

      alert(userMessage);
      setGenerating(false);
    }
  };

  const handleReset = useCallback(() => {
    setStep('upload');
    setTranscriptData(null);
    setGenerating(false);
  }, []);

  const handleScrollToContent = useCallback(() => {
    const target = document.getElementById('main-content');
    target?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white">
      {/* Hero Section */}
      <Hero
        badge="완익세종"
        title="AI가 분석한"
        subtitle="맞춤 로드맵"
        description="AI 기반으로 학생의 이수 과목과 희망 진로를 분석하여 맞춤형 학습 로드맵을 제공합니다. 개별화된 분석을 통해 나만의 커리어 경로를 찾아보세요."
        illustration={
          <div className="relative w-80 h-80">
            <Image
              src="/images/logos/sejong-logo.png"
              alt="세종대학교"
              width={300}
              height={300}
              loading="eager"
              priority
              className="object-contain mx-auto"
            />
          </div>
        }
        actions={
          <Button
            variant="primary"
            size="lg"
            onClick={handleScrollToContent}
          >
            시작하기
          </Button>
        }
      />

      {/* Main Content */}
      <section id="main-content" className="max-w-7xl mx-auto px-4 py-16">
        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'upload' ? 'text-white' : 'text-gray-600'
              }`}
              style={{
                backgroundColor: step === 'upload' ? SejongColors.primary : SejongColors.border.light,
              }}
            >
              1
            </div>
            <span className={`font-medium ${step === 'upload' ? 'text-gray-900' : 'text-gray-500'}`}>
              성적표 업로드
            </span>
          </div>

          <div className="w-12 h-0.5 bg-gray-300" />

          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'career' ? 'text-white' : 'text-gray-600'
              }`}
              style={{
                backgroundColor: step === 'career' ? SejongColors.primary : SejongColors.border.light,
              }}
            >
              2
            </div>
            <span className={`font-medium ${step === 'career' ? 'text-gray-900' : 'text-gray-500'}`}>
              진로 입력
            </span>
          </div>

          <div className="w-12 h-0.5 bg-gray-300" />

          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-600"
              style={{ backgroundColor: SejongColors.border.light }}
            >
              3
            </div>
            <span className="font-medium text-gray-500">로드맵 확인</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-12">
          {step === 'upload' && (
            <div className="animate-fade-in">
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={() => {}}
              />
            </div>
          )}

          {step === 'career' && (
            <div className="animate-fade-in">
              {/* Transcript Summary */}
              {transcriptData && (
                <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: SejongColors.primary }}>
                        업로드된 성적표 정보
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-700">이수 과목:</span>
                          <span className="ml-2 font-medium text-gray-900">{transcriptData.courses.length}개</span>
                        </div>
                        <div>
                          <span className="text-gray-700">총 학점:</span>
                          <span className="ml-2 font-medium text-gray-900">{transcriptData.totalCredits}학점</span>
                        </div>
                        {transcriptData.totalMajorCredits !== undefined && (
                          <div>
                            <span className="text-gray-700">전공 학점:</span>
                            <span className="ml-2 font-medium text-gray-900">{transcriptData.totalMajorCredits}학점</span>
                          </div>
                        )}
                        {transcriptData.averageGPA !== undefined && (
                          <div>
                            <span className="text-gray-700">평균 평점:</span>
                            <span className="ml-2 font-medium text-gray-900">{transcriptData.averageGPA.toFixed(2)}/4.5</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      다시 업로드
                    </Button>
                  </div>
                </div>
              )}

              <CareerInput onSubmit={handleCareerSubmit} loading={generating} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <Image
            src="/images/logos/sejong-logo.png"
            alt="세종대학교"
            width={100}
            height={100}
            className="mx-auto mb-6 brightness-0 invert opacity-80"
          />
          <h3 className="text-xl font-bold mb-2">완익세종</h3>
          <p className="text-gray-400 mb-6">
            AI 기반 진로-교과목 로드맵 추천 서비스
          </p>

          {/* Team Members */}
          <div className="mb-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-3">개발팀</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-sm text-gray-500">
              <span>20011650 홍의민</span>
              <span className="hidden sm:inline">•</span>
              <span>23011818 이정연</span>
              <span className="hidden sm:inline">•</span>
              <span>21011606 박성열</span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            © 2025 Sejong University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
