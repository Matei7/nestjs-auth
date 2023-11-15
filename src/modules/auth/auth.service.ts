import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/request/jwt.config';
import { ConfigType } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { UserRolesEnum } from '../../config/constants/auth.constants';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh.token.dto';
import { InvalidRefreshTokenError } from './errors/invalid-refresh-token.error';
import { AccessToken } from './entities/access-token.entity';

@Injectable()
export class AuthService {
  constructor(
    readonly usersService: UsersService,
    readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (user) {
      const isPasswordMatching = await compare(
        loginDto.password,
        user.password,
      );
      if (isPasswordMatching) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;

        return result;
      }
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.generateTokens(user);
  }

  async generateTokens(user: {
    id: number;
    email: string;
    roles: UserRolesEnum[];
  }) {
    const refreshTokenId = randomUUID();
    const jwtPayload = {
      email: user.email,
      roles: user.roles,
    };

    await this.invalidateAccessToken(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        jwtPayload,
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    await this.insertAccessToken(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersService.findOne(sub);
      const isRefreshTokenValid = await this.validateAccessToken(
        user.id,
        refreshTokenId,
      );

      if (isRefreshTokenValid) {
        await this.invalidateAccessToken(user.id);
      }

      return await this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  async insertAccessToken(userId: number, tokenId: string) {
    await AccessToken.insert({
      userId,
      tokenId,
    });
  }

  async validateAccessToken(userId: number, tokenId: string) {
    const storedToken = await AccessToken.findOneBy({ userId });
    if (storedToken.tokenId !== tokenId) {
      throw new InvalidRefreshTokenError();
    }

    return true;
  }

  async invalidateAccessToken(userId: number) {
    await AccessToken.delete({ userId });
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
