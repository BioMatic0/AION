import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import type { TwoFactorMethod } from "@aion/shared-types";
import { AuditService } from "../audit/audit.service";
import { CurrentAuth, CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { SecurityService } from "../security/security.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateTwoFactorDto } from "./dto/update-two-factor.dto";
import { UsersService } from "./users.service";

@UseGuards(SessionAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly securityService: SecurityService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  listUsers(@CurrentAuth() auth: { user: ReturnType<UsersService["sanitizeUser"]> }) {
    return [auth.user];
  }

  @Get("me")
  getCurrentUser(@CurrentAuth() auth: { user: ReturnType<UsersService["sanitizeUser"]> }) {
    return auth.user;
  }

  @Get("profile")
  async getProfile(@CurrentUserId() userId: string) {
    const user = await this.usersService.requireById(userId);
    return this.usersService.sanitizeProfile(user);
  }

  @Patch("profile")
  async updateProfile(@CurrentUserId() userId: string, @Body() dto: UpdateProfileDto) {
    const updated = await this.usersService.updateProfile(userId, dto);

    await this.securityService.recordEvent(userId, "profile.updated", "info", "The user profile was updated.");
    await this.auditService.record({
      category: "users",
      action: "profile.updated",
      resource: userId,
      actorType: "user",
      actorId: userId,
      detail: `Profile updated: ${updated.displayName} <${updated.email}>`
    });

    return this.usersService.sanitizeProfile(updated);
  }

  @Post("change-password")
  async changePassword(@CurrentUserId() userId: string, @Body() dto: ChangePasswordDto) {
    const updated = await this.usersService.changePassword(userId, dto);

    await this.securityService.recordEvent(
      userId,
      "password.changed",
      "warning",
      "The account password was changed successfully."
    );
    await this.auditService.record({
      category: "users",
      action: "password.changed",
      resource: userId,
      actorType: "user",
      actorId: userId,
      detail: "The account password was updated."
    });

    return {
      success: true,
      profile: this.usersService.sanitizeProfile(updated)
    };
  }

  @Get("security")
  async getSecuritySummary(@CurrentUserId() userId: string) {
    const user = await this.usersService.requireById(userId);
    const overview = await this.securityService.getOverview(userId);
    const activeSessionCount = overview.sessions.filter((session) => session.revokedAt === null).length;

    return {
      profile: this.usersService.sanitizeProfile(user),
      sessionCount: overview.sessions.length,
      activeSessionCount,
      twoFactor: {
        enabled: user.twoFactorEnabled,
        method: user.twoFactorMethod,
        phoneHint: user.twoFactorPhoneHint,
        availableMethods: ["authenticator", "email", "sms"] as TwoFactorMethod[],
        readiness: "scaffold" as const,
        note: "The 2FA scaffold is ready. Real challenge verification will follow in the next security expansion."
      }
    };
  }

  @Put("two-factor")
  async updateTwoFactor(@CurrentUserId() userId: string, @Body() dto: UpdateTwoFactorDto) {
    const updated = await this.usersService.updateTwoFactor(userId, dto);

    await this.securityService.recordEvent(
      userId,
      "two-factor.updated",
      dto.enabled ? "info" : "warning",
      dto.enabled
        ? `The 2FA scaffold was set to ${dto.method ?? "unknown"}.`
        : "The 2FA scaffold was disabled."
    );
    await this.auditService.record({
      category: "users",
      action: "two-factor.updated",
      resource: userId,
      actorType: "user",
      actorId: userId,
      detail: dto.enabled
        ? `2FA scaffold enabled (${dto.method ?? "no method"}).`
        : "2FA scaffold disabled."
    });

    return {
      success: true,
      profile: this.usersService.sanitizeProfile(updated),
      twoFactor: {
        enabled: updated.twoFactorEnabled,
        method: updated.twoFactorMethod,
        phoneHint: updated.twoFactorPhoneHint,
        availableMethods: ["authenticator", "email", "sms"] as TwoFactorMethod[],
        readiness: "scaffold" as const,
        note: "The 2FA scaffold is stored. Verification steps will be enabled later."
      }
    };
  }

  @Get(":id")
  async getUser(@Param("id") id: string, @CurrentAuth() auth: { user: ReturnType<UsersService["sanitizeUser"]> }) {
    if (id !== auth.user.id) {
      return null;
    }

    return auth.user;
  }
}
