import { Inject, Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { AuditLogRecord } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";

interface RecordAuditInput {
  category: string;
  action: string;
  resource: string;
  actorType: string;
  actorId?: string;
  detail: string;
}

function createBootstrapEntry(): AuditLogRecord {
  return {
    id: randomUUID(),
    category: "bootstrap",
    action: "workspace.ready",
    resource: "aion-platform",
    actorType: "system",
    actorId: "bootstrap",
    detail: "Erste Auditspur fuer Governance, Datenschutz und Sicherheits-Sichtbarkeit angelegt.",
    createdAt: new Date().toISOString()
  };
}

@Injectable()
export class AuditService implements OnModuleInit {
  private logs: AuditLogRecord[] = [createBootstrapEntry()];

  constructor(
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.logs = await this.desktopState.loadSection("audit.logs", this.logs);
      }
      return;
    }

    await this.prisma.ensureLocalUser();
    const existing = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });

    if (existing.length === 0) {
      await this.prisma.auditLog.create({
        data: {
          id: this.logs[0].id,
          userId: null,
          category: this.logs[0].category,
          action: this.logs[0].action,
          resource: this.logs[0].resource,
          actorType: this.logs[0].actorType,
          actorId: this.logs[0].actorId,
          detail: this.logs[0].detail,
          createdAt: new Date(this.logs[0].createdAt)
        }
      });
      return;
    }

    this.logs = existing.map((entry) => ({
      id: entry.id,
      category: entry.category,
      action: entry.action,
      resource: entry.resource,
      actorType: entry.actorType,
      actorId: entry.actorId ?? undefined,
      detail: entry.detail,
      createdAt: entry.createdAt.toISOString()
    }));
  }

  private async persist(entry: AuditLogRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("audit.logs", this.logs);
      }
      return;
    }

    await this.prisma.auditLog.create({
      data: {
        id: entry.id,
        userId: entry.actorType === "user" ? LOCAL_USER_ID : null,
        category: entry.category,
        action: entry.action,
        resource: entry.resource,
        actorType: entry.actorType,
        actorId: entry.actorId,
        detail: entry.detail,
        createdAt: new Date(entry.createdAt)
      }
    });
  }

  async record(input: RecordAuditInput) {
    const entry: AuditLogRecord = {
      id: randomUUID(),
      category: input.category,
      action: input.action,
      resource: input.resource,
      actorType: input.actorType,
      actorId: input.actorId,
      detail: input.detail,
      createdAt: new Date().toISOString()
    };

    this.logs.unshift(entry);
    await this.persist(entry);
    return entry;
  }

  list(limit = 50) {
    return this.logs.slice(0, limit);
  }
}
