'use client';

import { useState } from 'react';
import { Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SejongColors } from '@/styles/colors';

interface CareerInputProps {
  onSubmit: (careerGoal: string) => void;
  loading?: boolean;
}

const EXAMPLE_PROMPTS = [
  {
    id: 'backend',
    label: '백엔드 개발자',
    text: '백엔드 개발자를 목표로 하고 있습니다. Spring Boot, 데이터베이스, 클라우드에 관심이 있으며, 대기업 취업을 희망합니다.',
  },
  {
    id: 'frontend',
    label: '프론트엔드 개발자',
    text: '프론트엔드 개발자가 되고 싶습니다. React, Next.js, TypeScript를 학습하고 싶으며, 사용자 경험 디자인에도 관심이 있습니다.',
  },
  {
    id: 'ai',
    label: 'AI 엔지니어',
    text: 'AI/ML 엔지니어를 목표로 합니다. Python, TensorFlow, PyTorch를 배우고 싶고, 대학원 진학도 고려하고 있습니다.',
  },
  {
    id: 'fullstack',
    label: '풀스택 개발자',
    text: '풀스택 개발자로 성장하고 싶습니다. 프론트엔드와 백엔드 모두 학습하여 전체 서비스를 개발하고 싶으며, 스타트업 창업에 관심이 있습니다.',
  },
];

export function CareerInput({ onSubmit, loading = false }: CareerInputProps) {
  const [careerGoalPrompt, setCareerGoalPrompt] = useState('');
  const [errors, setErrors] = useState<{ careerGoal?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { careerGoal?: string } = {};

    if (!careerGoalPrompt.trim()) {
      newErrors.careerGoal = '진로 목표를 입력해주세요.';
    } else if (careerGoalPrompt.trim().length < 10) {
      newErrors.careerGoal = '최소 10자 이상 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const trimmedGoal = careerGoalPrompt.trim();

    console.log('🎯 Career goal submitted:', {
      length: trimmedGoal.length,
      preview: trimmedGoal.substring(0, 50) + (trimmedGoal.length > 50 ? '...' : ''),
    });

    setIsSubmitting(true);

    // Submit to parent
    onSubmit(trimmedGoal);

    // Note: loading state will be managed by parent component
    // Parent will reset it when API call completes or fails
  };

  const handleExampleClick = (exampleText: string) => {
    setCareerGoalPrompt(exampleText);
    setErrors({});
  };

  return (
    <Card shadow="xl" padding="lg" className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3" style={{ color: SejongColors.primary }}>
            희망 진로 및 목표 입력
          </h2>
          <p className="text-gray-700">
            AI가 맞춤형 로드맵을 생성할 수 있도록 구체적으로 작성해주세요
          </p>
        </div>

        {/* Main Text Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            진로 목표 및 관심사 <span className="text-red-500">*</span>
          </label>

          <Textarea
            value={careerGoalPrompt}
            onChange={(e) => {
              setCareerGoalPrompt(e.target.value);
              setErrors({});
            }}
            placeholder="예: 백엔드 개발자를 목표로 하고 있습니다. Spring Boot, 데이터베이스, 클라우드에 관심이 있으며, 대기업 취업을 희망합니다."
            rows={6}
            fullWidth
            helperText="희망 진로, 관심 분야, 추가 정보를 자유롭게 작성해주세요"
          />

          {errors.careerGoal && (
            <p className="mt-2 text-sm text-red-600">{errors.careerGoal}</p>
          )}
        </div>

        {/* 작성 가이드 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            💡 작성 가이드
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 희망하는 진로 (예: 백엔드 개발자, AI 엔지니어)</li>
            <li>• 관심 있는 기술 분야 (예: Spring Boot, React, AWS)</li>
            <li>• 목표 및 계획 (예: 대기업 취업, 스타트업 창업)</li>
          </ul>
        </div>

        {/* 예시 프롬프트 버튼 */}
        <div>
          <p className="text-sm text-gray-600 mb-2">📝 작성 예시 (클릭하여 적용)</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => handleExampleClick(example.text)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-700 hover:bg-primary-50 transition-colors cursor-pointer"
                style={{
                  borderColor: careerGoalPrompt === example.text ? SejongColors.primary : SejongColors.border.medium,
                  backgroundColor: careerGoalPrompt === example.text ? 'rgba(227, 6, 19, 0.05)' : 'transparent',
                  color: careerGoalPrompt === example.text ? SejongColors.primary : undefined,
                }}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading || isSubmitting}
            className="min-w-50"
          >
            {loading || isSubmitting ? '로드맵 생성 중...' : 'AI 로드맵 생성하기'}
          </Button>
        </div>

        {/* Info Note */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p>AI 로드맵 생성에는 약 60초가 소요됩니다</p>
        </div>
      </form>
    </Card>
  );
}
