import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';

export class UserGuard extends AuthGuardPassport('jwt') {
  constructor(private allowedRoleId?: number[]) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info) {
      throw new UnauthorizedException(info.message);
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (this.allowedRoleId) {
      // Extracting role_id from the user object obtained from JWT payload
      const { role_id } = user;
      const isAllow = this.allowedRoleId.includes(role_id);
      // Check if the user has the allowed role
      if (!isAllow) {
        throw new UnauthorizedException(
          'You do not have permission to access this resource, please contact the administrator',
        );
      }
    }

    return user;
  }
}
