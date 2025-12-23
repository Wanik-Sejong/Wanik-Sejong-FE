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
 * Adapt this function to match your actual Excel format
 */
function parseTranscriptData(rawData: any[]): TranscriptData {
  const courses: Course[] = [];
  let totalCredits = 0;
  let majorCredits = 0;
  let generalCredits = 0;

  // Student info (if available in first row or header)
  const studentInfo = {
    name: rawData[0]?.['이름'] || rawData[0]?.['학생명'] || '학생',
    studentId: rawData[0]?.['학번'] || '',
    major: rawData[0]?.['전공'] || rawData[0]?.['학과'] || '',
    year: parseInt(rawData[0]?.['학년'] || '3'),
  };

  // Parse each row as a course
  for (const row of rawData) {
    // Skip header rows or empty rows
    if (!row['과목명'] && !row['교과목명']) continue;

    const courseName = row['과목명'] || row['교과목명'];
    const credits = parseFloat(row['학점'] || row['이수학점'] || '0');
    const category = row['구분'] || row['이수구분'] || '기타';

    if (!courseName) continue;

    const course: Course = {
      name: courseName,
      credits,
      year: parseInt(row['학년'] || row['이수학년'] || '0'),
      semester: row['학기'] || '',
      grade: row['성적'] || row['평점'] || '',
      category,
    };

    courses.push(course);
    totalCredits += credits;

    // Categorize credits
    if (category.includes('전공')) {
      majorCredits += credits;
    } else if (category.includes('교양')) {
      generalCredits += credits;
    }
  }

  return {
    studentInfo,
    courses,
    totalCredits,
    majorCredits,
    generalCredits,
  };
}
