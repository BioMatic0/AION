import { Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { NotificationHistoryItem, NotificationPreference } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { UpdateNotificationPreferencesDto } from "./dto/update-notification-preferences.dto";

interface NotificationJobRecord {
  id: string;
  jobType: "growth" | "goal";
  scheduledFor: string;
  status: "scheduled" | "paused";
}

function createDefaultPreferences(): NotificationPreference {
  return {
    developmentEnabled: true,
    goalRemindersEnabled: true,
    frequency: "daily",
    preferredTime: "08:30",
    preferredWeekday: "monday",
    tone: "mixed"
  };
}

function createDefaultHistory(): NotificationHistoryItem[] {
  return [
    {
      id: randomUUID(),
      notificationType: "growth",
      channel: "email",
      title: "Entwicklungsimpuls",
      message: "Heute brauchst du keinen neuen Plan, sondern einen klaren kleinen Schritt.",
      deliveredAt: new Date().toISOString(),
      status: "sent"
    }
  ];
}

function computeScheduledFor(jobType: "growth" | "goal", preferences: NotificationPreference) {
  const [hours, minutes] = preferences.preferredTime.split(":").map((value) => Number(value));
  const next = new Date();
  next.setSeconds(0, 0);
  next.setHours(hours ?? 8, minutes ?? 0, 0, 0);

  if (next.getTime() <= Date.now()) {
    next.setDate(next.getDate() + 1);
  }

  if (preferences.frequency === "every_2_days") {
    next.setDate(next.getDate() + 1);
  } else if (preferences.frequency === "weekly") {
    next.setDate(next.getDate() + 6);
  }

  if (jobType === "goal" && preferences.frequency === "weekly") {
    next.setDate(next.getDate() + 1);
  }

  return next.toISOString();
}

function createDefaultJobs(preferences: NotificationPreference): NotificationJobRecord[] {
  return [
    {
      id: randomUUID(),
      jobType: "growth",
      scheduledFor: computeScheduledFor("growth", preferences),
      status: "scheduled"
    }
  ];
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private preferences: NotificationPreference = createDefaultPreferences();
  private history: NotificationHistoryItem[] = createDefaultHistory();
  private jobs: NotificationJobRecord[] = createDefaultJobs(this.preferences);

  constructor(
    private readonly auditService: AuditService,
    @Optional() private readonly prisma?: PrismaService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      return;
    }

    await this.prisma.ensureLocalUser();
    const [preference, history, jobs] = await Promise.all([
      this.prisma.notificationPreference.findUnique({ where: { userId: LOCAL_USER_ID } }),
      this.prisma.notificationHistory.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { deliveredAt: "desc" }
      }),
      this.prisma.notificationJob.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { scheduledFor: "asc" }
      })
    ]);

    if (!preference) {
      await this.prisma.notificationPreference.create({
        data: {
          userId: LOCAL_USER_ID,
          ...this.preferences
        }
      });
    } else {
      this.preferences = {
        developmentEnabled: preference.developmentEnabled,
        goalRemindersEnabled: preference.goalRemindersEnabled,
        frequency: preference.frequency as NotificationPreference["frequency"],
        preferredTime: preference.preferredTime,
        preferredWeekday: preference.preferredWeekday,
        tone: preference.tone as NotificationPreference["tone"]
      };
    }

    if (history.length === 0) {
      await this.prisma.notificationHistory.createMany({
        data: this.history.map((item) => ({
          id: item.id,
          userId: LOCAL_USER_ID,
          notificationType: item.notificationType,
          channel: item.channel,
          title: item.title,
          message: item.message,
          deliveredAt: new Date(item.deliveredAt),
          status: item.status
        }))
      });
    } else {
      this.history = history.map((item) => ({
        id: item.id,
        notificationType: item.notificationType as NotificationHistoryItem["notificationType"],
        channel: item.channel as NotificationHistoryItem["channel"],
        title: item.title,
        message: item.message,
        deliveredAt: item.deliveredAt.toISOString(),
        status: item.status as NotificationHistoryItem["status"]
      }));
    }

    if (jobs.length === 0) {
      await this.syncJobs();
    } else {
      this.jobs = jobs.map((job) => ({
        id: job.id,
        jobType: job.jobType as NotificationJobRecord["jobType"],
        scheduledFor: job.scheduledFor.toISOString(),
        status: job.status as NotificationJobRecord["status"]
      }));
    }
  }

  private expectedJobs() {
    const jobs: NotificationJobRecord[] = [];

    if (this.preferences.developmentEnabled) {
      const existing = this.jobs.find((job) => job.jobType === "growth");
      jobs.push({
        id: existing?.id ?? randomUUID(),
        jobType: "growth",
        scheduledFor: computeScheduledFor("growth", this.preferences),
        status: "scheduled"
      });
    }

    if (this.preferences.goalRemindersEnabled) {
      const existing = this.jobs.find((job) => job.jobType === "goal");
      jobs.push({
        id: existing?.id ?? randomUUID(),
        jobType: "goal",
        scheduledFor: computeScheduledFor("goal", this.preferences),
        status: "scheduled"
      });
    }

    return jobs;
  }

  private async syncJobs() {
    const nextJobs = this.expectedJobs();
    this.jobs = nextJobs;

    if (!this.prisma) {
      return;
    }

    await this.prisma.notificationJob.deleteMany({
      where: { userId: LOCAL_USER_ID }
    });

    if (nextJobs.length > 0) {
      await this.prisma.notificationJob.createMany({
        data: nextJobs.map((job) => ({
          id: job.id,
          userId: LOCAL_USER_ID,
          jobType: job.jobType,
          scheduledFor: new Date(job.scheduledFor),
          status: job.status
        }))
      });
    }
  }

  private async persistPreferences() {
    if (!this.prisma) {
      return;
    }

    await this.prisma.notificationPreference.upsert({
      where: { userId: LOCAL_USER_ID },
      update: {
        developmentEnabled: this.preferences.developmentEnabled,
        goalRemindersEnabled: this.preferences.goalRemindersEnabled,
        frequency: this.preferences.frequency,
        preferredTime: this.preferences.preferredTime,
        preferredWeekday: this.preferences.preferredWeekday,
        tone: this.preferences.tone
      },
      create: {
        userId: LOCAL_USER_ID,
        developmentEnabled: this.preferences.developmentEnabled,
        goalRemindersEnabled: this.preferences.goalRemindersEnabled,
        frequency: this.preferences.frequency,
        preferredTime: this.preferences.preferredTime,
        preferredWeekday: this.preferences.preferredWeekday,
        tone: this.preferences.tone
      }
    });
  }

  private async persistHistoryItem(item: NotificationHistoryItem) {
    if (!this.prisma) {
      return;
    }

    await this.prisma.notificationHistory.create({
      data: {
        id: item.id,
        userId: LOCAL_USER_ID,
        notificationType: item.notificationType,
        channel: item.channel,
        title: item.title,
        message: item.message,
        deliveredAt: new Date(item.deliveredAt),
        status: item.status
      }
    });
  }

  getPreferences() {
    return this.preferences;
  }

  async updatePreferences(dto: UpdateNotificationPreferencesDto) {
    this.preferences = {
      ...this.preferences,
      ...dto
    };

    await this.persistPreferences();
    await this.syncJobs();
    await this.auditService.record({
      category: "notifications",
      action: "preferences.updated",
      resource: "notification-preferences",
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Die Benachrichtigungspraeferenzen wurden auf ${this.preferences.frequency} / ${this.preferences.tone} aktualisiert.`
    });

    return this.preferences;
  }

  getHistory() {
    return this.history;
  }

  getJobs() {
    return this.jobs;
  }

  async createPreviewNotification() {
    const preview: NotificationHistoryItem = {
      id: randomUUID(),
      notificationType: this.preferences.goalRemindersEnabled ? "goal" : "growth",
      channel: "in-app",
      title: this.preferences.goalRemindersEnabled ? "Ziel-Erinnerung" : "Entwicklungsimpuls",
      message:
        this.preferences.tone === "motivational"
          ? "Bleib in Bewegung. Ein echter kleiner Schritt reicht fuer heute."
          : this.preferences.tone === "reflective"
            ? "Welcher offene Punkt verlangt heute nach Klarheit statt Aufschub?"
            : "Heute gilt: klar schauen, klein handeln, dranbleiben.",
      deliveredAt: new Date().toISOString(),
      status: "queued"
    };

    this.history.unshift(preview);
    await this.persistHistoryItem(preview);
    await this.auditService.record({
      category: "notifications",
      action: "preview.created",
      resource: preview.id,
      actorType: "system",
      actorId: "notification-engine",
      detail: `Die Benachrichtigungsvorschau "${preview.title}" wurde erzeugt.`
    });
    return preview;
  }
}
