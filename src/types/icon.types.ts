/**
 * Icon name types for the application
 * Maps semantic meaning to actual icon names
 */
export type IconName =
  // Navigation & Category
  | 'school'      // 🏫 교내
  | 'globe'       // 🌐 교외/글로벌

  // Statistics
  | 'books'       // 📚 총 추천 과목
  | 'map'         // 🗺️ 학습 단계
  | 'laptop'      // 💻 기술스택
  | 'strong'      // 💪 강점
  | 'weakness'    // 😢 보완필요 영역
  | 'target'      // 🎯 목표/보완영역

  // Actions
  | 'file-pdf'    // 📄 PDF 저장
  | 'refresh'     // 🔄 새 로드맵/리셋

  // Phase & Priority
  | 'book'        // 📚 학습
  | 'lightbulb'   // 💡 아이디어
  | 'rocket'      // 🚀 성장
  | 'star'        // ⭐ 우선순위 높음
  | 'trophy'      // 🏆 목표달성
  | 'sparkles'    // ✨ 우선순위 중간
  | 'pin';        // 📌 우선순위 낮음

/**
 * Icon mapping for backward compatibility
 */
export interface IconMapping {
  [key: string]: IconName;
}
