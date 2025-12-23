import localFont from 'next/font/local';

/**
 * Pretendard 폰트 패밀리
 *
 * 9개의 weight를 지원하는 로컬 폰트입니다.
 * 각 weight는 별도의 .ttf 파일로 정의되어 있으며,
 * Next.js Font Optimization을 통해 자동으로 최적화됩니다.
 *
 * Weights:
 * - 100: Thin
 * - 200: ExtraLight
 * - 300: Light
 * - 400: Regular (기본)
 * - 500: Medium
 * - 600: SemiBold
 * - 700: Bold
 * - 800: ExtraBold
 * - 900: Black
 */
export const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});
