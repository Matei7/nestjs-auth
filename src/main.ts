import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import process from 'process';
import { ValidationPipe } from '@nestjs/common';
import fs from 'fs';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

dotenvConfig({ path: __dirname + '/../.env' });

async function bootstrap() {
  /**
   * Application options
   * Enable winston logger with daily rotate file and max 30 days
   */
  const options = {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  };

  /**
   * If we have a key and cert, we will use https
   */
  const key = process.env.SSL_KEY || '';
  const cert = process.env.SSL_CERT || '';
  if (key && cert) {
    options['httpsOptions'] = {
      key: fs.readFileSync(key),
      cert: fs.readFileSync(cert),
    };
  }

  const app = await NestFactory.create(AppModule, options);

  /**
   * Enable validation pipe
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  /**
   * Enable cors
   */
  app.enableCors();

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
