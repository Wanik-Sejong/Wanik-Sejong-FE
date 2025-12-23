import { NextRequest, NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import type { TranscriptData, Course, ParseExcelResponse } from '@/lib/types';

/**
 * POST /api/parse-excel
 * Parse Excel transcript file and extract course data
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json<ParseExcelResponse>(
        {
          success: false,
          error: '파일이 업로드되지 않았습니다.',
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json<ParseExcelResponse>(
        {
          success: false,
          error: '엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.',
        },
        { status: 400 }
      );
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel file
    const workbook = xlsx.read(buffer, { type: 'buffer' });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData: any[] = xlsx.utils.sheet_to_json(worksheet);

    if (!rawData || rawData.length === 0) {
      return NextResponse.json<ParseExcelResponse>(
        {
          success: false,
          error: '엑셀 파일에 데이터가 없습니다.',
        },
        { status: 400 }
      );
    }

    // Parse transcript data
    const transcriptData = parseTranscriptData(rawData);

    return NextResponse.json<ParseExcelResponse>({
      success: true,
      data: transcriptData,
      message: '성적표 파싱 완료',
    });
  } catch (error) {
    console.error('Parse Excel error:', error);
    return NextResponse.json<ParseExcelResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : '파일 파싱 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

/**
 * Parse raw Excel data into TranscriptData structure
 * Adapted to match the new API specification
 */
function parseTranscriptData(rawData: any[]): TranscriptData {
  const courses: Course[] = [];
  let totalCredits = 0;
  let totalMajorCredits = 0;
  let totalGeneralCredits = 0;
  let totalGradePoints = 0;

  // Parse each row as a course
  for (const row of rawData) {
    // Skip header rows or empty rows
    if (!row['과목명'] && !row['교과목명']) continue;

    const courseName = row['과목명'] || row['교과목명'];
    const credits = parseFloat(row['학점'] || row['이수학점'] || '0');
    const courseType = row['구분'] || row['이수구분'] || '기타';
    const grade = row['성적'] || row['등급'] || '';

    if (!courseName) continue;

    const course: Course = {
      courseCode: row['학수번호'] || '',
      courseName,
      courseType,
      teachingArea: row['교직영역'] || null,
      selectedArea: row['선택영역'] || null,
      credits,
      evaluationType: row['평가방식'] || '절대평가',
      grade,
      gradePoint: parseGradePoint(row['평점'] || grade),
      departmentCode: row['개설학과코드'] || null,
    };

    courses.push(course);
    totalCredits += credits;
    totalGradePoints += course.gradePoint * credits;

    // Categorize credits
    if (courseType.includes('전공')) {
      totalMajorCredits += credits;
    } else if (courseType.includes('교양')) {
      totalGeneralCredits += credits;
    }
  }

  // Calculate average GPA
  const averageGPA = totalCredits > 0
    ? Math.round((totalGradePoints / totalCredits) * 100) / 100
    : 0;

  return {
    courses,
    totalCredits,
    totalMajorCredits,
    totalGeneralCredits,
    averageGPA,
  };
}

/**
 * Convert grade letter to grade point
 * @param grade Grade letter (A+, A, B+, etc.) or numeric grade point
 * @returns Grade point value (0.0 - 4.5)
 */
function parseGradePoint(grade: string | number): number {
  // If already a number, return it
  if (typeof grade === 'number') return grade;

  // Convert string to number if possible
  const numericGrade = parseFloat(grade);
  if (!isNaN(numericGrade)) return numericGrade;

  // Grade letter to grade point mapping (4.5 scale)
  const gradeMap: Record<string, number> = {
    'A+': 4.5,
    'A': 4.0,
    'B+': 3.5,
    'B': 3.0,
    'C+': 2.5,
    'C': 2.0,
    'D+': 1.5,
    'D': 1.0,
    'F': 0.0,
    'P': 0.0, // Pass (no grade point)
    'NP': 0.0, // No Pass
  };

  return gradeMap[grade.toUpperCase()] || 0.0;
}
