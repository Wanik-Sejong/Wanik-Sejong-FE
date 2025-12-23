/**
 * Backend Data Adapter
 * Converts between frontend and backend data structures
 */

import type {
  TranscriptData,
  Course,
  CareerGoal,
  Roadmap,
  RoadmapPhase,
  RecommendedCourse,
  RecommendedSubject,
  RecommendedTechStack,
} from '@/lib/types';
import type {
  BackendTranscript,
  BackendCourse,
  BackendRoadmapResponse,
  CoursePlan,
  ExtracurricularPlan,
} from '@/lib/types/backend.types';

/**
 * Convert frontend TranscriptData to backend Transcript
 * Adds required fields and handles optional to required conversion
 *
 * @param transcript Frontend transcript data
 * @returns Backend-compatible transcript
 */
export function toBackendTranscript(transcript: TranscriptData): BackendTranscript {
  // Get current date for default year/semester
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentSemester = currentMonth >= 3 && currentMonth <= 8 ? 1 : 2;

  // Convert courses with default year/semester
  const backendCourses: BackendCourse[] = transcript.courses.map((course) => ({
    completedYear: currentYear, // Default: current year
    completedSemester: currentSemester, // Default: current semester
    courseCode: course.courseCode,
    courseName: course.courseName,
    courseType: course.courseType,
    teachingArea: course.teachingArea || null,
    selectedArea: course.selectedArea || null,
    credits: course.credits,
    evaluationType: course.evaluationType,
    grade: course.grade,
    gradePoint: course.gradePoint,
    departmentCode: course.departmentCode || '',
  }));

  return {
    courses: backendCourses,
    totalCredits: transcript.totalCredits,
    totalMajorCredits: transcript.totalMajorCredits || 0,
    totalGeneralCredits: transcript.totalGeneralCredits || 0,
    averageGPA: transcript.averageGPA || 0,
  };
}

/**
 * Convert backend Transcript to frontend TranscriptData
 * Removes semester tracking fields for frontend compatibility
 *
 * @param backendTranscript Backend transcript data
 * @returns Frontend-compatible transcript
 */
export function fromBackendTranscript(backendTranscript: BackendTranscript): TranscriptData {
  const frontendCourses: Course[] = backendTranscript.courses.map((course) => ({
    courseCode: course.courseCode,
    courseName: course.courseName,
    courseType: course.courseType,
    teachingArea: course.teachingArea,
    selectedArea: course.selectedArea,
    credits: course.credits,
    evaluationType: course.evaluationType,
    grade: course.grade,
    gradePoint: course.gradePoint,
    departmentCode: course.departmentCode,
  }));

  return {
    courses: frontendCourses,
    totalCredits: backendTranscript.totalCredits,
    totalMajorCredits: backendTranscript.totalMajorCredits,
    totalGeneralCredits: backendTranscript.totalGeneralCredits,
    averageGPA: backendTranscript.averageGPA,
  };
}

/**
 * Convert frontend CareerGoal to backend format (string)
 * Combines careerPath, interests, and additionalInfo into prompt format
 *
 * @param careerGoal Frontend career goal object
 * @returns Backend-compatible career goal string
 */
export function toBackendCareerGoal(careerGoal: CareerGoal): string {
  let prompt = careerGoal.careerPath;

  // Add interests if provided
  if (careerGoal.interests && careerGoal.interests.length > 0) {
    prompt += `. 관심 분야: ${careerGoal.interests.join(', ')}`;
  }

  // Add additional info if provided
  if (careerGoal.additionalInfo) {
    prompt += `. ${careerGoal.additionalInfo}`;
  }

  return prompt;
}

/**
 * Convert backend CoursePlan to frontend RoadmapPhase
 * Maps coursePlan structure to learningPath structure
 *
 * @param coursePlan Backend course plan
 * @returns Frontend roadmap phase
 */
function convertCoursePlanToPhase(coursePlan: CoursePlan): RoadmapPhase {

  coursePlan.courses.forEach((c: any, idx) => {
  });

  // ✅ TEMPORARY COMPATIBILITY FIX: Accept both backend format and frontend format
  // Backend SHOULD send {courseName, courseType} but currently sends {name, type}
  // See: claudedocs/BACKEND_API_FORMAT_MISMATCH.md
  const recommendedCourses: RecommendedCourse[] = coursePlan.courses
    .map((course: any): RecommendedCourse | null => {
      // Accept both formats: courseName OR name, courseType OR type
      const courseName = course.courseName || course.name;
      const courseType = course.courseType || course.type;

      // Skip courses with no type at all
      if (!courseType) {
        console.warn('⚠️ [Backend Adapter] courseType/type 완전 누락된 과목:', {
          period: coursePlan.period,
          rawCourse: course,
        });
        return null;
      }

      // Log format detection for monitoring
      const usingFrontendFormat = !course.courseType && course.type;
      const usingBackendFormat = !!course.courseType;

      if (usingFrontendFormat) {
        console.warn(`  ⚠️ [과목 ${course.name || course.courseName}] 프론트엔드 형식 감지 (잘못됨!)`);
        console.warn(`     - 사용된 필드: name="${course.name}", type="${course.type}"`);
        console.warn(`     - 기대 필드: courseName, courseType`);
        console.warn(`     - 문서 참조: claudedocs/BACKEND_API_FORMAT_MISMATCH.md`);
      } else if (usingBackendFormat) {
      }

      // Map priority from Korean to English
      let priority: 'high' | 'medium' | 'low' | undefined = 'medium';
      if (course.priority) {
        const priorityLower = course.priority.toLowerCase();
        if (priorityLower === '필수' || priorityLower === 'high') {
          priority = 'high';
        } else if (priorityLower === '선택' || priorityLower === 'low') {
          priority = 'low';
        }
      }

      return {
        name: courseName || '과목명 없음',
        type: courseType,
        reason: course.reason || `${courseType} 과목`,
        priority,
      };
    })
    .filter((course): course is RecommendedCourse => course !== null);


  if (recommendedCourses.length === 0 && coursePlan.courses.length > 0) {
    console.error('  ❌ 경고: 모든 과목이 필터링되었습니다!');
  }

  recommendedCourses.forEach((course, idx) => {
  });


  return {
    period: coursePlan.period,
    goal: coursePlan.goal,
    courses: recommendedCourses,
    effort: coursePlan.effort,
  };
}

/**
 * Convert backend ExtracurricularPlan to frontend RoadmapPhase
 * Maps extracurricular activities to roadmap phase format
 *
 * @param extracurricularPlan Backend extracurricular plan
 * @returns Frontend roadmap phase
 */
function convertExtracurricularToPhase(
  extracurricularPlan: ExtracurricularPlan
): RoadmapPhase {
  // ✅ 방어적 처리: ExtracurricularPlan에 courses 필드가 있을 경우 대비
  // 타입 정의에는 없지만 백엔드가 예상치 못하게 courses를 보낼 가능성 대비
  const planWithPossibleCourses = extracurricularPlan as ExtracurricularPlan & {
    courses?: BackendCourse[];
  };

  const courses =
    planWithPossibleCourses.courses && Array.isArray(planWithPossibleCourses.courses)
      ? planWithPossibleCourses.courses
          .map((c: any): RecommendedCourse | null => {
            // ✅ TEMPORARY COMPATIBILITY FIX: Accept both formats
            const courseName = c.courseName || c.name;
            const courseType = c.courseType || c.type;

            if (!courseType) {
              console.warn('⚠️ [Backend Adapter] ExtracurricularPlan에서 courseType/type 누락:', {
                period: extracurricularPlan.period,
                rawCourse: c,
              });
              return null;
            }

            const usingFrontendFormat = !c.courseType && c.type;
            if (usingFrontendFormat) {
              console.warn('🔄 [Backend Adapter] Extracurricular - Frontend format detected:', {
                period: extracurricularPlan.period,
                courseName,
                courseType,
              });
            }

            return {
              name: courseName || '과목명 없음',
              type: courseType,
              reason: c.reason || `비교과: ${courseType}`,
              priority: 'medium',
            };
          })
          .filter((c): c is RecommendedCourse => c !== null)
      : []; // courses 필드가 없거나 배열이 아니면 빈 배열

  return {
    period: extracurricularPlan.period,
    goal: extracurricularPlan.goal,
    courses,
    activities: extracurricularPlan.activities,
    effort: extracurricularPlan.effort,
  };
}

/**
 * Convert backend recommendedTechStack (string[]) to frontend RecommendedTechStack[]
 * Infers category and priority from tech stack name
 *
 * @param techStackNames Backend tech stack names (simple strings)
 * @returns Frontend-compatible RecommendedTechStack array
 */
function convertTechStackNamesToObjects(
  techStackNames: string[]
): RecommendedTechStack[] {
  // 기술스택 이름에서 카테고리 추론
  const inferCategory = (name: string): RecommendedTechStack['category'] => {
    const lowerName = name.toLowerCase();

    // Framework
    if (/spring|react|vue|angular|next|express|django|flask|fastapi/i.test(lowerName)) {
      return 'framework';
    }

    // Database
    if (/sql|postgres|mysql|mongodb|redis|oracle|mariadb|dynamodb|cassandra/i.test(lowerName)) {
      return 'database';
    }

    // Tool
    if (/docker|kubernetes|jenkins|git|gradle|maven|npm|webpack|vite|babel/i.test(lowerName)) {
      return 'tool';
    }

    // Platform
    if (/aws|azure|gcp|heroku|vercel|netlify|ec2|s3|lambda/i.test(lowerName)) {
      return 'platform';
    }

    // Language
    if (/java|python|javascript|typescript|kotlin|go|rust|swift|c\+\+|c#/i.test(lowerName)) {
      return 'language';
    }

    // Default: library
    return 'library';
  };

  // 우선순위 추론 (배열 순서 기반)
  const inferPriority = (index: number, total: number): RecommendedTechStack['priority'] => {
    // 첫 30%는 high, 중간 40%는 medium, 나머지는 low
    const ratio = index / total;
    if (ratio < 0.3) return 'high';
    if (ratio < 0.7) return 'medium';
    return 'low';
  };

  return techStackNames.map((name, index) => ({
    name,
    category: inferCategory(name),
    reason: `${name}은(는) 이 진로에 필요한 핵심 기술입니다.`,
    priority: inferPriority(index, techStackNames.length),
    difficulty: undefined, // AI가 제공하지 않으므로 생략
    resources: undefined,
    prerequisites: undefined,
  }));
}

/**
 * Convert backend RoadmapResponse to frontend Roadmap
 * Merges coursePlan and extracurricularPlan into learningPath
 *
 * @param backendRoadmap Backend roadmap response
 * @returns Frontend-compatible roadmap
 */
export function fromBackendRoadmap(backendRoadmap: BackendRoadmapResponse): Roadmap {

  // Convert coursePlan to phases
  const coursePhases: RoadmapPhase[] = backendRoadmap.coursePlan.map(
    convertCoursePlanToPhase
  );

  // Convert extracurricularPlan to phases
  const extracurricularPhases: RoadmapPhase[] =
    backendRoadmap.extracurricularPlan.map(convertExtracurricularToPhase);

  // Convert recommendedTechStack to RecommendedTechStack[]
  const techStacks: RecommendedTechStack[] = backendRoadmap.recommendedTechStack
    ? convertTechStackNamesToObjects(backendRoadmap.recommendedTechStack)
    : [];

  if (techStacks.length > 0) {
    techStacks.slice(0, 3).forEach((tech, idx) => {
    });
  }

  // Distribute tech stacks across phases
  // 전략: 첫 번째 CoursePlan Phase에 모든 기술스택 배치
  if (coursePhases.length > 0 && techStacks.length > 0) {
    coursePhases[0].techStacks = techStacks;
  }


  coursePhases.forEach((p, idx) => {
  });

  extracurricularPhases.forEach((p, idx) => {
  });

  // Merge and sort by period (chronological order)
  const learningPath: RoadmapPhase[] = [...coursePhases, ...extracurricularPhases].sort(
    (a, b) => {
      // Simple chronological sort by period string
      return a.period.localeCompare(b.period);
    }
  );

  const totalCourses = learningPath.reduce((sum, p) => sum + p.courses.length, 0);
  const totalActivities = learningPath.reduce((sum, p) => sum + (p.activities?.length || 0), 0);
  const totalTechStacks = learningPath.reduce((sum, p) => sum + (p.techStacks?.length || 0), 0);


  if (totalCourses === 0) {
    console.error('\n  ❌ 경고: 변환된 과목이 0개입니다!');
    console.error('  - 백엔드 API가 잘못된 형식으로 데이터를 보냈을 가능성이 높습니다.');
    console.error('  - 문서 참조: claudedocs/BACKEND_API_FORMAT_MISMATCH.md');
  }

  // ✅ Convert subjectRecommendations to frontend format
  const recommendedSubjects: RecommendedSubject[] =
    backendRoadmap.subjectRecommendations?.subjects.map((scoredSubject) => ({
      courseCode: scoredSubject.subject.courseCode,
      courseName: scoredSubject.subject.courseName,
      courseType: scoredSubject.subject.courseType,
      selectedArea: scoredSubject.subject.selectedArea,
      credits: scoredSubject.subject.credits,
      gradeLevel: scoredSubject.subject.gradeLevel,
      score: scoredSubject.score,
      reasons: scoredSubject.reasons,
      offeringDepartmentMajor: scoredSubject.subject.offeringDepartmentMajor,
      lectureLanguage: scoredSubject.subject.lectureLanguage,
      courseFormat: scoredSubject.subject.courseFormat,
    })) || [];

  if (recommendedSubjects.length > 0) {
    recommendedSubjects.slice(0, 3).forEach((subject, idx) => {
    });
  }


  return {
    careerSummary: backendRoadmap.careerSummary,
    currentSkills: backendRoadmap.currentSkills,
    learningPath,
    advice: backendRoadmap.advice,
    generatedAt: backendRoadmap.generatedAt,
    recommendedSubjects,
  };
}

/**
 * Enhance frontend Roadmap with backend additional data
 * Adds subjectRecommendations and weightHints to roadmap
 * (For future UI integration)
 *
 * @param roadmap Frontend roadmap
 * @param backendRoadmap Backend roadmap with additional data
 * @returns Enhanced roadmap with metadata
 */
export function enhanceRoadmapWithBackendData(
  roadmap: Roadmap,
  backendRoadmap: BackendRoadmapResponse
): Roadmap & {
  subjectRecommendations?: BackendRoadmapResponse['subjectRecommendations'];
  weightHints?: BackendRoadmapResponse['weightHints'];
} {
  return {
    ...roadmap,
    subjectRecommendations: backendRoadmap.subjectRecommendations,
    weightHints: backendRoadmap.weightHints,
  };
}

/**
 * Validate backend transcript data
 * Ensures all required fields are present and valid
 *
 * @param data Backend transcript data
 * @returns True if valid, throws error otherwise
 */
export function validateBackendTranscript(data: unknown): data is BackendTranscript {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid transcript data: not an object');
  }

  const transcript = data as BackendTranscript;

  if (!Array.isArray(transcript.courses)) {
    throw new Error('Invalid transcript: courses must be an array');
  }

  if (typeof transcript.totalCredits !== 'number') {
    throw new Error('Invalid transcript: totalCredits must be a number');
  }

  if (typeof transcript.averageGPA !== 'number') {
    throw new Error('Invalid transcript: averageGPA must be a number');
  }

  return true;
}

/**
 * Validate backend roadmap response
 * Ensures all required fields are present and valid
 *
 * @param data Backend roadmap data
 * @returns True if valid, throws error otherwise
 */
export function validateBackendRoadmap(data: unknown): data is BackendRoadmapResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid roadmap data: not an object');
  }

  const roadmap = data as BackendRoadmapResponse;

  if (typeof roadmap.careerSummary !== 'string') {
    throw new Error('Invalid roadmap: careerSummary must be a string');
  }

  if (!Array.isArray(roadmap.coursePlan)) {
    throw new Error('Invalid roadmap: coursePlan must be an array');
  }

  if (!Array.isArray(roadmap.extracurricularPlan)) {
    throw new Error('Invalid roadmap: extracurricularPlan must be an array');
  }

  return true;
}
