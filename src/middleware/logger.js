import pino from 'pino-http';

export const logger = pino({
  transport: {
    target: 'pino-pretty', // Красивый вывод логов в консоль
  },
});
