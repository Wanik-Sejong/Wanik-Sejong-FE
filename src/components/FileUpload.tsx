'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SejongColors } from '@/styles/colors';
import { Button } from './ui/Button';
import type { TranscriptData } from '@/lib/types';
import { parseExcel } from '@/lib/api-client';

interface FileUploadProps {
  onUploadSuccess: (data: TranscriptData) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // 🔍 디버깅: 파일 정보 출력

      setFileName(file.name);
      setError(null);
      setUploading(true);

      try {
        const result = await parseExcel(file);


        if (result.success && result.data) {

          // Log first 3 courses for verification
          if (result.data.courses.length > 0) {
          } else {
            console.warn('⚠️ Warning: No courses parsed from Excel file!');
          }

          onUploadSuccess(result.data);
        } else {
          const errorMsg = result.error || '파일 업로드 중 오류가 발생했습니다.';
          console.error('❌ Excel parsing failed:', errorMsg);
          setError(errorMsg);
          onUploadError?.(errorMsg);
        }
      } catch (err) {
        console.error('❌ Exception during file upload:', err);

        // Detailed error logging
        if (err instanceof Error) {
          console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
          });
        }

        let errorMsg = '알 수 없는 오류가 발생했습니다.';
        if (err instanceof Error) {
          if (err.message.includes('network') || err.message.includes('fetch')) {
            errorMsg = '🌐 네트워크 연결을 확인해주세요.';
          } else if (err.message.includes('timeout')) {
            errorMsg = '⏱️ 요청 시간이 초과되었습니다. 다시 시도해주세요.';
          } else {
            errorMsg = err.message;
          }
        }

        setError(errorMsg);
        onUploadError?.(errorMsg);
      } finally {
        setUploading(false);
      }
    },
    [onUploadSuccess, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12
          transition-all duration-200
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400 hover:bg-gray-50'}
        `}
        style={{
          borderColor: isDragActive ? SejongColors.primary : undefined,
          backgroundColor: isDragActive ? SejongColors.primary50 : undefined,
        }}
      >
        <input {...getInputProps()} />

        <div className="text-center">
          {/* Icon */}
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: isDragActive ? SejongColors.primary : SejongColors.secondary }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="mb-4">
            {uploading ? (
              <>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  파일 업로드 중...
                </p>
                <p className="text-sm text-gray-500">{fileName}</p>
              </>
            ) : isDragActive ? (
              <p className="text-lg font-semibold" style={{ color: SejongColors.primary }}>
                여기에 파일을 놓으세요
              </p>
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  성적표 엑셀 파일을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-sm text-gray-500">
                  지원 형식: .xlsx, .xls (최대 1개 파일)
                </p>
              </>
            )}
          </div>

          {/* Upload Button */}
          {!uploading && !isDragActive && (
            <Button variant="primary" size="lg" className="mt-4">
              📁 파일 선택하기
            </Button>
          )}

          {/* Loading Indicator */}
          {uploading && (
            <div className="mt-6">
              <div className="flex justify-center items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: SejongColors.primary, animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: SejongColors.primary, animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: SejongColors.primary, animationDelay: '300ms' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">업로드 실패</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Tip: 세종대학교 포털에서 다운로드한 성적표 엑셀 파일을 사용하세요.</p>
      </div>

      {/* Test Data Button (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUseTestData}
            disabled={uploading}
          >
            🧪 테스트 데이터 사용 (개발용)
          </Button>
        </div>
      )}
    </div>
  );

  function handleUseTestData() {

    const testData: TranscriptData = {
      courses: [
        {
          courseCode: 'CS101',
          courseName: '프로그래밍 기초',
          courseType: '전공필수',
          teachingArea: null,
          selectedArea: null,
          credits: 3.0,
          evaluationType: '절대평가',
          grade: 'A+',
          gradePoint: 4.5,
          departmentCode: 'COMP',
        },
        {
          courseCode: 'CS201',
          courseName: '자료구조',
          courseType: '전공필수',
          teachingArea: null,
          selectedArea: null,
          credits: 3.0,
          evaluationType: '절대평가',
          grade: 'A',
          gradePoint: 4.0,
          departmentCode: 'COMP',
        },
        {
          courseCode: 'CS301',
          courseName: '데이터베이스',
          courseType: '전공선택',
          teachingArea: null,
          selectedArea: null,
          credits: 3.0,
          evaluationType: '절대평가',
          grade: 'A+',
          gradePoint: 4.5,
          departmentCode: 'COMP',
        },
        {
          courseCode: 'CS302',
          courseName: '운영체제',
          courseType: '전공선택',
          teachingArea: null,
          selectedArea: null,
          credits: 3.0,
          evaluationType: '절대평가',
          grade: 'A',
          gradePoint: 4.0,
          departmentCode: 'COMP',
        },
        {
          courseCode: 'GE101',
          courseName: '영어회화',
          courseType: '교양필수',
          teachingArea: null,
          selectedArea: '외국어',
          credits: 2.0,
          evaluationType: '절대평가',
          grade: 'B+',
          gradePoint: 3.5,
          departmentCode: 'GE',
        },
      ],
      totalCredits: 65.0,
      totalMajorCredits: 50.0,
      totalGeneralCredits: 15.0,
      averageGPA: 4.2,
    };


    setFileName('test-data.xlsx');
    setError(null);
    onUploadSuccess(testData);
  }
}
