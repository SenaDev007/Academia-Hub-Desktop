import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json, prettyPrint } = winston.format;

const logFormat = combine(
  timestamp(),
  json(),
  prettyPrint()
);

export class Logger {
  private readonly logger: winston.Logger;

  constructor(private readonly context: string) {
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: logFormat,
      defaultMeta: { context },
      transports: [
        // Transport pour les logs dans la console
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        // Transport pour les logs dans des fichiers journaliers
        new DailyRotateFile({
          filename: 'logs/%DATE%-app.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: logFormat
        })
      ]
    });
  }

  info(message: string, ...args: unknown[]) {
    this.logger.info(message, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    this.logger.debug(message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.logger.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.logger.error(message, ...args);
  }

  errorWithStack(error: Error) {
    this.logger.error(error.message, { stack: error.stack });
  }
}

// Exporter aussi l'instance par défaut pour compatibilité
export default new Logger('App');
