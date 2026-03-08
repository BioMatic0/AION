import { Inject, Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type {
  DataDeletionRequestSummary,
  DataExportRequestSummary,
  PrivacyLedgerEntry,
  PrivacyOverview,
  PrivacyPreferenceSummary
} from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { ConsentsService } from "../consents/consents.service";
import { CreateDeletionRequestDto } from "./dto/create-deletion-request.dto";
import { CreateExportRequestDto } from "./dto/create-export-request.dto";
import { UpdatePrivacyPreferencesDto } from "./dto/update-privacy-preferences.dto";

function createDefaultPreferences(): PrivacyPreferenceSummary {
  return {
    privacyMode: "standard",
    analyticsEnabled: false,
    longTermMemoryEnabled: true,
    exportFormat: "json",
    securityAlerts: true,
    retentionProfile: "balanced"
  };
}

function createDefaultLedger(): PrivacyLedgerEntry[] {
  const now = new Date().toISOString();

  return [
    {
      id: randomUUID(),
      category: "journal-and-diary",
      storageScope: "postgres-and-application-cache",
      retentionRule: "Bleibt erhalten, bis ein Nutzerexport oder Loeschworkflow die Daten entfernt.",
      activeUsageSummary: "Wird fuer Kontinuitaet, Wachstumsauswertung und KI-Kontextabruf verwendet.",
      userVisible: true,
      updatedAt: now
    },
    {
      id: randomUUID(),
      category: "security-and-incidents",
      storageScope: "security-center",
      retentionRule: "Bleibt fuer Nachvollziehbarkeit und den Nutzerverlauf von Benachrichtigungen sichtbar.",
      activeUsageSummary: "Wird genutzt, um auffaellige Zugriffe, Vorfallhinweise und Auditierbarkeit sichtbar zu machen.",
      userVisible: true,
      updatedAt: now
    },
    {
      id: randomUUID(),
      category: "quantum-lens-output",
      storageScope: "analysis-layer",
      retentionRule: "Wird als symbolische Interpretation gespeichert, niemals als physikalischer Faktenbeleg.",
      activeUsageSummary: "Wird fuer reflektierende Antworten mit klarer Wahrhaftigkeitsgrenze genutzt.",
      userVisible: true,
      updatedAt: now
    }
  ];
}

@Injectable()
export class PrivacyService implements OnModuleInit {
  private preferences: PrivacyPreferenceSummary = createDefaultPreferences();
  private ledger: PrivacyLedgerEntry[] = createDefaultLedger();
  private exportRequests: DataExportRequestSummary[] = [];
  private deletionRequests: DataDeletionRequestSummary[] = [];

  constructor(
    private readonly consentsService: ConsentsService,
    private readonly auditService: AuditService,
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.preferences = await this.desktopState.loadSection("privacy.preferences", this.preferences);
        this.ledger = await this.desktopState.loadSection("privacy.ledger", this.ledger);
        this.exportRequests = await this.desktopState.loadSection("privacy.exportRequests", this.exportRequests);
        this.deletionRequests = await this.desktopState.loadSection("privacy.deletionRequests", this.deletionRequests);
      }
      return;
    }

    await this.prisma.ensureLocalUser();

    const [preference, ledgerEntries, exportRequests, deletionRequests] = await Promise.all([
      this.prisma.privacyPreference.findUnique({ where: { userId: LOCAL_USER_ID } }),
      this.prisma.privacyLedgerRecord.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { updatedAt: "desc" }
      }),
      this.prisma.dataExportRequest.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { requestedAt: "desc" }
      }),
      this.prisma.dataDeletionRequest.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { requestedAt: "desc" }
      })
    ]);

    if (!preference) {
      await this.prisma.privacyPreference.create({
        data: {
          userId: LOCAL_USER_ID,
          privacyMode: this.preferences.privacyMode,
          analyticsEnabled: this.preferences.analyticsEnabled,
          longTermMemoryEnabled: this.preferences.longTermMemoryEnabled,
          exportFormat: this.preferences.exportFormat,
          securityAlerts: this.preferences.securityAlerts,
          retentionProfile: this.preferences.retentionProfile
        }
      });
    } else {
      this.preferences = {
        privacyMode: preference.privacyMode as PrivacyPreferenceSummary["privacyMode"],
        analyticsEnabled: preference.analyticsEnabled,
        longTermMemoryEnabled: preference.longTermMemoryEnabled,
        exportFormat: preference.exportFormat as PrivacyPreferenceSummary["exportFormat"],
        securityAlerts: preference.securityAlerts,
        retentionProfile: preference.retentionProfile
      };
    }

    if (ledgerEntries.length === 0) {
      await this.prisma.privacyLedgerRecord.createMany({
        data: this.ledger.map((entry) => ({
          id: entry.id,
          userId: LOCAL_USER_ID,
          category: entry.category,
          storageScope: entry.storageScope,
          retentionRule: entry.retentionRule,
          activeUsageSummary: entry.activeUsageSummary,
          userVisible: entry.userVisible
        }))
      });
    } else {
      this.ledger = ledgerEntries.map((entry) => ({
        id: entry.id,
        category: entry.category,
        storageScope: entry.storageScope,
        retentionRule: entry.retentionRule,
        activeUsageSummary: entry.activeUsageSummary,
        userVisible: entry.userVisible,
        updatedAt: entry.updatedAt.toISOString()
      }));
    }

    this.exportRequests = exportRequests.map((request) => ({
      id: request.id,
      format: request.format as DataExportRequestSummary["format"],
      status: request.status as DataExportRequestSummary["status"],
      requestedAt: request.requestedAt.toISOString(),
      expiresAt: request.expiresAt?.toISOString()
    }));

    this.deletionRequests = deletionRequests.map((request) => ({
      id: request.id,
      scope: request.scope as DataDeletionRequestSummary["scope"],
      status: request.status as DataDeletionRequestSummary["status"],
      requestedAt: request.requestedAt.toISOString(),
      scheduledFor: request.scheduledFor.toISOString()
    }));
  }

  private async persistPreferences() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("privacy.preferences", this.preferences);
      }
      return;
    }

    await this.prisma.privacyPreference.upsert({
      where: { userId: LOCAL_USER_ID },
      update: {
        privacyMode: this.preferences.privacyMode,
        analyticsEnabled: this.preferences.analyticsEnabled,
        longTermMemoryEnabled: this.preferences.longTermMemoryEnabled,
        exportFormat: this.preferences.exportFormat,
        securityAlerts: this.preferences.securityAlerts,
        retentionProfile: this.preferences.retentionProfile
      },
      create: {
        userId: LOCAL_USER_ID,
        privacyMode: this.preferences.privacyMode,
        analyticsEnabled: this.preferences.analyticsEnabled,
        longTermMemoryEnabled: this.preferences.longTermMemoryEnabled,
        exportFormat: this.preferences.exportFormat,
        securityAlerts: this.preferences.securityAlerts,
        retentionProfile: this.preferences.retentionProfile
      }
    });
  }

  private async persistExportRequest(request: DataExportRequestSummary) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("privacy.exportRequests", this.exportRequests);
      }
      return;
    }

    await this.prisma.dataExportRequest.create({
      data: {
        id: request.id,
        userId: LOCAL_USER_ID,
        format: request.format,
        status: request.status,
        requestedAt: new Date(request.requestedAt),
        expiresAt: request.expiresAt ? new Date(request.expiresAt) : null
      }
    });
  }

  private async persistDeletionRequest(request: DataDeletionRequestSummary) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("privacy.deletionRequests", this.deletionRequests);
      }
      return;
    }

    await this.prisma.dataDeletionRequest.create({
      data: {
        id: request.id,
        userId: LOCAL_USER_ID,
        scope: request.scope,
        status: request.status,
        requestedAt: new Date(request.requestedAt),
        scheduledFor: new Date(request.scheduledFor)
      }
    });
  }

  async getOverview(userId: string = LOCAL_USER_ID): Promise<PrivacyOverview> {
    const preferences = await this.getPreferences(userId);
    const consents = await this.consentsService.listConsents(userId);
    const ledger =
      this.prisma && userId !== LOCAL_USER_ID
        ? (
            await this.prisma.privacyLedgerRecord.findMany({
              where: { userId },
              orderBy: { updatedAt: "desc" }
            })
          ).map((entry) => ({
            id: entry.id,
            category: entry.category,
            storageScope: entry.storageScope,
            retentionRule: entry.retentionRule,
            activeUsageSummary: entry.activeUsageSummary,
            userVisible: entry.userVisible,
            updatedAt: entry.updatedAt.toISOString()
          }))
        : this.ledger;
    const exportRequests =
      this.prisma && userId !== LOCAL_USER_ID
        ? (
            await this.prisma.dataExportRequest.findMany({
              where: { userId },
              orderBy: { requestedAt: "desc" }
            })
          ).map((request) => ({
            id: request.id,
            format: request.format as DataExportRequestSummary["format"],
            status: request.status as DataExportRequestSummary["status"],
            requestedAt: request.requestedAt.toISOString(),
            expiresAt: request.expiresAt?.toISOString()
          }))
        : this.exportRequests;
    const deletionRequests =
      this.prisma && userId !== LOCAL_USER_ID
        ? (
            await this.prisma.dataDeletionRequest.findMany({
              where: { userId },
              orderBy: { requestedAt: "desc" }
            })
          ).map((request) => ({
            id: request.id,
            scope: request.scope as DataDeletionRequestSummary["scope"],
            status: request.status as DataDeletionRequestSummary["status"],
            requestedAt: request.requestedAt.toISOString(),
            scheduledFor: request.scheduledFor.toISOString()
          }))
        : this.deletionRequests;

    return {
      preferences,
      consents,
      ledger,
      exportRequests,
      deletionRequests,
      guidance: [
        "AION trennt Beobachtung, Deutung und Symbolik auch im Datenschutzbereich sichtbar.",
        "Export und Loeschung sind als echte, explizite Nutzerpfade vorbereitet statt nur juristisch behauptet.",
        "Privacy Max reduziert Datenspuren, ersetzt aber keine unhaltbaren Totalversprechen von vollstaendiger Anonymitaet."
      ]
    };
  }

  async getPreferences(userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const preference = await this.prisma.privacyPreference.findUnique({
        where: { userId }
      });

      return preference
        ? {
            privacyMode: preference.privacyMode as PrivacyPreferenceSummary["privacyMode"],
            analyticsEnabled: preference.analyticsEnabled,
            longTermMemoryEnabled: preference.longTermMemoryEnabled,
            exportFormat: preference.exportFormat as PrivacyPreferenceSummary["exportFormat"],
            securityAlerts: preference.securityAlerts,
            retentionProfile: preference.retentionProfile
          }
        : createDefaultPreferences();
    }

    return this.preferences;
  }

  async updatePreferences(dto: UpdatePrivacyPreferencesDto, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const next = {
        ...(await this.getPreferences(userId)),
        ...dto
      };

      await this.prisma.privacyPreference.upsert({
        where: { userId },
        update: next,
        create: {
          userId,
          ...next
        }
      });
      await this.auditService.record({
        category: "privacy",
        action: "preferences.updated",
        resource: "privacy-preferences",
        actorType: "user",
        actorId: userId,
        detail: `Die Datenschutzpraeferenzen wurden aktualisiert. Modus: ${next.privacyMode}, Aufbewahrung: ${next.retentionProfile}.`
      });
      return next;
    }

    this.preferences = {
      ...this.preferences,
      ...dto
    };

    await this.persistPreferences();
    await this.auditService.record({
      category: "privacy",
      action: "preferences.updated",
      resource: "privacy-preferences",
      actorType: "user",
      actorId: userId,
      detail: `Die Datenschutzpraeferenzen wurden aktualisiert. Modus: ${this.preferences.privacyMode}, Aufbewahrung: ${this.preferences.retentionProfile}.`
    });

    return this.preferences;
  }

  async requestExport(dto: CreateExportRequestDto = {}, userId: string = LOCAL_USER_ID) {
    const preferences = await this.getPreferences(userId);
    const requestedAt = new Date();
    const request: DataExportRequestSummary = {
      id: randomUUID(),
      format: dto.format ?? preferences.exportFormat,
      status: "queued",
      requestedAt: requestedAt.toISOString(),
      expiresAt: new Date(requestedAt.getTime() + 1000 * 60 * 60 * 24 * 7).toISOString()
    };

    if (this.prisma && userId !== LOCAL_USER_ID) {
      await this.prisma.dataExportRequest.create({
        data: {
          id: request.id,
          userId,
          format: request.format,
          status: request.status,
          requestedAt,
          expiresAt: request.expiresAt ? new Date(request.expiresAt) : null
        }
      });
    } else {
      this.exportRequests.unshift(request);
      await this.persistExportRequest(request);
    }
    await this.auditService.record({
      category: "privacy",
      action: "export.requested",
      resource: request.format,
      actorType: "user",
      actorId: userId,
      detail: `Ein Export im Format ${request.format} wurde im Datenschutzbereich angefordert.`
    });
    return request;
  }

  async requestDeletion(dto: CreateDeletionRequestDto, userId: string = LOCAL_USER_ID) {
    const requestedAt = new Date();
    const request: DataDeletionRequestSummary = {
      id: randomUUID(),
      scope: dto.scope,
      status: "queued",
      requestedAt: requestedAt.toISOString(),
      scheduledFor: new Date(requestedAt.getTime() + 1000 * 60 * 30).toISOString()
    };

    if (this.prisma && userId !== LOCAL_USER_ID) {
      await this.prisma.dataDeletionRequest.create({
        data: {
          id: request.id,
          userId,
          scope: request.scope,
          status: request.status,
          requestedAt,
          scheduledFor: new Date(request.scheduledFor)
        }
      });
    } else {
      this.deletionRequests.unshift(request);
      await this.persistDeletionRequest(request);
    }
    await this.auditService.record({
      category: "privacy",
      action: "deletion.requested",
      resource: dto.scope,
      actorType: "user",
      actorId: userId,
      detail: `Ein Loeschworkflow fuer den Bereich ${dto.scope} wurde angefordert.`
    });
    return request;
  }
}
