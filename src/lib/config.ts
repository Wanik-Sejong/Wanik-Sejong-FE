/**
 * Environment Configuration
 * Manages mock vs production mode switching
 */

export const config = {
  /**
   * Use mock data instead of real APIs
   * - Development: true (fully local)
   * - Production: false (real Gemini API)
   */
  useMock: process.env.NEXT_PUBLIC_USE_MOCK === 'true',

  /**
   * Google Gemini API configuration
   */
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-2.0-flash-exp',
    temperature: 0.7,
    maxTokens: 2000,
  },

  /**
   * API endpoints (for future backend integration)
   */
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
} as const;

/**
 * Validate required environment variables
 */
export function validateConfig() {
  if (!config.useMock && !config.gemini.apiKey) {
    console.warn(
      '⚠️ GEMINI_API_KEY is not set. Production mode requires an API key.'
    );
  }
}

/**
 * Get current mode
 */
export function getMode(): 'development' | 'production' {
  return config.useMock ? 'development' : 'production';
}

/**
 * Log current configuration (for debugging)
 */
export function logConfig() {
  console.log('🔧 Configuration:', {
    mode: getMode(),
    useMock: config.useMock,
    hasApiKey: !!config.gemini.apiKey,
  });
}
