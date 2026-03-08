import { Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type {
  IncidentNotificationSummary,
  SecurityCenterOverview,
  SecurityEventSummary,
  SecurityIncidentSummary,
  SecuritySessionSummary,
  SecuritySeverity
} from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";

function createDefaultSessions(): SecuritySessionSummary[] {
  const now = new Date().toISOString();

  return [
    {
      id: randomUUID(),
      userId: LOCAL_USER_ID,
      label: "Primaerer Arbeitsgeraet",
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
      summary: "Eine simulierte Regel fuer auffaellige Anmeldungen ist aktiv, damit das Vorfallcenter einen sichtbaren Zustand hat.",
      recommendedAction: "Pruefe die Geraeteliste, widerrufe unbekannte Sitzungen und rotiere bei Bedarf Geheimnisse."
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
      description: "Die lokale Entwicklungsumgebung zeigt einen simulierten Incident-Pfad fuer Nutzertransparenz.",
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

  constructor(
    private readonly auditService: AuditService,
    @Optional() private readonly prisma?: PrismaService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
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
          createdAt: new Date(session.createdAt),
          lastSeenAt: new Date(session.lastSeenAt),
          revokedAt: session.revokedAt ? new Date(session.revokedAt) : null
        }))
      });
    } else {
      this.sessions = sessions.map((session) => ({
        id: session.id,
        userId: session.userId,
        label: session.deviceLabel,
        createdAt: session.createdAt.toISOString(),
        lastSeenAt: session.lastSeenAt.toISOString(),
        revokedAt: session.revokedAt?.toISOString() ?? null
      }));
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
      this.events = events.map((event) => ({
        id: event.id,
        userId: event.userId,
        type: event.eventType,
        severity: event.severity as SecuritySeverity,
        createdAt: event.createdAt.toISOString(),
        summary: event.summary
      }));
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
      this.incidents = incidents.map((incident) => ({
        id: incident.id,
        incidentType: incident.incidentType,
        severity: incident.severity as SecuritySeverity,
        affectedScope: incident.affectedScope,
        status: incident.status as SecurityIncidentSummary["status"],
        detectedAt: incident.detectedAt.toISOString(),
        resolvedAt: incident.resolvedAt?.toISOString(),
        summary: incident.summary,
        recommendedAction: incident.recommendedAction
      }));
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
      this.notifications = notifications.map((notification) => ({
        id: notification.id,
        incidentType: notification.incidentType,
        severity: notification.severity as SecuritySeverity,
        title: notification.title,
        description: notification.description,
        recommendedAction: notification.recommendedAction,
        deliveredVia: notification.deliveredVia as IncidentNotificationSummary["deliveredVia"],
        deliveredAt: notification.deliveredAt.toISOString(),
        acknowledgedAt: notification.acknowledgedAt?.toISOString()
      }));
    }
  }

  private async persistSession(session: SecuritySessionSummary) {
    if (!this.prisma) {
      return;
    }

    await this.prisma.activeSession.upsert({
      where: { id: session.id },
      update: {
        deviceLabel: session.label,
        lastSeenAt: new Date(session.lastSeenAt),
        revokedAt: session.revokedAt ? new Date(session.revokedAt) : null
      },
      create: {
        id: session.id,
        userId: LOCAL_USER_ID,
        deviceLabel: session.label,
        createdAt: new Date(session.createdAt),
        lastSeenAt: new Date(session.lastSeenAt),
        revokedAt: session.revokedAt ? new Date(session.revokedAt) : null
      }
    });
  }

  private async persistEvent(event: SecurityEventSummary) {
    if (!this.prisma) {
      return;
    }

    await this.prisma.securityEvent.create({
      data: {
        id: event.id,
        userId: LOCAL_USER_ID,
        eventType: event.type,
        severity: event.severity,
        summary: event.summary,
        createdAt: new Date(event.createdAt)
      }
    });
  }

  private async persistIncident(incident: SecurityIncidentSummary) {
    if (!this.prisma) {
      return;
    }

    await this.prisma.securityIncident.create({
      data: {
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
      }
    });
  }

  private async persistNotification(notification: IncidentNotificationSummary) {
    if (!this.prisma) {
      return;
    }

    await this.prisma.incidentNotification.create({
      data: {
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
      }
    });
  }

  async openSession(userId: string, label: string) {
    const now = new Date().toISOString();
    const session: SecuritySessionSummary = {
      id: randomUUID(),
      userId,
      label,
      createdAt: now,
      lastSeenAt: now,
      revokedAt: null
    };

    this.sessions.unshift(session);
    await this.persistSession(session);
    await this.recordEvent(userId, "session.opened", "info", `Sitzung fuer ${label} wurde geoeffnet.`);
    await this.auditService.record({
      category: "security",
      action: "session.opened",
      resource: label,
      actorType: "user",
      actorId: userId,
      detail: `Eine Sitzung fuer ${label} wurde geoeffnet.`
    });
    return session;
  }

  async revokeSession(sessionId: string) {
    const session = this.sessions.find((item) => item.id === sessionId);
    if (!session) {
      return null;
    }

    session.revokedAt = new Date().toISOString();
    await this.persistSession(session);
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

  async recordEvent(userId: string, type: string, severity: SecuritySeverity, summary: string) {
    const event: SecurityEventSummary = {
      id: randomUUID(),
      userId,
      type,
      severity,
      createdAt: new Date().toISOString(),
      summary
    };

    this.events.unshift(event);
    await this.persistEvent(event);
    return event;
  }

  async createIncident(input: {
    incidentType: string;
    severity: SecuritySeverity;
    affectedScope: string;
    summary: string;
    recommendedAction: string;
  }) {
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

    this.incidents.unshift(incident);
    this.notifications.unshift(notification);
    await this.persistIncident(incident);
    await this.persistNotification(notification);
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

  async acknowledgeNotification(notificationId: string) {
    const notification = this.notifications.find((item) => item.id === notificationId);
    if (!notification) {
      return null;
    }

    notification.acknowledgedAt = new Date().toISOString();
    if (this.prisma) {
      await this.prisma.incidentNotification.update({
        where: { id: notification.id },
        data: {
          acknowledgedAt: new Date(notification.acknowledgedAt)
        }
      });
    }

    await this.auditService.record({
      category: "security",
      action: "incident.acknowledged",
      resource: notification.incidentType,
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Incident notification ${notification.id} was acknowledged.`
    });
    return notification;
  }

  async simulateSuspiciousLogin() {
    await this.recordEvent(
      LOCAL_USER_ID,
      "login.suspicious",
      "critical",
      "A suspicious login pattern was detected during the simulated incident flow."
    );
    return this.createIncident({
      incidentType: "login.suspicious",
      severity: "critical",
      affectedScope: "account-and-session",
      summary: "A suspicious login flow was simulated to test transparency and incident escalation.",
      recommendedAction: "Review active sessions, rotate credentials and confirm whether the login was expected."
    });
  }

  listIncidents() {
    return this.incidents;
  }

  listNotifications() {
    return this.notifications;
  }

  getOverview(): SecurityCenterOverview {
    return {
      sessions: this.sessions,
      events: this.events.slice(0, 20),
      incidents: this.incidents.slice(0, 12),
      notifications: this.notifications.slice(0, 12)
    };
  }
}
