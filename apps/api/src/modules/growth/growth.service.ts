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
  ) {
    const initialState = this.computeState();
    this.history.unshift(initialState);
    this.interventions.unshift(buildGrowthIntervention(initialState));
  }

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.history = await this.desktopState.loadSection("growth.history", this.history);
        this.interventions = await this.desktopState.loadSection("growth.interventions", this.interventions);
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

    if (states.length === 0) {
      const initialState = this.history[0] ?? this.computeState();
      const initialIntervention = this.interventions[0] ?? buildGrowthIntervention(initialState);
      await this.persistState(initialState);
      await this.persistIntervention(initialIntervention, initialState.id);
      return;
    }

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

  private async persistState(state: GrowthState) {
    if (!this.prisma) {
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
        userId: LOCAL_USER_ID,
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

  private async persistIntervention(intervention: GrowthIntervention, stateId: string) {
    if (!this.prisma) {
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
        userId: LOCAL_USER_ID,
        stateId,
        title: intervention.title,
        rationale: intervention.rationale,
        action: intervention.action,
        tone: intervention.tone,
        createdAt: new Date(intervention.createdAt)
      }
    });
  }

  private collectReflections(extraReflection?: string) {
    const reflections = [
      ...this.journalService.listEntries().map((entry) => `${entry.title}. ${entry.content}`),
      ...this.diaryService.listEntries().map((entry) => `${entry.title}. ${entry.content}`)
    ];

    if (extraReflection) {
      reflections.unshift(extraReflection);
    }

    return reflections.slice(0, 8);
  }

  private deriveCompletionRate() {
    const stats = this.goalsService.getStats();
    return stats.completionRate;
  }

  private computeState(extraReflection?: string, forcedCompletionRate?: number) {
    return buildGrowthState(
      this.collectReflections(extraReflection),
      forcedCompletionRate ?? this.deriveCompletionRate()
    );
  }

  getState() {
    return this.history[0] ?? this.computeState();
  }

  getHistory() {
    return this.history;
  }

  getInterventions() {
    return this.interventions;
  }

  async evaluate(dto: GrowthEvaluationDto) {
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

    const state = this.computeState(dto.reflection, dto.completionRate);
    const intervention = buildGrowthIntervention(state, "mixed");

    this.history.unshift(state);
    this.interventions.unshift(intervention);
    await this.persistState(state);
    await this.persistIntervention(intervention, state.id);
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
      history: this.history.slice(0, 6)
    };
  }
}
