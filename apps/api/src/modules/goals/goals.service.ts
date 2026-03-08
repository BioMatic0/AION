import { Inject, Injectable, NotFoundException, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { GoalMilestone, GoalSummary } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { CreateGoalMilestoneDto } from "./dto/create-goal-milestone.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";
import { UpdateGoalMilestoneDto } from "./dto/update-goal-milestone.dto";

interface AchievementRecord {
  id: string;
  goalId: string;
  title: string;
  achievedAt: string;
}

interface GoalReminderRecord {
  id: string;
  goalId: string;
  frequency: string;
  preferredTime: string;
  nextTriggerAt?: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GoalRecord extends GoalSummary {
  goalType: string;
  priority: string;
  createdAt: string;
}

function createDefaultGoals(): GoalRecord[] {
  const now = new Date().toISOString();

  return [
    {
      id: randomUUID(),
      title: "MVP stabil lauffaehig halten",
      description: "Foundation, Session-Flows und Governance sauber durchziehen.",
      goalType: "project",
      lifeArea: "development",
      priority: "high",
      status: "active",
      progressPercent: 35,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
      milestones: [
        {
          id: randomUUID(),
          title: "Monorepo Basis steht",
          status: "completed",
          completedAt: now
        },
        {
          id: randomUUID(),
          title: "Diary, Notes, Goals anbinden",
          status: "in_progress"
        }
      ],
      createdAt: now,
      updatedAt: now
    }
  ];
}

function createDefaultGoalReminders(goals: GoalRecord[]): GoalReminderRecord[] {
  const firstGoal = goals[0];
  if (!firstGoal) {
    return [];
  }

  const now = new Date().toISOString();
  return [
    {
      id: randomUUID(),
      goalId: firstGoal.id,
      frequency: "weekly",
      preferredTime: "08:30",
      nextTriggerAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      isEnabled: true,
      createdAt: now,
      updatedAt: now
    }
  ];
}

@Injectable()
export class GoalsService implements OnModuleInit {
  private achievements: AchievementRecord[] = [];
  private goals: GoalRecord[] = createDefaultGoals();
  private reminders: GoalReminderRecord[] = createDefaultGoalReminders(this.goals);

  constructor(
    private readonly auditService: AuditService,
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.goals = await this.desktopState.loadSection("goals.items", this.goals);
        this.achievements = await this.desktopState.loadSection("goals.achievements", this.achievements);
        this.reminders = await this.desktopState.loadSection("goals.reminders", this.reminders);
      }
      return;
    }

    await this.prisma.ensureLocalUser();
    const [goals, achievements, reminders] = await Promise.all([
      this.prisma.goal.findMany({
        where: { userId: LOCAL_USER_ID },
        include: { milestones: true },
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.achievement.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { achievedAt: "desc" }
      }),
      this.prisma.goalReminder.findMany({
        where: { goal: { userId: LOCAL_USER_ID } },
        orderBy: { createdAt: "desc" }
      })
    ]);

    if (goals.length === 0) {
      for (const goal of this.goals) {
        await this.prisma.goal.create({
          data: {
            id: goal.id,
            userId: LOCAL_USER_ID,
            title: goal.title,
            description: goal.description,
            goalType: goal.goalType,
            lifeArea: goal.lifeArea,
            priority: goal.priority,
            status: goal.status,
            progressPercent: goal.progressPercent,
            dueDate: goal.dueDate ? new Date(goal.dueDate) : null,
            createdAt: new Date(goal.createdAt),
            updatedAt: new Date(goal.updatedAt),
            milestones: {
              create: goal.milestones.map((milestone) => ({
                id: milestone.id,
                title: milestone.title,
                status: milestone.status,
                dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
                completedAt: milestone.completedAt ? new Date(milestone.completedAt) : null
              }))
            }
          }
        });
      }

      for (const reminder of this.reminders) {
        await this.persistReminder(reminder);
      }
      await this.persistStatsSnapshot();
      return;
    }

    this.goals = goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      goalType: goal.goalType,
      lifeArea: goal.lifeArea,
      priority: goal.priority,
      status: goal.status as GoalRecord["status"],
      progressPercent: goal.progressPercent,
      dueDate: goal.dueDate?.toISOString(),
      milestones: goal.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        status: milestone.status as GoalMilestone["status"],
        dueDate: milestone.dueDate?.toISOString(),
        completedAt: milestone.completedAt?.toISOString()
      })),
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString()
    }));

    this.achievements = achievements.map((achievement) => ({
      id: achievement.id,
      goalId: achievement.goalId,
      title: achievement.title,
      achievedAt: achievement.achievedAt.toISOString()
    }));

    this.reminders = reminders.map((reminder) => ({
      id: reminder.id,
      goalId: reminder.goalId,
      frequency: reminder.frequency,
      preferredTime: reminder.preferredTime,
      nextTriggerAt: reminder.nextTriggerAt?.toISOString(),
      isEnabled: reminder.isEnabled,
      createdAt: reminder.createdAt.toISOString(),
      updatedAt: reminder.updatedAt.toISOString()
    }));
  }

  private async persistGoal(goal: GoalRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("goals.items", this.goals);
      }
      return;
    }

    await this.prisma.goal.update({
      where: { id: goal.id },
      data: {
        title: goal.title,
        description: goal.description,
        goalType: goal.goalType,
        lifeArea: goal.lifeArea,
        priority: goal.priority,
        status: goal.status,
        progressPercent: goal.progressPercent,
        dueDate: goal.dueDate ? new Date(goal.dueDate) : null,
        updatedAt: new Date(goal.updatedAt)
      }
    });
  }

  private async createGoalRecord(goal: GoalRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("goals.items", this.goals);
      }
      return;
    }

    await this.prisma.goal.create({
      data: {
        id: goal.id,
        userId: LOCAL_USER_ID,
        title: goal.title,
        description: goal.description,
        goalType: goal.goalType,
        lifeArea: goal.lifeArea,
        priority: goal.priority,
        status: goal.status,
        progressPercent: goal.progressPercent,
        dueDate: goal.dueDate ? new Date(goal.dueDate) : null,
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt)
      }
    });
  }

  private async persistMilestone(goalId: string, milestone: GoalMilestone) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("goals.items", this.goals);
      }
      return;
    }

    await this.prisma.goalMilestone.upsert({
      where: { id: milestone.id },
      update: {
        title: milestone.title,
        status: milestone.status,
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
        completedAt: milestone.completedAt ? new Date(milestone.completedAt) : null
      },
      create: {
        id: milestone.id,
        goalId,
        title: milestone.title,
        status: milestone.status,
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
        completedAt: milestone.completedAt ? new Date(milestone.completedAt) : null
      }
    });
  }

  private async persistAchievement(achievement: AchievementRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("goals.achievements", this.achievements);
      }
      return;
    }

    await this.prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {
        title: achievement.title,
        achievedAt: new Date(achievement.achievedAt)
      },
      create: {
        id: achievement.id,
        userId: LOCAL_USER_ID,
        goalId: achievement.goalId,
        title: achievement.title,
        achievedAt: new Date(achievement.achievedAt)
      }
    });
  }

  private async persistReminder(reminder: GoalReminderRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("goals.reminders", this.reminders);
      }
      return;
    }

    await this.prisma.goalReminder.upsert({
      where: { id: reminder.id },
      update: {
        frequency: reminder.frequency,
        preferredTime: reminder.preferredTime,
        nextTriggerAt: reminder.nextTriggerAt ? new Date(reminder.nextTriggerAt) : null,
        isEnabled: reminder.isEnabled,
        updatedAt: new Date(reminder.updatedAt)
      },
      create: {
        id: reminder.id,
        goalId: reminder.goalId,
        frequency: reminder.frequency,
        preferredTime: reminder.preferredTime,
        nextTriggerAt: reminder.nextTriggerAt ? new Date(reminder.nextTriggerAt) : null,
        isEnabled: reminder.isEnabled,
        createdAt: new Date(reminder.createdAt),
        updatedAt: new Date(reminder.updatedAt)
      }
    });
  }

  private async removeGoalRecord(id: string) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await Promise.all([
          this.desktopState.saveSection("goals.items", this.goals),
          this.desktopState.saveSection("goals.achievements", this.achievements),
          this.desktopState.saveSection("goals.reminders", this.reminders)
        ]);
      }
      return;
    }

    await this.prisma.goal.delete({
      where: { id }
    });
  }

  private async persistStatsSnapshot(userId: string = LOCAL_USER_ID) {
    if (!this.prisma) {
      return;
    }

    const stats = await this.getStats(userId);
    await this.prisma.goalStatsSnapshot.create({
      data: {
        userId,
        activeGoalsCount: stats.active,
        completedGoalsCount: stats.completed,
        completionRate: stats.completionRate,
        averageProgress: stats.averageProgress
      }
    });
  }

  private mapGoalRecord(goal: {
    id: string;
    title: string;
    description: string;
    goalType: string;
    lifeArea: string;
    priority: string;
    status: string;
    progressPercent: number;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    milestones: Array<{
      id: string;
      title: string;
      status: string;
      dueDate: Date | null;
      completedAt: Date | null;
    }>;
  }): GoalRecord {
    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      goalType: goal.goalType,
      lifeArea: goal.lifeArea,
      priority: goal.priority,
      status: goal.status as GoalRecord["status"],
      progressPercent: goal.progressPercent,
      dueDate: goal.dueDate?.toISOString(),
      milestones: goal.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        status: milestone.status as GoalMilestone["status"],
        dueDate: milestone.dueDate?.toISOString(),
        completedAt: milestone.completedAt?.toISOString()
      })),
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString()
    };
  }

  private async listGoalRecordsForUser(userId: string) {
    if (!this.prisma || userId === LOCAL_USER_ID) {
      return this.goals;
    }

    const goals = await this.prisma.goal.findMany({
      where: { userId },
      include: { milestones: true },
      orderBy: { createdAt: "desc" }
    });

    return goals.map((goal) => this.mapGoalRecord(goal));
  }

  async listGoals(userId: string = LOCAL_USER_ID) {
    const items = await this.listGoalRecordsForUser(userId);
    return {
      items,
      stats: await this.getStats(userId)
    };
  }

  async getStats(userId: string = LOCAL_USER_ID) {
    const goals = await this.listGoalRecordsForUser(userId);
    const total = goals.length;
    const completed = goals.filter((goal) => goal.status === "achieved").length;
    const active = goals.filter((goal) => goal.status === "active").length;
    const averageProgress = total === 0 ? 0 : Math.round(goals.reduce((sum, goal) => sum + goal.progressPercent, 0) / total);

    return {
      total,
      active,
      completed,
      averageProgress,
      completionRate: total === 0 ? 0 : Number(((completed / total) * 100).toFixed(1))
    };
  }

  async getAchievements(userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const achievements = await this.prisma.achievement.findMany({
        where: { userId },
        orderBy: { achievedAt: "desc" }
      });

      return achievements.map((achievement) => ({
        id: achievement.id,
        goalId: achievement.goalId,
        title: achievement.title,
        achievedAt: achievement.achievedAt.toISOString()
      }));
    }

    return this.achievements;
  }

  async getGoal(id: string, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const goal = await this.prisma.goal.findFirst({
        where: { id, userId },
        include: { milestones: true }
      });

      if (!goal) {
        throw new NotFoundException("Ziel nicht gefunden.");
      }

      return this.mapGoalRecord(goal);
    }

    const goal = this.goals.find((item) => item.id === id);
    if (!goal) {
      throw new NotFoundException("Ziel nicht gefunden.");
    }

    return goal;
  }

  async createGoal(dto: CreateGoalDto, userId: string = LOCAL_USER_ID) {
    const now = new Date().toISOString();
    const goal: GoalRecord = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      goalType: dto.goalType ?? "personal",
      lifeArea: dto.lifeArea,
      priority: dto.priority ?? "medium",
      status: dto.status ?? "open",
      progressPercent: dto.progressPercent ?? 0,
      dueDate: dto.dueDate,
      milestones: [],
      createdAt: now,
      updatedAt: now
    };

    if (!this.prisma || userId === LOCAL_USER_ID) {
      this.goals.unshift(goal);
      await this.createGoalRecord(goal);
      if (!this.prisma && this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("goals.items", this.goals);
      }
    } else {
      await this.prisma.goal.create({
        data: {
          id: goal.id,
          userId,
          title: goal.title,
          description: goal.description,
          goalType: goal.goalType,
          lifeArea: goal.lifeArea,
          priority: goal.priority,
          status: goal.status,
          progressPercent: goal.progressPercent,
          dueDate: goal.dueDate ? new Date(goal.dueDate) : null,
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt)
        }
      });
    }
    await this.persistStatsSnapshot(userId);
    await this.auditService.record({
      category: "goals",
      action: "goal.created",
      resource: goal.id,
      actorType: "user",
      actorId: userId,
      detail: `Das Ziel "${goal.title}" wurde angelegt.`
    });
    return goal;
  }

  async updateGoal(id: string, dto: UpdateGoalDto, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const current = await this.prisma.goal.findFirst({
        where: { id, userId },
        include: { milestones: true }
      });

      if (!current) {
        throw new NotFoundException("Ziel nicht gefunden.");
      }

      const previousStatus = current.status;
      const updatedAt = new Date();
      const updatedGoal = await this.prisma.goal.update({
        where: { id: current.id },
        data: {
          title: dto.title ?? current.title,
          description: dto.description ?? current.description,
          goalType: dto.goalType ?? current.goalType,
          lifeArea: dto.lifeArea ?? current.lifeArea,
          priority: dto.priority ?? current.priority,
          status: dto.status ?? current.status,
          progressPercent: dto.progressPercent ?? current.progressPercent,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : current.dueDate,
          updatedAt
        },
        include: { milestones: true }
      });

      if ((dto.status ?? current.status) === "achieved" && previousStatus !== "achieved") {
        await this.prisma.achievement.create({
          data: {
            id: randomUUID(),
            userId,
            goalId: updatedGoal.id,
            title: updatedGoal.title,
            achievedAt: updatedAt
          }
        });
      }

      await this.auditService.record({
        category: "goals",
        action: "goal.updated",
        resource: updatedGoal.id,
        actorType: "user",
        actorId: userId,
        detail: `Das Ziel "${updatedGoal.title}" wurde aktualisiert.`
      });

      return this.mapGoalRecord(updatedGoal);
    }

    const goal = await this.getGoal(id, userId);
    const previousStatus = goal.status;
    Object.assign(goal, dto, { updatedAt: new Date().toISOString() });

    if (dto.status === "achieved" && previousStatus !== "achieved") {
      const achievement: AchievementRecord = {
        id: randomUUID(),
        goalId: goal.id,
        title: goal.title,
        achievedAt: new Date().toISOString()
      };

      this.achievements.unshift(achievement);
      await this.persistAchievement(achievement);
    }

    await this.persistGoal(goal);
    if (!this.prisma && this.desktopState?.isEnabled()) {
      await Promise.all([
        this.desktopState.saveSection("goals.items", this.goals),
        this.desktopState.saveSection("goals.achievements", this.achievements)
      ]);
    }
    await this.persistStatsSnapshot(userId);
    await this.auditService.record({
      category: "goals",
      action: "goal.updated",
      resource: goal.id,
      actorType: "user",
      actorId: userId,
      detail: `Das Ziel "${goal.title}" wurde aktualisiert.`
    });
    return goal;
  }

  async removeGoal(id: string, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const current = await this.prisma.goal.findFirst({
        where: { id, userId }
      });

      if (!current) {
        throw new NotFoundException("Ziel nicht gefunden.");
      }

      await this.prisma.goal.delete({
        where: { id: current.id }
      });
      await this.auditService.record({
        category: "goals",
        action: "goal.removed",
        resource: current.id,
        actorType: "user",
        actorId: userId,
        detail: `Das Ziel "${current.title}" wurde entfernt.`
      });
      return {
        id: current.id,
        title: current.title,
        description: current.description,
        goalType: current.goalType,
        lifeArea: current.lifeArea,
        priority: current.priority,
        status: current.status as GoalRecord["status"],
        progressPercent: current.progressPercent,
        dueDate: current.dueDate?.toISOString(),
        milestones: [],
        createdAt: current.createdAt.toISOString(),
        updatedAt: current.updatedAt.toISOString()
      };
    }

    const index = this.goals.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException("Ziel nicht gefunden.");
    }

    const [removed] = this.goals.splice(index, 1);
    this.achievements = this.achievements.filter((achievement) => achievement.goalId !== removed.id);
    this.reminders = this.reminders.filter((reminder) => reminder.goalId !== removed.id);
    await this.removeGoalRecord(id);
    await this.persistStatsSnapshot(userId);
    await this.auditService.record({
      category: "goals",
      action: "goal.removed",
      resource: removed.id,
      actorType: "user",
      actorId: userId,
      detail: `Das Ziel "${removed.title}" wurde entfernt.`
    });
    return removed;
  }

  async addMilestone(goalId: string, dto: CreateGoalMilestoneDto, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const goal = await this.prisma.goal.findFirst({
        where: { id: goalId, userId }
      });

      if (!goal) {
        throw new NotFoundException("Ziel nicht gefunden.");
      }

      const milestoneId = randomUUID();
      await this.prisma.goalMilestone.create({
        data: {
          id: milestoneId,
          goalId: goal.id,
          title: dto.title,
          status: "pending",
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null
        }
      });
      await this.prisma.goal.update({
        where: { id: goal.id },
        data: { updatedAt: new Date() }
      });
      await this.auditService.record({
        category: "goals",
        action: "milestone.created",
        resource: milestoneId,
        actorType: "user",
        actorId: userId,
        detail: `Der Meilenstein "${dto.title}" wurde dem Ziel "${goal.title}" hinzugefuegt.`
      });

      return {
        id: milestoneId,
        title: dto.title,
        status: "pending" as const,
        dueDate: dto.dueDate
      };
    }

    const goal = await this.getGoal(goalId, userId);
    const milestone: GoalMilestone = {
      id: randomUUID(),
      title: dto.title,
      status: "pending",
      dueDate: dto.dueDate
    };

    goal.milestones.push(milestone);
    goal.updatedAt = new Date().toISOString();
    await this.persistMilestone(goalId, milestone);
    await this.persistGoal(goal);
    if (!this.prisma && this.desktopState?.isEnabled()) {
      await this.desktopState.saveSection("goals.items", this.goals);
    }
    await this.auditService.record({
      category: "goals",
      action: "milestone.created",
      resource: milestone.id,
      actorType: "user",
      actorId: userId,
      detail: `Der Meilenstein "${milestone.title}" wurde dem Ziel "${goal.title}" hinzugefuegt.`
    });
    return milestone;
  }

  async updateMilestone(goalId: string, milestoneId: string, dto: UpdateGoalMilestoneDto, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const goal = await this.prisma.goal.findFirst({
        where: { id: goalId, userId }
      });

      if (!goal) {
        throw new NotFoundException("Ziel nicht gefunden.");
      }

      const milestone = await this.prisma.goalMilestone.findFirst({
        where: { id: milestoneId, goalId: goal.id }
      });

      if (!milestone) {
        throw new NotFoundException("Ziel-Meilenstein nicht gefunden.");
      }

      const completedAt = dto.status === "completed" ? new Date() : milestone.completedAt;
      const updated = await this.prisma.goalMilestone.update({
        where: { id: milestone.id },
        data: {
          title: dto.title ?? milestone.title,
          status: dto.status ?? milestone.status,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : milestone.dueDate,
          completedAt
        }
      });
      await this.prisma.goal.update({
        where: { id: goal.id },
        data: { updatedAt: new Date() }
      });
      await this.auditService.record({
        category: "goals",
        action: "milestone.updated",
        resource: updated.id,
        actorType: "user",
        actorId: userId,
        detail: `Der Meilenstein "${updated.title}" des Ziels "${goal.title}" wurde aktualisiert.`
      });

      return {
        id: updated.id,
        title: updated.title,
        status: updated.status as GoalMilestone["status"],
        dueDate: updated.dueDate?.toISOString(),
        completedAt: updated.completedAt?.toISOString()
      };
    }

    const goal = await this.getGoal(goalId, userId);
    const milestone = goal.milestones.find((item) => item.id === milestoneId);
    if (!milestone) {
      throw new NotFoundException("Ziel-Meilenstein nicht gefunden.");
    }

    Object.assign(milestone, dto);
    if (dto.status === "completed") {
      milestone.completedAt = new Date().toISOString();
    }

    goal.updatedAt = new Date().toISOString();
    await this.persistMilestone(goalId, milestone);
    await this.persistGoal(goal);
    if (!this.prisma && this.desktopState?.isEnabled()) {
      await this.desktopState.saveSection("goals.items", this.goals);
    }
    await this.auditService.record({
      category: "goals",
      action: "milestone.updated",
      resource: milestone.id,
      actorType: "user",
      actorId: userId,
      detail: `Der Meilenstein "${milestone.title}" des Ziels "${goal.title}" wurde aktualisiert.`
    });
    return milestone;
  }
}
