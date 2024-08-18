import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
});

// Initialize httpLogger as null initially
let httpLogger = null;

// Server-side code only
if (typeof window === 'undefined') {
  // Dynamically import pino-http only in a server-side context
  import('pino-http').then((pinoHttp) => {
    httpLogger = pinoHttp.default({ logger });
  }).catch((error) => {
    logger.error('Failed to load pino-http', error);
  });
} else {
  // Mock the logger for the client-side to prevent errors
  httpLogger = {
    logger: {
      info: (...args) => console.log('[INFO]:', ...args),
      error: (...args) => console.error('[ERROR]:', ...args),
      warn: (...args) => console.warn('[WARN]:', ...args),
    },
  };
}

export { httpLogger, logger as default };
