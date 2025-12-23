/**
 * Roadmap to Markdown Converter
 * 로드맵 데이터를 Markdown 형식으로 변환
 */

import type { Roadmap, RoadmapPhase, RecommendedCourse, RecommendedTechStack } from './types';

/**
 * 로드맵 데이터를 Markdown 문자열로 변환
 */
export function convertRoadmapToMarkdown(roadmap: Roadmap): string {
  let markdown = '';

  // 1. 제목 및 메타 정보
  markdown += '# 🎓 나만의 학습 로드맵\n\n';
  markdown += `**생성 일시**: ${new Date(roadmap.generatedAt).toLocaleString('ko-KR')}\n\n`;
  markdown += '---\n\n';

  // 2. 진로 요약
  markdown += '## 📊 진로 요약\n\n';
  markdown += `${roadmap.careerSummary}\n\n`;
  markdown += '---\n\n';

  // 3. 현재 역량 분석
  markdown += '## 💪 현재 강점\n\n';
  if (roadmap.currentSkills.strengths.length > 0) {
    roadmap.currentSkills.strengths.forEach((strength) => {
      markdown += `- ${strength}\n`;
    });
  } else {
    markdown += '_데이터 없음_\n';
  }
  markdown += '\n';

  markdown += '## 📈 보완 필요 영역\n\n';
  if (roadmap.currentSkills.gaps.length > 0) {
    roadmap.currentSkills.gaps.forEach((gap) => {
      markdown += `- ${gap}\n`;
    });
  } else {
    markdown += '_데이터 없음_\n';
  }
  markdown += '\n---\n\n';

  // 4. 추천 학습 경로
  markdown += '## 📚 추천 학습 경로\n\n';

  if (roadmap.learningPath.length > 0) {
    roadmap.learningPath.forEach((phase, index) => {
      markdown += convertPhaseToMarkdown(phase, index + 1);
    });
  } else {
    markdown += '_학습 경로 데이터가 없습니다._\n\n';
  }

  // 5. 체크리스트 (간편한 추적용)
  markdown += '---\n\n';
  markdown += '## ✅ 학습 체크리스트\n\n';
  markdown += '_완료한 과목과 활동을 체크하며 진행 상황을 추적하세요!_\n\n';

  if (roadmap.learningPath.length > 0) {
    roadmap.learningPath.forEach((phase, index) => {
      markdown += convertPhaseToChecklist(phase, index + 1);
    });
  } else {
    markdown += '_체크리스트 항목이 없습니다._\n\n';
  }

  // 6. 추가 조언
  if (roadmap.advice) {
    markdown += '---\n\n';
    markdown += '## 💡 추가 조언\n\n';
    markdown += `${roadmap.advice}\n\n`;
  }

  // 7. 푸터
  markdown += '---\n\n';
  markdown += '_💡 이 로드맵은 AI가 생성한 추천사항입니다._  \n';
  markdown += '_실제 수강 계획은 담당 교수님 및 학과 사무실과 상담하여 결정하세요._\n';

  return markdown;
}

/**
 * 단일 Phase를 Markdown으로 변환
 */
function convertPhaseToMarkdown(phase: RoadmapPhase, phaseNumber: number): string {
  let markdown = '';

  // Phase 헤더
  markdown += `### Phase ${phaseNumber}: ${phase.period}\n\n`;
  markdown += `**🎯 목표**: ${phase.goal}\n\n`;

  // 추천 과목
  if (phase.courses && phase.courses.length > 0) {
    markdown += '#### 📘 추천 과목\n\n';
    phase.courses.forEach((course, index) => {
      markdown += convertCourseToMarkdown(course, index + 1);
    });
    markdown += '\n';
  }

  // 추천 기술스택
  if (phase.techStacks && phase.techStacks.length > 0) {
    markdown += '#### 💻 추천 기술스택\n\n';
    phase.techStacks.forEach((tech) => {
      markdown += convertTechStackToMarkdown(tech);
    });
    markdown += '\n';
  }

  // 추천 활동
  if (phase.activities && phase.activities.length > 0) {
    markdown += '#### 🎯 추천 활동\n\n';
    phase.activities.forEach((activity) => {
      markdown += `- ${activity}\n`;
    });
    markdown += '\n';
  }

  markdown += '---\n\n';

  return markdown;
}

/**
 * 단일 Course를 Markdown으로 변환
 */
function convertCourseToMarkdown(course: RecommendedCourse, courseNumber: number): string {
  let markdown = '';

  // 우선순위 이모지
  const priorityEmoji: Record<'high' | 'medium' | 'low', string> = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  const priority = course.priority || 'medium';
  const emoji = priorityEmoji[priority] || '⚪';

  // 과목명 및 기본 정보
  markdown += `${courseNumber}. **${course.name}**`;

  // 이수구분
  if (course.type) {
    markdown += ` (${course.type})`;
  }

  // 우선순위
  markdown += ` ${emoji} _${getPriorityText(priority)}_\n`;

  // 이유
  if (course.reason) {
    markdown += `   - 💡 **추천 이유**: ${course.reason}\n`;
  }

  // 선수과목
  if (course.prerequisites && course.prerequisites.length > 0) {
    markdown += `   - 📋 **선수과목**: ${course.prerequisites.join(', ')}\n`;
  }

  markdown += '\n';

  return markdown;
}

/**
 * 단일 TechStack을 Markdown으로 변환
 */
function convertTechStackToMarkdown(tech: RecommendedTechStack): string {
  let markdown = `- **${tech.name}**`;

  if (tech.category) {
    const categoryMap: Record<string, string> = {
      framework: '프레임워크',
      library: '라이브러리',
      tool: '도구',
      language: '언어',
      database: '데이터베이스',
      platform: '플랫폼',
    };
    const categoryText = categoryMap[tech.category] || tech.category;
    markdown += ` (${categoryText})`;
  }

  if (tech.reason) {
    markdown += `  \n  ${tech.reason}`;
  }

  if (tech.difficulty) {
    const difficultyText = ['초급', '초중급', '중급', '중고급', '고급'][tech.difficulty - 1] || '중급';
    markdown += `  \n  난이도: ${difficultyText}`;
  }

  markdown += '\n';

  return markdown;
}

/**
 * 우선순위를 텍스트로 변환
 */
function getPriorityText(priority: 'high' | 'medium' | 'low'): string {
  const priorityMap = {
    high: '높음 (필수)',
    medium: '중간 (권장)',
    low: '낮음 (선택)',
  };

  return priorityMap[priority] || '알 수 없음';
}

/**
 * Phase를 체크리스트 형식으로 변환
 */
function convertPhaseToChecklist(phase: RoadmapPhase, phaseNumber: number): string {
  let markdown = '';

  // Phase 헤더
  markdown += `### Phase ${phaseNumber}: ${phase.period}\n\n`;

  // 과목 체크리스트
  if (phase.courses && phase.courses.length > 0) {
    markdown += '**📘 과목**\n\n';
    phase.courses.forEach((course) => {
      const priorityEmoji: Record<'high' | 'medium' | 'low', string> = {
        high: '🔴',
        medium: '🟡',
        low: '🟢',
      };
      const priority = course.priority || 'medium';
      const emoji = priorityEmoji[priority] || '⚪';

      markdown += `- [ ] ${emoji} ${course.name}`;
      if (course.type) {
        markdown += ` (${course.type})`;
      }
      markdown += '\n';
    });
    markdown += '\n';
  }

  // 기술스택 체크리스트
  if (phase.techStacks && phase.techStacks.length > 0) {
    markdown += '**💻 기술스택**\n\n';
    phase.techStacks.forEach((tech) => {
      markdown += `- [ ] ${tech.name}`;
      if (tech.category) {
        const categoryMap: Record<string, string> = {
          framework: '프레임워크',
          library: '라이브러리',
          tool: '도구',
          language: '언어',
          database: '데이터베이스',
          platform: '플랫폼',
        };
        const categoryText = categoryMap[tech.category] || tech.category;
        markdown += ` (${categoryText})`;
      }
      markdown += '\n';
    });
    markdown += '\n';
  }

  // 활동 체크리스트
  if (phase.activities && phase.activities.length > 0) {
    markdown += '**🎯 활동**\n\n';
    phase.activities.forEach((activity) => {
      markdown += `- [ ] ${activity}\n`;
    });
    markdown += '\n';
  }

  return markdown;
}

/**
 * Markdown 특수문자 이스케이프
 * (현재는 필요 없지만 향후 확장 가능)
 */
export function escapeMarkdown(text: string): string {
  // Markdown 특수문자: * _ [ ] ( ) # + - . !
  return text.replace(/([*_[\]()#+\-.!])/g, '\\$1');
}
