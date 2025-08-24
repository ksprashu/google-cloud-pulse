import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const loggingWinston = new LoggingWinston();

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(loggingWinston);
}

export default logger;
