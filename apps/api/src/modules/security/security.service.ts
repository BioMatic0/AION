import { Inject, Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import type {
  IncidentNotificationSummary,
  SecurityCenterOverview,
  SecurityEventSummary,
  SecurityIncidentSummary,
  SecuritySessionSummary,
  SecuritySeverity
} from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";

type SessionTokenMap = Record<string, { sessionId: string; userId: string }>;

function createDefaultSessions(): SecuritySessionSummary[] {
  const now = new Date().toISOString();

  return [
    {
      id: randomUUID(),
      userId: LOCAL_USER_ID,
      label: "Primaeres Arbeitsgeraet",
      createdAt: now,
      lastSeenAt: now,
      revokedAt: null
    }
  ];
}

function createDefaultEvents(): SecurityEventSummary[] {
  return [
    {
      id: randomUUID(),
      userId: LOCAL_USER_ID,
      type: "session.opened",
      severity: "info",
      createdAt: new Date().toISOString(),
      summary: "Die erste lokale Entwicklungssitzung fuer AION wurde geoeffnet."
    }
  ];
}

function createDefaultIncidents(): SecurityIncidentSummary[] {
  return [
    {
      id: randomUUID(),
      incidentType: "suspicious-login-pattern",
      severity: "warning",
      affectedScope: "session-layer",
      status: "investigating",
      detectedAt: new Date().toISOString(),
      summary:
        "Eine simulierte Regel fuer auffaellige Anmeldungen ist aktiv, damit das Vorfallcenter einen sichtbaren Zustand hat.",
      recommendedAction:
        "Pruefe die Geraeteliste, widerrufe unbekannte Sitzungen und rotiere bei Bedarf Geheimnisse."
    }
  ];
}

function createDefaultNotifications(): IncidentNotificationSummary[] {
  return [
    {
      id: randomUUID(),
      incidentType: "suspicious-login-pattern",
      severity: "warning",
      title: "Sicherheitswarnung sichtbar",
      description:
        "Die lokale Entwicklungsumgebung zeigt einen simulierten Incident-Pfad fuer Nutzertransparenz.",
      recommendedAction: "Pruefe Sessions und bestaetige, ob die Aktivitaet erwartet war.",
      deliveredVia: ["email", "in-app"],
      deliveredAt: new Date().toISOString()
    }
  ];
}

@Injectable()
export class SecurityService implements OnModuleInit {
  private sessions: SecuritySessionSummary[] = createDefaultSessions();
  private events: SecurityEventSummary[] = createDefaultEvents();
  private incidents: SecurityIncidentSummary[] = createDefaultIncidents();
  private notifications: IncidentNotificationSummary[] = createDefaultNotifications();
  private sessionTokens: SessionTokenMap = {};

  constructor(
    private readonly auditService: AuditService,
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.sessions = await this.desktopState.loadSection("security.sessions", this.sessions);
        this.events = await this.desktopState.loadSection("security.events", this.events);
        this.incidents = await this.desktopState.loadSection("security.incidents", this.incidents);
        this.notifications = await this.desktopState.loadSection("security.notifications", this.notifications);
        this.sessionTokens = await this.desktopState.loadSection("security.sessionTokens", this.sessionTokens);
      }
      return;
    }

    await this.prisma.ensureLocalUser();

    const [sessions, events, incidents, notifications] = await Promise.all([
      this.prisma.activeSession.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.securityEvent.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.securityIncident.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { detectedAt: "desc" }
      }),
      this.prisma.incidentNotification.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { deliveredAt: "desc" }
      })
    ]);

    if (sessions.length === 0) {
      await this.prisma.activeSession.createMany({
        data: this.sessions.map((session) => ({
          id: session.id,
          userId: LOCAL_USER_ID,
          deviceLabel: session.label,
          sessionTokenHash: null,
          createdAt: new Date(session.createdAt),
          lastSeenAt: new Date(session.lastSeenAt),
          revokedAt: session.revokedAt ? new Date(session.revokedAt) : null
        }))
      });
    } else {
      this.sessions = sessions.map((session) => this.mapSession(session));
    }

    if (events.length === 0) {
      await this.prisma.securityEvent.createMany({
        data: this.events.map((event) => ({
          id: event.id,
          userId: LOCAL_USER_ID,
          eventType: event.type,
          severity: event.severity,
          summary: event.summary,
          createdAt: new Date(event.createdAt)
        }))
      });
    } else {
      this.events = events.map((event) => this.mapEvent(event));
    }

    if (incidents.length === 0) {
      await this.prisma.securityIncident.createMany({
        data: this.incidents.map((incident) => ({
          id: incident.id,
          userId: LOCAL_USER_ID,
          incidentType: incident.incidentType,
          affectedScope: incident.affectedScope,
          severity: incident.severity,
          status: incident.status,
          summary: incident.summary,
          recommendedAction: incident.recommendedAction,
          detectedAt: new Date(incident.detectedAt),
          resolvedAt: incident.resolvedAt ? new Date(incident.resolvedAt) : null
        }))
      });
    } else {
      this.incidents = incidents.map((incident) => this.mapIncident(incident));
    }

    if (notifications.length === 0) {
      await this.prisma.incidentNotification.createMany({
        data: this.notifications.map((notification) => ({
          id: notification.id,
          userId: LOCAL_USER_ID,
          incidentType: notification.incidentType,
          severity: notification.severity,
          title: notification.title,
          description: notification.description,
          recommendedAction: notification.recommendedAction,
          deliveredVia: notification.deliveredVia,
          deliveredAt: new Date(notification.deliveredAt),
          acknowledgedAt: notification.acknowledgedAt ? new Date(notification.acknowledgedAt) : null
        }))
      });
    } else {
      this.notifications = notifications.map((notification) => this.mapNotification(notification));
    }
  }

  private hashSessionToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private mapSession(session: {
    id: string;
    userId: string;
    deviceLabel: string;
    createdAt: Date;
    lastSeenAt: Date;
    revokedAt: Date | null;
  }): SecuritySessionSummary {
    return {
      id: session.id,
      userId: session.userId,
      label: session.deviceLabel,
      createdAt: session.createdAt.toISOString(),
      lastSeenAt: session.lastSeenAt.toISOString(),
      revokedAt: session.revokedAt?.toISOString() ?? null
    };
  }

  private mapEvent(event: {
    id: string;
    userId: string;
    eventType: string;
    severity: string;
    createdAt: Date;
    summary: string;
  }): SecurityEventSummary {
    return {
      id: event.id,
      userId: event.userId,
      type: event.eventType,
      severity: event.severity as SecuritySeverity,
      createdAt: event.createdAt.toISOString(),
      summary: event.summary
    };
  }

  private mapIncident(incident: {
    id: string;
    incidentType: string;
    severity: string;
    affectedScope: string;
    status: string;
    detectedAt: Date;
    resolvedAt: Date | null;
    summary: string;
    recommendedAction: string;
  }): SecurityIncidentSummary {
    return {
      id: incident.id,
      incidentType: incident.incidentType,
      severity: incident.severity as SecuritySeverity,
      affectedScope: incident.affectedScope,
      status: incident.status as SecurityIncidentSummary["status"],
      detectedAt: incident.detectedAt.toISOString(),
      resolvedAt: incident.resolvedAt?.toISOString(),
      summary: incident.summary,
      recommendedAction: incident.recommendedAction
    };
  }

  private mapNotification(notification: {
    id: string;
    incidentType: string;
    severity: string;
    title: string;
    description: string;
    recommendedAction: string;
    deliveredVia: unknown;
    deliveredAt: Date;
    acknowledgedAt: Date | null;
  }): IncidentNotificationSummary {
    return {
      id: notification.id,
      incidentType: notification.incidentType,
      severity: notification.severity as SecuritySeverity,
      title: notification.title,
      description: notification.description,
      recommendedAction: notification.recommendedAction,
      deliveredVia: Array.isArray(notification.deliveredVia)
        ? notification.deliveredVia.filter(
            (value): value is "email" | "in-app" => value === "email" || value === "in-app"
          )
        : ["in-app"],
      deliveredAt: notification.deliveredAt.toISOString(),
      acknowledgedAt: notification.acknowledgedAt?.toISOString()
    };
  }

  private async persistDesktopState() {
    if (!this.desktopState?.isEnabled()) {
      return;
    }

    await Promise.all([
      this.desktopState.saveSection("security.sessions", this.sessions),
      this.desktopState.saveSection("security.events", this.events),
      this.desktopState.saveSection("security.incidents", this.incidents),
      this.desktopState.saveSection("security.notifications", this.notifications),
      this.desktopState.saveSection("security.sessionTokens", this.sessionTokens)
    ]);
  }

  async openSessionWithToken(userId: string, label: string) {
    const now = new Date().toISOString();
    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashSessionToken(token);
    const session: SecuritySessionSummary = {
      id: randomUUID(),
      userId,
      label,
      createdAt: now,
      lastSeenAt: now,
      revokedAt: null
    };

    if (this.prisma) {
      await this.prisma.activeSession.create({
        data: {
          id: session.id,
          userId,
          deviceLabel: label,
          sessionTokenHash: tokenHash,
          createdAt: new Date(session.createdAt),
          lastSeenAt: new Date(session.lastSeenAt),
          revokedAt: null
        }
      });
    } else {
      this.sessions.unshift(session);
      this.sessionTokens[tokenHash] = { sessionId: session.id, userId };
      await this.persistDesktopState();
    }

    await this.recordEvent(userId, "session.opened", "info", `Sitzung fuer ${label} wurde geoeffnet.`);
    await this.auditService.record({
      category: "security",
      action: "session.opened",
      resource: label,
      actorType: "user",
      actorId: userId,
      detail: `Eine Sitzung fuer ${label} wurde geoeffnet.`
    });

    return {
      session,
      token
    };
  }

  async openSession(userId: string, label: string) {
    const { session } = await this.openSessionWithToken(userId, label);
    return session;
  }

  async resolveSessionToken(token: string) {
    const tokenHash = this.hashSessionToken(token);

    if (this.prisma) {
      const session = await this.prisma.activeSession.findFirst({
        where: {
          sessionTokenHash: tokenHash,
          revokedAt: null
        }
      });

      return session ? this.mapSession(session) : null;
    }

    const match = this.sessionTokens[tokenHash];
    if (!match) {
      return null;
    }

    const session = this.sessions.find((item) => item.id === match.sessionId && item.revokedAt === null);
    return session ?? null;
  }

  async revokeSession(sessionId: string, userId?: string) {
    if (this.prisma) {
      const session = await this.prisma.activeSession.findFirst({
        where: {
          id: sessionId,
          ...(userId ? { userId } : {})
        }
      });

      if (!session) {
        return null;
      }

      const revokedAt = new Date();
      await this.prisma.activeSession.update({
        where: { id: session.id },
        data: { revokedAt }
      });

      const mapped = this.mapSession({
        ...session,
        revokedAt
      });

      await this.recordEvent(
        mapped.userId,
        "session.revoked",
        "warning",
        `Sitzung ${mapped.label} wurde widerrufen.`
      );
      await this.auditService.record({
        category: "security",
        action: "session.revoked",
        resource: mapped.label,
        actorType: "user",
        actorId: mapped.userId,
        detail: `Die Sitzung ${mapped.label} wurde widerrufen.`
      });

      return mapped;
    }

    const session = this.sessions.find((item) => item.id === sessionId && (!userId || item.userId === userId));
    if (!session) {
      return null;
    }

    session.revokedAt = new Date().toISOString();
    for (const [tokenHash, entry] of Object.entries(this.sessionTokens)) {
      if (entry.sessionId === session.id) {
        delete this.sessionTokens[tokenHash];
      }
    }
    await this.persistDesktopState();
    await this.recordEvent(session.userId, "session.revoked", "warning", `Sitzung ${session.label} wurde widerrufen.`);
    await this.auditService.record({
      category: "security",
      action: "session.revoked",
      resource: session.label,
      actorType: "user",
      actorId: session.userId,
      detail: `Die Sitzung ${session.label} wurde widerrufen.`
    });
    return session;
  }

  async revokeSessionByToken(token: string) {
    const session = await this.resolveSessionToken(token);
    if (!session) {
      return null;
    }

    return this.revokeSession(session.id, session.userId);
  }

  async recordEvent(userId: string, type: string, severity: SecuritySeverity, summary: string) {
    const event: SecurityEventSummary = {
      id: randomUUID(),
      userId,
      type,
      severity,
      createdAt: new Date().toISOString(),
      summary
    };

    if (this.prisma) {
      await this.prisma.securityEvent.create({
        data: {
          id: event.id,
          userId,
          eventType: type,
          severity,
          summary,
          createdAt: new Date(event.createdAt)
        }
      });
      return event;
    }

    this.events.unshift(event);
    await this.persistDesktopState();
    return event;
  }

  async createIncident(
    userId: string = LOCAL_USER_ID,
    input: {
      incidentType: string;
      severity: SecuritySeverity;
      affectedScope: string;
      summary: string;
      recommendedAction: string;
    }
  ) {
    const incident: SecurityIncidentSummary = {
      id: randomUUID(),
      incidentType: input.incidentType,
      severity: input.severity,
      affectedScope: input.affectedScope,
      status: input.severity === "critical" ? "open" : "investigating",
      detectedAt: new Date().toISOString(),
      summary: input.summary,
      recommendedAction: input.recommendedAction
    };

    const notification: IncidentNotificationSummary = {
      id: randomUUID(),
      incidentType: input.incidentType,
      severity: input.severity,
      title: `Vorfall: ${input.incidentType}`,
      description: input.summary,
      recommendedAction: input.recommendedAction,
      deliveredVia: ["email", "in-app"],
      deliveredAt: new Date().toISOString()
    };

    if (this.prisma) {
      await this.prisma.securityIncident.create({
        data: {
          id: incident.id,
          userId,
          incidentType: incident.incidentType,
          affectedScope: incident.affectedScope,
          severity: incident.severity,
          status: incident.status,
          summary: incident.summary,
          recommendedAction: incident.recommendedAction,
          detectedAt: new Date(incident.detectedAt)
        }
      });

      await this.prisma.incidentNotification.create({
        data: {
          id: notification.id,
          userId,
          incidentType: notification.incidentType,
          severity: notification.severity,
          title: notification.title,
          description: notification.description,
          recommendedAction: notification.recommendedAction,
          deliveredVia: notification.deliveredVia,
          deliveredAt: new Date(notification.deliveredAt)
        }
      });
    } else {
      this.incidents.unshift(incident);
      this.notifications.unshift(notification);
      await this.persistDesktopState();
    }

    await this.auditService.record({
      category: "security",
      action: "incident.created",
      resource: input.incidentType,
      actorType: "system",
      actorId: "incident-engine",
      detail: input.summary
    });
    return incident;
  }

  async acknowledgeNotification(notificationId: string, userId: string = LOCAL_USER_ID) {
    if (this.prisma) {
      const notification = await this.prisma.incidentNotification.findFirst({
        where: { id: notificationId, userId }
      });
      if (!notification) {
        return null;
      }

      const acknowledgedAt = new Date();
      await this.prisma.incidentNotification.update({
        where: { id: notification.id },
        data: { acknowledgedAt }
      });

      const mapped = this.mapNotification({
        ...notification,
        acknowledgedAt
      });
      await this.auditService.record({
        category: "security",
        action: "incident.acknowledged",
        resource: mapped.incidentType,
        actorType: "user",
        actorId: userId,
        detail: `Incident notification ${mapped.id} was acknowledged.`
      });
      return mapped;
    }

    const notification = this.notifications.find((item) => item.id === notificationId);
    if (!notification) {
      return null;
    }

    notification.acknowledgedAt = new Date().toISOString();
    await this.persistDesktopState();
    await this.auditService.record({
      category: "security",
      action: "incident.acknowledged",
      resource: notification.incidentType,
      actorType: "user",
      actorId: userId,
      detail: `Incident notification ${notification.id} was acknowledged.`
    });
    return notification;
  }

  async simulateSuspiciousLogin(userId: string = LOCAL_USER_ID) {
    await this.recordEvent(
      userId,
      "login.suspicious",
      "critical",
      "A suspicious login pattern was detected during the simulated incident flow."
    );

    return this.createIncident(userId, {
      incidentType: "login.suspicious",
      severity: "critical",
      affectedScope: "account-and-session",
      summary: "A suspicious login flow was simulated to test transparency and incident escalation.",
      recommendedAction: "Review active sessions, rotate credentials and confirm whether the login was expected."
    });
  }

  async listIncidents(userId: string = LOCAL_USER_ID) {
    if (this.prisma) {
      const incidents = await this.prisma.securityIncident.findMany({
        where: { userId },
        orderBy: { detectedAt: "desc" }
      });
      return incidents.map((incident) => this.mapIncident(incident));
    }

    return this.incidents.filter((incident) => userId === LOCAL_USER_ID);
  }

  async listNotifications(userId: string = LOCAL_USER_ID) {
    if (this.prisma) {
      const notifications = await this.prisma.incidentNotification.findMany({
        where: { userId },
        orderBy: { deliveredAt: "desc" }
      });
      return notifications.map((notification) => this.mapNotification(notification));
    }

    return this.notifications.filter((notification) => userId === LOCAL_USER_ID);
  }

  async getOverview(userId: string = LOCAL_USER_ID): Promise<SecurityCenterOverview> {
    if (this.prisma) {
      const [sessions, events, incidents, notifications] = await Promise.all([
        this.prisma.activeSession.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" }
        }),
        this.prisma.securityEvent.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20
        }),
        this.prisma.securityIncident.findMany({
          where: { userId },
          orderBy: { detectedAt: "desc" },
          take: 12
        }),
        this.prisma.incidentNotification.findMany({
          where: { userId },
          orderBy: { deliveredAt: "desc" },
          take: 12
        })
      ]);

      return {
        sessions: sessions.map((session) => this.mapSession(session)),
        events: events.map((event) => this.mapEvent(event)),
        incidents: incidents.map((incident) => this.mapIncident(incident)),
        notifications: notifications.map((notification) => this.mapNotification(notification))
      };
    }

    return {
      sessions: this.sessions.filter((session) => session.userId === userId),
      events: this.events.filter((event) => event.userId === userId).slice(0, 20),
      incidents: this.incidents.slice(0, 12),
      notifications: this.notifications.slice(0, 12)
    };
  }
}
