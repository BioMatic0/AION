import { ForbiddenException, Inject, Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { assessEthics, buildGrowthIntervention, buildGrowthState, requiresGovernanceBlock } from "@aion/ai-core";
import type { GrowthIntervention, GrowthState } from "@aion/shared-types";
import { AuditService } from "../audit/audit.service";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
import { DiaryService } from "../diary/diary.service";
import { GoalsService } from "../goals/goals.service";
import { JournalService } from "../journal/journal.service";
import { GrowthEvaluationDto } from "./dto/growth-evaluation.dto";

@Injectable()
export class GrowthService implements OnModuleInit {
  private history: GrowthState[] = [];
  private interventions: GrowthIntervention[] = [];

  constructor(
    private readonly journalService: JournalService,
    private readonly diaryService: DiaryService,
    private readonly goalsService: GoalsService,
    private readonly auditService: AuditService,
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.history = await this.desktopState.loadSection("growth.history", this.history);
        this.interventions = await this.desktopState.loadSection("growth.interventions", this.interventions);
      }

      if (this.history.length === 0) {
        const initialState = await this.computeState(LOCAL_USER_ID);
        this.history.unshift(initialState);
        this.interventions.unshift(buildGrowthIntervention(initialState));
      }
      return;
    }

    await this.prisma.ensureLocalUser();
    const [states, interventions] = await Promise.all([
      this.prisma.growthState.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { updatedAt: "desc" }
      }),
      this.prisma.growthIntervention.findMany({
        where: { userId: LOCAL_USER_ID },
        orderBy: { createdAt: "desc" }
      })
    ]);

    this.history = states.map((state) => ({
      id: state.id,
      currentStage: state.currentStage,
      focusArea: state.focusArea,
      momentumScore: state.momentumScore,
      coherenceScore: state.coherenceScore,
      strengths: Array.isArray(state.strengths) ? state.strengths.filter((item): item is string => typeof item === "string") : [],
      risks: Array.isArray(state.risks) ? state.risks.filter((item): item is string => typeof item === "string") : [],
      nextStep: state.nextStep,
      updatedAt: state.updatedAt.toISOString()
    }));

    this.interventions = interventions.map((intervention) => ({
      id: intervention.id,
      title: intervention.title,
      rationale: intervention.rationale,
      action: intervention.action,
      tone: intervention.tone as GrowthIntervention["tone"],
      createdAt: intervention.createdAt.toISOString()
    }));
  }

  private async collectReflections(userId: string, extraReflection?: string) {
    const [journalEntries, diaryEntries] = await Promise.all([
      this.journalService.listEntries(userId),
      this.diaryService.listEntries(userId)
    ]);

    const reflections = [
      ...journalEntries.map((entry) => `${entry.title}. ${entry.content}`),
      ...diaryEntries.map((entry) => `${entry.title}. ${entry.content}`)
    ];

    if (extraReflection) {
      reflections.unshift(extraReflection);
    }

    return reflections.slice(0, 8);
  }

  private async deriveCompletionRate(userId: string) {
    const stats = await this.goalsService.getStats(userId);
    return stats.completionRate;
  }

  private async computeState(userId: string, extraReflection?: string, forcedCompletionRate?: number) {
    return buildGrowthState(
      await this.collectReflections(userId, extraReflection),
      forcedCompletionRate ?? (await this.deriveCompletionRate(userId))
    );
  }

  private async persistState(state: GrowthState, userId: string) {
    if (!this.prisma || userId === LOCAL_USER_ID) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("growth.history", this.history);
      }
      return;
    }

    await this.prisma.growthState.upsert({
      where: { id: state.id },
      update: {
        currentStage: state.currentStage,
        focusArea: state.focusArea,
        momentumScore: state.momentumScore,
        coherenceScore: state.coherenceScore,
        strengths: state.strengths,
        risks: state.risks,
        nextStep: state.nextStep,
        updatedAt: new Date(state.updatedAt)
      },
      create: {
        id: state.id,
        userId,
        currentStage: state.currentStage,
        focusArea: state.focusArea,
        momentumScore: state.momentumScore,
        coherenceScore: state.coherenceScore,
        strengths: state.strengths,
        risks: state.risks,
        nextStep: state.nextStep,
        updatedAt: new Date(state.updatedAt)
      }
    });
  }

  private async persistIntervention(intervention: GrowthIntervention, stateId: string, userId: string) {
    if (!this.prisma || userId === LOCAL_USER_ID) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("growth.interventions", this.interventions);
      }
      return;
    }

    await this.prisma.growthIntervention.upsert({
      where: { id: intervention.id },
      update: {
        stateId,
        title: intervention.title,
        rationale: intervention.rationale,
        action: intervention.action,
        tone: intervention.tone,
        createdAt: new Date(intervention.createdAt)
      },
      create: {
        id: intervention.id,
        userId,
        stateId,
        title: intervention.title,
        rationale: intervention.rationale,
        action: intervention.action,
        tone: intervention.tone,
        createdAt: new Date(intervention.createdAt)
      }
    });
  }

  async getState(userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const state = await this.prisma.growthState.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" }
      });

      if (!state) {
        return this.computeState(userId);
      }

      return {
        id: state.id,
        currentStage: state.currentStage,
        focusArea: state.focusArea,
        momentumScore: state.momentumScore,
        coherenceScore: state.coherenceScore,
        strengths: Array.isArray(state.strengths) ? state.strengths.filter((item): item is string => typeof item === "string") : [],
        risks: Array.isArray(state.risks) ? state.risks.filter((item): item is string => typeof item === "string") : [],
        nextStep: state.nextStep,
        updatedAt: state.updatedAt.toISOString()
      };
    }

    return this.history[0] ?? (await this.computeState(userId));
  }

  async getHistory(userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const states = await this.prisma.growthState.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" }
      });

      return states.map((state) => ({
        id: state.id,
        currentStage: state.currentStage,
        focusArea: state.focusArea,
        momentumScore: state.momentumScore,
        coherenceScore: state.coherenceScore,
        strengths: Array.isArray(state.strengths) ? state.strengths.filter((item): item is string => typeof item === "string") : [],
        risks: Array.isArray(state.risks) ? state.risks.filter((item): item is string => typeof item === "string") : [],
        nextStep: state.nextStep,
        updatedAt: state.updatedAt.toISOString()
      }));
    }

    return this.history;
  }

  async getInterventions(userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const interventions = await this.prisma.growthIntervention.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });

      return interventions.map((intervention) => ({
        id: intervention.id,
        title: intervention.title,
        rationale: intervention.rationale,
        action: intervention.action,
        tone: intervention.tone as GrowthIntervention["tone"],
        createdAt: intervention.createdAt.toISOString()
      }));
    }

    return this.interventions;
  }

  async evaluate(dto: GrowthEvaluationDto, userId: string = LOCAL_USER_ID) {
    const reflection = dto.reflection ?? "";
    const decision = assessEthics(reflection, "growth");
    if (requiresGovernanceBlock(decision)) {
      await this.auditService.record({
        category: "governance",
        action: "growth.blocked",
        resource: "growth",
        actorType: "system",
        actorId: "policy-engine",
        detail: decision.summary
      });
      throw new ForbiddenException(decision.summary);
    }

    const state = await this.computeState(userId, dto.reflection, dto.completionRate);
    const intervention = buildGrowthIntervention(state, "mixed");

    if (!this.prisma || userId === LOCAL_USER_ID) {
      this.history.unshift(state);
      this.interventions.unshift(intervention);
    }

    await this.persistState(state, userId);
    await this.persistIntervention(intervention, state.id, userId);
    await this.auditService.record({
      category: "governance",
      action: "growth.evaluated",
      resource: state.id,
      actorType: "system",
      actorId: "policy-engine",
      detail: decision.summary
    });

    return {
      state,
      intervention,
      history: (await this.getHistory(userId)).slice(0, 6)
    };
  }
}
