import { BadRequestException, Inject, Injectable, OnModuleInit, Optional, UnauthorizedException } from "@nestjs/common";
import type { TwoFactorMethod, UserProfileSummary } from "@aion/shared-types";
import { randomUUID } from "node:crypto";
import { comparePasswordHash, hashPassword } from "../auth/password-utils";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";

export interface UserRecord {
  id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  passwordUpdatedAt?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: TwoFactorMethod;
  twoFactorPhoneHint?: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileInput {
  displayName?: string;
  email?: string;
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UpdateTwoFactorInput {
  enabled: boolean;
  method?: TwoFactorMethod;
  phoneHint?: string;
}

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users = new Map<string, UserRecord>();

  constructor(
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma && this.desktopState?.isEnabled()) {
      const records = await this.desktopState.loadSection<UserRecord[]>("auth.users", []);
      this.users.clear();
      for (const user of records) {
        this.users.set(user.id, user);
      }
    }
  }

  private async persistDesktopUsers() {
    if (this.desktopState?.isEnabled()) {
      await this.desktopState.saveSection("auth.users", Array.from(this.users.values()));
    }
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private normalizePhoneHint(phoneHint?: string) {
    const trimmed = phoneHint?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
  }

  private hydrateUser(record: {
    id: string;
    displayName: string;
    email: string;
    passwordHash?: string | null;
    passwordUpdatedAt?: Date | null;
    twoFactorEnabled?: boolean | null;
    twoFactorMethod?: string | null;
    twoFactorPhoneHint?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
  }): UserRecord {
    return {
      id: record.id,
      displayName: record.displayName,
      email: record.email,
      passwordHash: record.passwordHash ?? "",
      passwordUpdatedAt: record.passwordUpdatedAt?.toISOString(),
      twoFactorEnabled: record.twoFactorEnabled ?? false,
      twoFactorMethod: (record.twoFactorMethod as TwoFactorMethod | null) ?? undefined,
      twoFactorPhoneHint: record.twoFactorPhoneHint ?? undefined,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt?.toISOString() ?? record.createdAt.toISOString()
    };
  }

  async listUsers() {
    if (this.prisma) {
      const users = await this.prisma.user.findMany({
        orderBy: { createdAt: "desc" }
      });
      return users.map((user) => this.hydrateUser(user));
    }

    return Array.from(this.users.values());
  }

  async findByEmail(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    if (this.prisma) {
      const user = await this.prisma.user.findUnique({
        where: { email: normalizedEmail }
      });
      return user ? this.hydrateUser(user) : null;
    }

    return Array.from(this.users.values()).find((user) => user.email === normalizedEmail) ?? null;
  }

  async findById(id: string) {
    if (this.prisma) {
      const user = await this.prisma.user.findUnique({
        where: { id }
      });
      return user ? this.hydrateUser(user) : null;
    }

    return this.users.get(id) ?? null;
  }

  async requireById(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException("Benutzerprofil konnte nicht geladen werden.");
    }
    return user;
  }

  async createUser(input: { displayName: string; email: string; passwordHash: string }) {
    const now = new Date();
    const normalizedEmail = this.normalizeEmail(input.email);

    if (this.prisma) {
      const user = await this.prisma.user.create({
        data: {
          displayName: input.displayName.trim(),
          email: normalizedEmail,
          passwordHash: input.passwordHash,
          passwordUpdatedAt: now
        }
      });
      return this.hydrateUser(user);
    }

    const isoNow = now.toISOString();
    const user: UserRecord = {
      id: randomUUID(),
      displayName: input.displayName.trim(),
      email: normalizedEmail,
      passwordHash: input.passwordHash,
      passwordUpdatedAt: isoNow,
      twoFactorEnabled: false,
      createdAt: isoNow,
      updatedAt: isoNow
    };

    this.users.set(user.id, user);
    await this.persistDesktopUsers();
    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const current = await this.requireById(userId);
    const nextDisplayName = input.displayName?.trim() || current.displayName;
    const nextEmail = input.email ? this.normalizeEmail(input.email) : current.email;

    if (nextDisplayName.length < 2) {
      throw new BadRequestException("Der Anzeigename muss mindestens 2 Zeichen lang sein.");
    }

    if (nextEmail !== current.email) {
      const existing = await this.findByEmail(nextEmail);
      if (existing && existing.id !== userId) {
        throw new BadRequestException("Diese E-Mail-Adresse wird bereits verwendet.");
      }
    }

    if (this.prisma) {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          displayName: nextDisplayName,
          email: nextEmail
        }
      });
      return this.hydrateUser(updated);
    }

    const updated: UserRecord = {
      ...current,
      displayName: nextDisplayName,
      email: nextEmail,
      updatedAt: new Date().toISOString()
    };

    this.users.set(userId, updated);
    await this.persistDesktopUsers();
    return updated;
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const current = await this.requireById(userId);

    if (!comparePasswordHash(input.currentPassword, current.passwordHash)) {
      throw new UnauthorizedException("Das aktuelle Passwort ist nicht korrekt.");
    }

    if (input.newPassword !== input.confirmPassword) {
      throw new BadRequestException("Neues Passwort und Bestaetigung muessen uebereinstimmen.");
    }

    if (input.newPassword.trim().length < 12) {
      throw new BadRequestException("Das neue Passwort muss mindestens 12 Zeichen lang sein.");
    }

    const nextPasswordHash = hashPassword(input.newPassword);
    const passwordUpdatedAt = new Date();

    if (this.prisma) {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: nextPasswordHash,
          passwordUpdatedAt
        }
      });
      return this.hydrateUser(updated);
    }

    const updated: UserRecord = {
      ...current,
      passwordHash: nextPasswordHash,
      passwordUpdatedAt: passwordUpdatedAt.toISOString(),
      updatedAt: passwordUpdatedAt.toISOString()
    };

    this.users.set(userId, updated);
    await this.persistDesktopUsers();
    return updated;
  }

  async updateTwoFactor(userId: string, input: UpdateTwoFactorInput) {
    const current = await this.requireById(userId);
    const phoneHint = this.normalizePhoneHint(input.phoneHint);

    if (input.enabled && !input.method) {
      throw new BadRequestException("Fuer die 2FA-Vorstruktur muss eine Methode ausgewaehlt werden.");
    }

    if (input.enabled && input.method === "sms" && !phoneHint) {
      throw new BadRequestException("Fuer SMS muss ein Telefonhinweis hinterlegt werden.");
    }

    if (this.prisma) {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: input.enabled,
          twoFactorMethod: input.enabled ? input.method : null,
          twoFactorPhoneHint: input.enabled && input.method === "sms" ? phoneHint ?? null : null
        }
      });
      return this.hydrateUser(updated);
    }

    const updated: UserRecord = {
      ...current,
      twoFactorEnabled: input.enabled,
      twoFactorMethod: input.enabled ? input.method : undefined,
      twoFactorPhoneHint: input.enabled && input.method === "sms" ? phoneHint : undefined,
      updatedAt: new Date().toISOString()
    };

    this.users.set(userId, updated);
    await this.persistDesktopUsers();
    return updated;
  }

  sanitizeUser = (user: UserRecord) => ({
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    createdAt: user.createdAt
  });

  sanitizeProfile = (user: UserRecord): UserProfileSummary => ({
    ...this.sanitizeUser(user),
    updatedAt: user.updatedAt,
    passwordUpdatedAt: user.passwordUpdatedAt,
    twoFactorEnabled: user.twoFactorEnabled,
    twoFactorMethod: user.twoFactorMethod,
    twoFactorPhoneHint: user.twoFactorPhoneHint
  });
}
