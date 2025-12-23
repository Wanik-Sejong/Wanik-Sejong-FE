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
 * Extract year and semester from row data
 * Tries multiple column name variations
 */
function extractYearAndSemester(row: any): {
  year: number;
  semester: number;
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentSemester = currentMonth >= 3 && currentMonth <= 8 ? 1 : 2;

  // Try to extract year
  let year = currentYear;
  const yearField =
    row['이수연도'] ||
    row['연도'] ||
    row['년도'] ||
    row['학년도'] ||
    row['Year'] ||
    row['year'];

  if (yearField) {
    const parsedYear = parseInt(String(yearField), 10);
    if (!isNaN(parsedYear) && parsedYear >= 2000 && parsedYear <= 2100) {
      year = parsedYear;
    }
  }

  // Try to extract semester
  let semester = currentSemester;
  const semesterField =
    row['이수학기'] ||
    row['학기'] ||
    row['Semester'] ||
    row['semester'] ||
    row['Term'] ||
    row['term'];

  if (semesterField) {
    const semesterStr = String(semesterField).toLowerCase();
    if (semesterStr.includes('1') || semesterStr.includes('first') || semesterStr.includes('봄') || semesterStr.includes('spring')) {
      semester = 1;
    } else if (semesterStr.includes('2') || semesterStr.includes('second') || semesterStr.includes('가을') || semesterStr.includes('fall')) {
      semester = 2;
    }
  }

  return { year, semester };
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

    // Extract year and semester (for backend compatibility)
    // Note: Frontend Course type doesn't include these fields yet
    // This data is available for future backend integration
    const { year, semester } = extractYearAndSemester(row);

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

    // Store year/semester in course object for potential backend use
    // These fields will be used by backend adapter
    (course as any).completedYear = year;
    (course as any).completedSemester = semester;

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
  const averageGPA =
    totalCredits > 0
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
