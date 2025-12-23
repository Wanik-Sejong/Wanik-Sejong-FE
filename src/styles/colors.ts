/**
 * 완익세종 컬러 시스템
 * 세종대학교 브랜드 컬러 기반 디자인 시스템
 */

export const SejongColors = {
  // ========================================
  // Brand / Primary Colors
  // ========================================
  primary: '#C31632',      // Sejong Crimson Red
  secondary: '#51626F',    // Sejong Gray

  // ========================================
  // Accent Colors
  // ========================================
  gold: '#8B6F4E',         // Sejong Gold
  lightGold: '#D7BF77',    // Light Gold
  yellow: '#FFEA9B',       // Sejong Yellow

  // ========================================
  // Background Colors
  // ========================================
  background: '#FFFDE4',   // Sejong Ivory
  surface: '#D5D6D2',      // Sejong Cool Gray
  white: '#FFFFFF',        // Pure White

  // ========================================
  // Neutral Colors
  // ========================================
  beige: '#D2B887',        // Warm Beige
  lightGray: '#8996A0',    // Light Gray
  warmGray1: '#B7B1A9',    // Warm Gray 1
  warmGray2: '#837259',    // Warm Gray 2
  silver: '#C9C9C7',       // Silver

  // ========================================
  // White-Mixed Variants (Tints)
  // ========================================
  // Primary Red Tints
  primary50: '#FBE8EB',    // primary + 95% white
  primary100: '#F5CCD3',   // primary + 85% white
  primary200: '#EBA0AD',   // primary + 70% white
  primary300: '#E17487',   // primary + 55% white
  primary400: '#D74861',   // primary + 40% white
  primary500: '#C31632',   // Original
  primary600: '#9C1128',   // primary - 20% darker
  primary700: '#750D1E',   // primary - 40% darker
  primary800: '#4E0914',   // primary - 60% darker
  primary900: '#27040A',   // primary - 80% darker

  // Secondary Gray Tints
  secondary50: '#EFF1F2',  // secondary + 90% white
  secondary100: '#DCE0E2', // secondary + 75% white
  secondary200: '#B9C1C5', // secondary + 50% white
  secondary300: '#97A2A8', // secondary + 35% white
  secondary400: '#74828B', // secondary + 20% white
  secondary500: '#51626F', // Original
  secondary600: '#414E59', // secondary - 20% darker
  secondary700: '#313B43', // secondary - 40% darker
  secondary800: '#20272C', // secondary - 60% darker
  secondary900: '#101416', // secondary - 80% darker

  // Gold Tints
  gold50: '#F7F4F1',       // gold + 95% white
  gold100: '#EDE6DC',      // gold + 85% white
  gold200: '#DACEBA',      // gold + 70% white
  gold300: '#C8B697',      // gold + 55% white
  gold400: '#B59D75',      // gold + 40% white
  gold500: '#8B6F4E',      // Original
  gold600: '#6F593E',      // gold - 20% darker
  gold700: '#53432F',      // gold - 40% darker
  gold800: '#382C1F',      // gold - 60% darker
  gold900: '#1C1610',      // gold - 80% darker

  // Background Ivory Tints
  ivory50: '#FFFEF9',      // background + 50% white
  ivory100: '#FFFDE4',     // Original
  ivory200: '#FFF9C9',     // background - 10% darker
  ivory300: '#FFF5AE',     // background - 20% darker
  ivory400: '#FFF193',     // background - 30% darker

  // ========================================
  // Semantic Colors (기능적 색상)
  // ========================================
  // Success
  success: '#10B981',      // Green
  successLight: '#D1FAE5', // success + 90% white
  successDark: '#065F46',  // success - 50% darker

  // Warning
  warning: '#F59E0B',      // Orange
  warningLight: '#FEF3C7', // warning + 90% white
  warningDark: '#92400E',  // warning - 50% darker

  // Error
  error: '#EF4444',        // Red
  errorLight: '#FEE2E2',   // error + 90% white
  errorDark: '#991B1B',    // error - 50% darker

  // Info
  info: '#3B82F6',         // Blue
  infoLight: '#DBEAFE',    // info + 90% white
  infoDark: '#1E40AF',     // info - 50% darker

  // ========================================
  // Text Colors
  // ========================================
  text: {
    primary: '#1F2937',    // 거의 검정 (Gray 900)
    secondary: '#6B7280',  // 회색 (Gray 500)
    tertiary: '#9CA3AF',   // 연한 회색 (Gray 400)
    inverse: '#FFFFFF',    // 흰색 (어두운 배경용)
    disabled: '#D1D5DB',   // 비활성화 (Gray 300)

    // Sejong 브랜드 컬러 텍스트
    brand: '#C31632',      // Primary Red
    accent: '#8B6F4E',     // Gold
  },

  // ========================================
  // Border Colors
  // ========================================
  border: {
    light: '#F3F4F6',      // Gray 100
    default: '#E5E7EB',    // Gray 200
    medium: '#D1D5DB',     // Gray 300
    dark: '#9CA3AF',       // Gray 400
    brand: '#C31632',      // Primary Red
  },

  // ========================================
  // Shadow Colors (with opacity)
  // ========================================
  shadow: {
    sm: 'rgba(0, 0, 0, 0.05)',
    default: 'rgba(0, 0, 0, 0.1)',
    md: 'rgba(0, 0, 0, 0.15)',
    lg: 'rgba(0, 0, 0, 0.2)',
    xl: 'rgba(0, 0, 0, 0.25)',

    // Sejong Red Shadow
    primary: 'rgba(195, 22, 50, 0.2)',
    primaryLight: 'rgba(195, 22, 50, 0.1)',
  },

  // ========================================
  // Overlay Colors (with opacity)
  // ========================================
  overlay: {
    light: 'rgba(255, 255, 255, 0.9)',
    medium: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.7)',
  },
};

/**
 * Tailwind CSS 설정을 위한 컬러 익스포트
 */
export const tailwindColors = {
  sejong: {
    primary: SejongColors.primary,
    secondary: SejongColors.secondary,
    gold: SejongColors.gold,
    ivory: SejongColors.background,
  },
  primary: {
    50: SejongColors.primary50,
    100: SejongColors.primary100,
    200: SejongColors.primary200,
    300: SejongColors.primary300,
    400: SejongColors.primary400,
    500: SejongColors.primary500,
    600: SejongColors.primary600,
    700: SejongColors.primary700,
    800: SejongColors.primary800,
    900: SejongColors.primary900,
  },
  secondary: {
    50: SejongColors.secondary50,
    100: SejongColors.secondary100,
    200: SejongColors.secondary200,
    300: SejongColors.secondary300,
    400: SejongColors.secondary400,
    500: SejongColors.secondary500,
    600: SejongColors.secondary600,
    700: SejongColors.secondary700,
    800: SejongColors.secondary800,
    900: SejongColors.secondary900,
  },
  gold: {
    50: SejongColors.gold50,
    100: SejongColors.gold100,
    200: SejongColors.gold200,
    300: SejongColors.gold300,
    400: SejongColors.gold400,
    500: SejongColors.gold500,
    600: SejongColors.gold600,
    700: SejongColors.gold700,
    800: SejongColors.gold800,
    900: SejongColors.gold900,
  },
};

/**
 * 사용 예시:
 *
 * import { SejongColors } from '@/styles/colors';
 *
 * // CSS-in-JS
 * const button = {
 *   backgroundColor: SejongColors.primary,
 *   color: SejongColors.white,
 *   '&:hover': {
 *     backgroundColor: SejongColors.primary600,
 *   }
 * };
 *
 * // Tailwind className
 * <div className="bg-primary-500 text-white hover:bg-primary-600">
 *   세종대학교
 * </div>
 */
