import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import type { AuthSessionPayload } from "@aion/shared-types";
import { SecurityService } from "../security/security.service";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { comparePasswordHash, hashPassword } from "./password-utils";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly securityService: SecurityService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException("Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.");
    }

    const user = await this.usersService.createUser({
      displayName: dto.displayName,
      email: dto.email,
      passwordHash: hashPassword(dto.password)
    });
    const { session, token } = await this.securityService.openSessionWithToken(
      user.id,
      `${user.displayName} primaeres Geraet`
    );

    return {
      user: this.usersService.sanitizeUser(user),
      session,
      token
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !comparePasswordHash(dto.password, user.passwordHash)) {
      throw new UnauthorizedException("Ungueltige Zugangsdaten.");
    }

    const { session, token } = await this.securityService.openSessionWithToken(
      user.id,
      `${user.displayName} aktive Anmeldung`
    );
    return {
      user: this.usersService.sanitizeUser(user),
      session,
      token
    };
  }

  async getCurrentSession(token: string): Promise<AuthSessionPayload | null> {
    const session = await this.securityService.resolveSessionToken(token);
    if (!session) {
      return null;
    }

    const user = await this.usersService.findById(session.userId);
    if (!user) {
      return null;
    }

    return {
      user: this.usersService.sanitizeUser(user),
      session
    };
  }

  async logoutByToken(token: string) {
    return {
      revoked: Boolean(await this.securityService.revokeSessionByToken(token))
    };
  }

  async logout(sessionId: string) {
    return {
      revoked: Boolean(await this.securityService.revokeSession(sessionId))
    };
  }
}
