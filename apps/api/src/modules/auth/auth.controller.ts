import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { AUTH_SESSION_COOKIE, clearAuthCookie, extractCookieValue, setAuthCookie } from "./auth-cookie";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: any) {
    const result = await this.authService.register(dto);
    setAuthCookie(response, result.token);
    return {
      user: result.user,
      session: result.session
    };
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: any) {
    const result = await this.authService.login(dto);
    setAuthCookie(response, result.token);
    return {
      user: result.user,
      session: result.session
    };
  }

  @Get("me")
  async getCurrentSession(@Req() request: any) {
    const token = extractCookieValue(request.headers.cookie, AUTH_SESSION_COOKIE);
    if (!token) {
      throw new UnauthorizedException("Keine aktive Sitzung gefunden.");
    }

    const session = await this.authService.getCurrentSession(token);
    if (!session) {
      throw new UnauthorizedException("Sitzung ungueltig oder abgelaufen.");
    }

    return session;
  }

  @Post("logout")
  async logout(
    @Req() request: any,
    @Res({ passthrough: true }) response: any,
    @Body("sessionId") sessionId?: string
  ) {
    const token = extractCookieValue(request.headers.cookie, AUTH_SESSION_COOKIE);
    clearAuthCookie(response);

    if (token) {
      return this.authService.logoutByToken(token);
    }

    if (!sessionId) {
      return { revoked: false };
    }

    return this.authService.logout(sessionId);
  }
}
