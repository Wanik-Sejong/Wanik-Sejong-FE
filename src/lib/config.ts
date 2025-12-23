/**
 * Environment Configuration
 * Manages mock vs production mode switching
 */

// Auto-detect backend mode based on API URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const useMockEnv = process.env.NEXT_PUBLIC_USE_MOCK;
const isExternalBackend = apiUrl.includes('hackathon.yeo-li.com') ||
                          (!apiUrl.includes('localhost') && !apiUrl.includes('127.0.0.1'));

// Debug: Log environment variables at module load time
if (typeof window !== 'undefined') {
  console.log('🔍 [Client] Environment variables loaded:', {
    NEXT_PUBLIC_USE_MOCK: useMockEnv,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    isExternalBackend,
  });
}

export const config = {
  /**
   * Use mock data instead of real APIs
   * - Development: true (fully local)
   * - Production: false (real Gemini API or Backend API)
   */
  useMock: useMockEnv === 'true',

  /**
   * External backend API configuration
   * Auto-detected: true if NEXT_PUBLIC_API_URL is external (e.g., hackathon.yeo-li.com)
   */
  backend: {
    /**
     * Enable external backend API
     * Auto-detected based on NEXT_PUBLIC_API_URL
     * - External URL → Backend mode
     * - localhost → Local mode
     */
    enabled: useMockEnv !== 'true' && isExternalBackend,
    /**
     * Backend API base URL
     * Uses NEXT_PUBLIC_API_URL when in backend mode
     */
    baseUrl: apiUrl,
    /**
     * Request timeout in milliseconds
     * Default: 60 seconds (AI processing time for large transcripts)
     */
    timeout: 60000,
  },

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
   * Next.js API Routes (internal API)
   * Uses NEXT_PUBLIC_API_URL (should be localhost for local mode)
   */
  api: {
    baseUrl: apiUrl,
  },
} as const;

/**
 * Validate required environment variables
 */
export function validateConfig() {
  console.log('🔍 Environment Variables Check:');
  console.log('  NEXT_PUBLIC_USE_MOCK:', process.env.NEXT_PUBLIC_USE_MOCK);
  console.log('  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('  GEMINI_API_KEY:', typeof window === 'undefined'
    ? (process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set')
    : '🔒 Server-only (hidden from client)'
  );

  // 서버 사이드에서만 검증
  if (typeof window === 'undefined') {
    if (!config.useMock && !config.backend.enabled && !config.gemini.apiKey) {
      console.error(
        '❌ GEMINI_API_KEY is not set. Local mode requires an API key.'
      );
    }
  }

  logConfig();
}

/**
 * Get current mode
 */
export function getMode(): 'development' | 'production' {
  return config.useMock ? 'development' : 'production';
}

/**
 * Get API source
 * Determines which API is being used
 */
export function getApiSource(): 'mock' | 'backend' | 'local' {
  if (config.useMock) return 'mock';
  if (config.backend.enabled) return 'backend';
  return 'local';
}

/**
 * Log current configuration (for debugging)
 */
export function logConfig() {
  console.log('🔧 Configuration:', {
    mode: getMode(),
    apiSource: getApiSource(),
    useMock: config.useMock,
    backendEnabled: config.backend.enabled,
    backendUrl: config.backend.baseUrl,
    hasApiKey: !!config.gemini.apiKey,
  });
}
