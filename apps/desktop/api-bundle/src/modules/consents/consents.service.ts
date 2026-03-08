import { Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { ConsentRecordSummary } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { SetConsentDto } from "./dto/set-consent.dto";

function createDefaultRecords(): ConsentRecordSummary[] {
  const now = new Date().toISOString();

  return [
    {
      id: randomUUID(),
      scope: "privacy.analytics",
      status: "revoked",
      description: "Analytik bleibt in der lokalen MVP-Umgebung standardmaessig deaktiviert.",
      required: false,
      grantedAt: now
    },
    {
      id: randomUUID(),
      scope: "memory.long_term",
      status: "granted",
      description: "Langzeitgedaechtnis darf fuer eintragsuebergreifende Suche und Kontinuitaet verwendet werden.",
      required: false,
      grantedAt: now
    },
    {
      id: randomUUID(),
      scope: "security.alerts",
      status: "granted",
      description: "Benachrichtigungen zu Sicherheits- und Datenschutzvorfaellen bleiben fuer den Nutzer aktiviert.",
      required: true,
      grantedAt: now
    }
  ];
}

@Injectable()
export class ConsentsService implements OnModuleInit {
  private records: ConsentRecordSummary[] = createDefaultRecords();

  constructor(
    private readonly auditService: AuditService,
    @Optional() private readonly prisma?: PrismaService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      return;
    }

    await this.prisma.ensureLocalUser();
    const existing = await this.prisma.consentRecord.findMany({
      where: { userId: LOCAL_USER_ID },
      orderBy: { grantedAt: "desc" }
    });

    if (existing.length === 0) {
      await this.prisma.consentRecord.createMany({
        data: this.records.map((record) => ({
          id: record.id,
          userId: LOCAL_USER_ID,
          scope: record.scope,
          status: record.status,
          description: record.description,
          required: record.required,
          grantedAt: new Date(record.grantedAt),
          revokedAt: record.revokedAt ? new Date(record.revokedAt) : null
        }))
      });
      return;
    }

    this.records = existing.map((record) => ({
      id: record.id,
      scope: record.scope,
      status: record.status as ConsentRecordSummary["status"],
      description: record.description,
      required: record.required,
      grantedAt: record.grantedAt.toISOString(),
      revokedAt: record.revokedAt?.toISOString()
    }));
  }

  private async persist(record: ConsentRecordSummary) {
    if (!this.prisma) {
      return;
    }

    await this.prisma.consentRecord.upsert({
      where: {
        userId_scope: {
          userId: LOCAL_USER_ID,
          scope: record.scope
        }
      },
      update: {
        status: record.status,
        description: record.description,
        required: record.required,
        grantedAt: new Date(record.grantedAt),
        revokedAt: record.revokedAt ? new Date(record.revokedAt) : null
      },
      create: {
        id: record.id,
        userId: LOCAL_USER_ID,
        scope: record.scope,
        status: record.status,
        description: record.description,
        required: record.required,
        grantedAt: new Date(record.grantedAt),
        revokedAt: record.revokedAt ? new Date(record.revokedAt) : null
      }
    });
  }

  listConsents() {
    return this.records;
  }

  async setConsent(dto: SetConsentDto) {
    const now = new Date().toISOString();
    const existing = this.records.find((item) => item.scope === dto.scope);

    if (existing) {
      existing.status = dto.status;
      existing.description = dto.description ?? existing.description;
      existing.required = dto.required ?? existing.required;
      if (dto.status === "granted") {
        existing.grantedAt = now;
        delete existing.revokedAt;
      } else {
        existing.revokedAt = now;
      }

      await this.persist(existing);
      await this.auditService.record({
        category: "privacy",
        action: `consent.${dto.status}`,
        resource: dto.scope,
        actorType: "user",
        actorId: LOCAL_USER_ID,
        detail: `Die Einwilligung ${dto.scope} wurde auf ${dto.status} gesetzt.`
      });

      return existing;
    }

    const created: ConsentRecordSummary = {
      id: randomUUID(),
      scope: dto.scope,
      status: dto.status,
      description: dto.description ?? "Expliziter Einwilligungsstatus, verwaltet im Datenschutzbereich.",
      required: dto.required ?? false,
      grantedAt: now,
      revokedAt: dto.status === "revoked" ? now : undefined
    };

    this.records.unshift(created);
    await this.persist(created);
    await this.auditService.record({
      category: "privacy",
      action: `consent.${dto.status}`,
      resource: dto.scope,
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Die Einwilligung ${dto.scope} wurde mit dem Status ${dto.status} angelegt.`
    });
    return created;
  }
}
