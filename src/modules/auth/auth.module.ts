import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import jwtConfig from '../../config/request/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
