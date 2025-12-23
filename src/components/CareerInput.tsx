'use client';

import { useState } from 'react';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Tag } from './ui/Badge';
import { SejongColors } from '@/styles/colors';
import type { CareerGoal } from '@/lib/types';

interface CareerInputProps {
  onSubmit: (careerGoal: CareerGoal) => void;
  loading?: boolean;
}

const SUGGESTED_INTERESTS = [
  'AI/ML',
  '백엔드 개발',
  '프론트엔드 개발',
  '데이터 분석',
  '클라우드',
  '보안',
  '게임 개발',
  '모바일 앱',
  '웹 개발',
  'DevOps',
];

export function CareerInput({ onSubmit, loading = false }: CareerInputProps) {
  const [careerPath, setCareerPath] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [errors, setErrors] = useState<{ careerPath?: string }>({});

  const handleAddInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const validate = (): boolean => {
    const newErrors: { careerPath?: string } = {};

    if (!careerPath.trim()) {
      newErrors.careerPath = '희망 진로를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const careerGoal: CareerGoal = {
      careerPath: careerPath.trim(),
      interests: interests.length > 0 ? interests : undefined,
      additionalInfo: additionalInfo.trim() || undefined,
    };

    onSubmit(careerGoal);
  };

  return (
    <Card shadow="xl" padding="lg" className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3" style={{ color: SejongColors.primary }}>
            희망 진로 입력
          </h2>
          <p className="text-gray-700">
            목표하는 진로를 입력하시면 AI가 맞춤형 로드맵을 생성합니다
          </p>
        </div>

        {/* Career Path Input */}
        <div>
          <Input
            label="희망 진로"
            type="text"
            value={careerPath}
            onChange={(e) => setCareerPath(e.target.value)}
            placeholder="예: AI/ML 엔지니어, 백엔드 개발자, 데이터 사이언티스트"
            error={errors.careerPath}
            required
            fullWidth
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            관심 분야 (선택)
          </label>

          {/* Selected Interests */}
          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.map((interest) => (
                <Tag
                  key={interest}
                  variant="primary"
                  onRemove={() => handleRemoveInterest(interest)}
                >
                  {interest}
                </Tag>
              ))}
            </div>
          )}

          {/* Suggested Interests */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_INTERESTS.filter((s) => !interests.includes(s)).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddInterest(suggestion)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-700 hover:bg-primary-50 transition-colors cursor-pointer"
                style={{
                  borderColor: SejongColors.border.medium,
                }}
              >
                + {suggestion}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-600 mt-2">
            관심 있는 분야를 선택하면 더 정확한 로드맵을 받을 수 있습니다
          </p>
        </div>

        {/* Additional Info */}
        <div>
          <Textarea
            label="추가 정보 (선택)"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="예: 대학원 진학 계획, 특정 기업 목표, 개발하고 싶은 서비스 등"
            rows={4}
            helperText="구체적인 목표나 계획이 있다면 작성해주세요"
            fullWidth
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="min-w-50"
          >
            {loading ? '로드맵 생성 중...' : 'AI 로드맵 생성하기'}
          </Button>
        </div>

        {/* Info Note */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p>AI 로드맵 생성에는 약 10-20초가 소요됩니다</p>
        </div>
      </form>
    </Card>
  );
}
