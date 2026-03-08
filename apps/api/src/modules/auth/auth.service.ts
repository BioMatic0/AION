import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SecurityService } from "../security/security.service";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly securityService: SecurityService
  ) {}

  async register(dto: RegisterDto) {
    const existing = this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException("A user with this email already exists.");
    }

    const user = this.usersService.createUser({
      displayName: dto.displayName,
      email: dto.email,
      passwordHash: this.hashPassword(dto.password)
    });
    const session = await this.securityService.openSession(user.id, `${user.displayName} primary device`);

    return {
      user: this.usersService.sanitizeUser(user),
      session
    };
  }

  async login(dto: LoginDto) {
    const user = this.usersService.findByEmail(dto.email);
    if (!user || !this.comparePasswords(dto.password, user.passwordHash)) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const session = await this.securityService.openSession(user.id, `${user.displayName} active login`);
    return {
      user: this.usersService.sanitizeUser(user),
      session
    };
  }

  async logout(sessionId: string) {
    return {
      revoked: Boolean(await this.securityService.revokeSession(sessionId))
    };
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  }

  private comparePasswords(password: string, stored: string) {
    const [salt, hash] = stored.split(":");
    const candidate = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(hash, "hex");
    return timingSafeEqual(candidate, storedBuffer);
  }
}
