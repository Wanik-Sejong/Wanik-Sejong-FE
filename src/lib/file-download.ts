/**
 * File Download Utilities
 * 브라우저에서 파일 다운로드 기능 제공
 */

/**
 * Markdown 파일 다운로드
 * @param content - Markdown 문자열
 * @param filename - 다운로드 파일명 (확장자 포함)
 */
export function downloadMarkdownFile(content: string, filename: string): void {
  try {
    // 1. Blob 생성 (UTF-8 인코딩)
    const blob = new Blob([content], {
      type: 'text/markdown;charset=utf-8',
    });

    // 2. URL 생성
    const url = URL.createObjectURL(blob);

    // 3. 다운로드 링크 생성 및 클릭
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // 숨겨진 링크를 DOM에 추가
    document.body.appendChild(link);

    // 다운로드 트리거
    link.click();

    // 4. 메모리 정리
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Markdown file downloaded:', filename);
  } catch (error) {
    console.error('❌ Failed to download markdown file:', error);
    throw error;
  }
}

/**
 * 텍스트 파일 다운로드 (범용)
 * @param content - 파일 내용
 * @param filename - 다운로드 파일명
 * @param mimeType - MIME 타입 (기본값: text/plain)
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain;charset=utf-8'
): void {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Text file downloaded:', filename);
  } catch (error) {
    console.error('❌ Failed to download text file:', error);
    throw error;
  }
}

/**
 * JSON 파일 다운로드
 * @param data - JSON으로 변환할 객체
 * @param filename - 다운로드 파일명 (.json 확장자 자동 추가)
 */
export function downloadJsonFile(data: unknown, filename: string): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], {
      type: 'application/json;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.json') ? filename : `${filename}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ JSON file downloaded:', filename);
  } catch (error) {
    console.error('❌ Failed to download JSON file:', error);
    throw error;
  }
}

/**
 * 안전한 파일명 생성 (특수문자 제거)
 * @param text - 원본 텍스트
 * @returns 안전한 파일명
 */
export function sanitizeFilename(text: string): string {
  return text
    .replace(/[^가-힣a-zA-Z0-9\s\-_]/g, '') // 특수문자 제거
    .replace(/\s+/g, '_') // 공백을 언더스코어로
    .substring(0, 100); // 최대 길이 제한
}

/**
 * 타임스탬프 파일명 생성
 * @param prefix - 파일명 접두사
 * @param extension - 파일 확장자 (점 포함)
 * @returns 타임스탬프가 포함된 파일명
 */
export function generateTimestampedFilename(
  prefix: string,
  extension: string
): string {
  const timestamp = new Date().toISOString().split('T')[0]; // 2025-12-24
  return `${prefix}_${timestamp}${extension}`;
}
