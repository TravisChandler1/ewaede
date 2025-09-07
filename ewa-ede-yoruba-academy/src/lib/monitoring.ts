// Basic monitoring and error tracking setup
// This can be extended with services like Sentry, LogRocket, etc.

export const logError = (error: Error, context?: Record<string, unknown>) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', error, context);
  }

  // In production, you would send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry, LogRocket, etc.
    // Sentry.captureException(error, { contexts: { custom: context } });

    // For now, just log to console
    console.error('Production error:', error, context);
  }
};

export const logEvent = (event: string, data?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Event: ${event}`, data);
  }

  // In production, send to analytics
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics, Mixpanel, etc.
    // gtag('event', event, data);

    console.log(`Production event: ${event}`, data);
  }
};

export const trackPageView = (page: string) => {
  logEvent('page_view', { page });
};

export const trackUserAction = (action: string, details?: Record<string, unknown>) => {
  logEvent('user_action', { action, ...details });
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Error boundary helper
export const reportError = (error: Error, errorInfo?: { componentStack?: string }) => {
  logError(error, {
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  });
};