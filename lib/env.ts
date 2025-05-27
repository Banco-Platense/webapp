/**
 * Environment Configuration Utility
 * Centralizes environment variable detection and validation
 */

export const env = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  
  // Environment Detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Validate required environment variables
  validate() {
    const required = ['NEXT_PUBLIC_API_URL'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0 && this.isDevelopment) {
      console.warn('Missing environment variables:', missing);
      console.warn('Using fallback values for development');
    }
    
    // Log current configuration in development
    if (this.isDevelopment) {
      console.log('Environment Configuration:', {
        API_URL: this.API_URL,
        NODE_ENV: process.env.NODE_ENV,
        hasEnvFile: !!process.env.NEXT_PUBLIC_API_URL
      });
    }
    
    return {
      isValid: true, // We have fallbacks, so always valid
      missing,
      config: {
        API_URL: this.API_URL
      }
    };
  }
};

// Auto-validate on import
env.validate(); 