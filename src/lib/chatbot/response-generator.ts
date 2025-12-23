/**
 * Response Generator
 * 검색 결과를 Markdown 형식으로 변환
 */

import type { CourseData, SearchResult, SearchIntent } from './types';

export class ResponseGenerator {
  /**
   * Markdown 응답 생성
   */
  generateMarkdown(query: string, result: SearchResult): string {
    const { courses, intent } = result;

    if (courses.length === 0) {
      return this.generateNoResultsMessage(query);
    }

    if (courses.length === 1) {
      return this.generateSingleCourseResponse(courses[0], intent);
    }

    return this.generateMultipleCourseResponse(courses, intent);
  }

  /**
   * 검색 결과 없음 메시지
   */
  private generateNoResultsMessage(query: string): string {
    return `
죄송합니다. **"${query}"**에 대한 검색 결과를 찾지 못했습니다. 😢

다른 키워드로 검색해보시겠어요?

**검색 팁:**
- 과목명: "C프로그래밍", "자료구조", "알고리즘"
- 교수님: "김도년", "안용학"
- 요일: "월요일", "화요일 오후"
- 이수구분: "전필", "전선", "교필"
    `.trim();
  }

  /**
   * 단일 강의 상세 응답
   */
  private generateSingleCourseResponse(course: CourseData, intent: SearchIntent): string {
    const scheduleInfo = this.formatSchedule(course['요일 및 강의시간']);

    return `
## ${course.교과목명}

| 항목 | 내용 |
|------|------|
| 학수번호 | ${course.학수번호}-${course.분반} |
| 이수구분 | ${course.이수구분} |
| 학점 | ${course['학점/이론/실습']} |
| 교수님 | ${course.교수명} |
| 강의시간 | ${scheduleInfo} |
| 강의실 | ${course.강의실 || '미정'} |
| 학년 | ${course['학년 (학기)']}학년 |

${this.generateAdditionalInfo(course)}
    `.trim();
  }

  /**
   * 다중 강의 목록 응답
   */
  private generateMultipleCourseResponse(courses: CourseData[], intent: SearchIntent): string {
    const count = courses.length;
    const display = courses.slice(0, 10); // 최대 10개만 표시

    let response = `## 검색 결과 (총 ${count}개)\n\n`;

    for (let i = 0; i < display.length; i++) {
      const course = display[i];
      const scheduleInfo = this.formatSchedule(course['요일 및 강의시간']);

      response += `
### ${i + 1}. ${course.교과목명}
- **학수번호**: ${course.학수번호}-${course.분반}
- **교수님**: ${course.교수명}
- **이수구분**: ${course.이수구분}
- **시간**: ${scheduleInfo}
- **강의실**: ${course.강의실 || '미정'}
- **학점**: ${course['학점/이론/실습']}

`;
    }

    if (count > 10) {
      response += `\n> 💡 ${count - 10}개의 추가 결과가 있습니다. 더 구체적인 키워드로 검색해보세요.\n`;
    }

    response += `\n> 📌 특정 과목의 자세한 정보를 보려면 과목명을 다시 검색해주세요.`;

    return response.trim();
  }

  /**
   * 강의시간 포맷팅
   */
  private formatSchedule(schedule: string | null): string {
    if (!schedule) return '미정';

    // "월화수목금13:00-16:00" → "월화수목금 13:00-16:00"
    const formatted = schedule.replace(/([월화수목금토일]+)(\d{2}:\d{2})/g, '$1 $2');
    return formatted;
  }

  /**
   * 추가 정보 생성
   */
  private generateAdditionalInfo(course: CourseData): string {
    const info: string[] = [];

    if (course.강좌유형) {
      info.push(`**강좌유형**: ${course.강좌유형}`);
    }

    if (course.학점교류수강가능 === 'Y') {
      info.push(`✅ 학점교류 수강 가능`);
    }

    if (course['수강대상 및 유의사항']) {
      info.push(`**유의사항**: ${course['수강대상 및 유의사항']}`);
    }

    if (course.사이버강좌) {
      info.push(`💻 사이버 강좌`);
    }

    return info.length > 0 ? `\n${info.join('\n')}` : '';
  }
}
