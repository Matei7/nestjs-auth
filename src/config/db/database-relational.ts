import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: __dirname + '/../../../.env' });

const config = {
  type: process.env.DATABASE_DRIVER || 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
};

export default registerAs('sql_database', () => config);
export const sqlSource = new DataSource(config as DataSourceOptions);
