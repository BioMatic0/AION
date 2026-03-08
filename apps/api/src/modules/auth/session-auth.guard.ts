import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { RequestAuthContext } from "./current-user.decorator";
import { extractCookieValue, AUTH_SESSION_COOKIE } from "./auth-cookie";
import { AuthService } from "./auth.service";

interface AuthenticatedRequest {
  aionAuth?: RequestAuthContext;
  headers: {
    cookie?: string;
    authorization?: string;
  };
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const bearer = request.headers.authorization?.startsWith("Bearer ")
      ? request.headers.authorization.slice("Bearer ".length).trim()
      : null;
    const token = bearer || extractCookieValue(request.headers.cookie, AUTH_SESSION_COOKIE);

    if (!token) {
      throw new UnauthorizedException("Authentifizierung erforderlich.");
    }

    const auth = await this.authService.getCurrentSession(token);
    if (!auth) {
      throw new UnauthorizedException("Sitzung ungueltig oder abgelaufen.");
    }

    request.aionAuth = auth;
    return true;
  }
}
