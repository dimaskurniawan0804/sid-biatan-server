import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from './jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    if (Date.now() > payload.exp * 1000) {
      return {
        expired: payload.exp,
      };
    }
    return {
      username: payload.username,
      uuid: payload.uuid,
      role_id: payload.role_id,
      role_name: payload.role?.name || null,
      expired: payload.exp,
    };
  }
}
