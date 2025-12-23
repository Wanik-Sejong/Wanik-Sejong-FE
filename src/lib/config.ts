/**
 * Environment Configuration
 * Manages mock vs production mode switching
 */

export const config = {
  /**
   * Use mock data instead of real APIs
   * - Development: true (fully local)
   * - Production: false (real OpenAI API)
   */
  useMock: process.env.NEXT_PUBLIC_USE_MOCK === 'true',

  /**
   * OpenAI API configuration
   */
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4o',
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
  if (!config.useMock && !config.openai.apiKey) {
    console.warn(
      '⚠️ OPENAI_API_KEY is not set. Production mode requires an API key.'
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
    hasApiKey: !!config.openai.apiKey,
  });
}
