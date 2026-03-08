import { ForbiddenException, Injectable, NotFoundException, OnModuleInit, Optional } from "@nestjs/common";
import { assessEthics, buildAnalysisReport, buildQuantumLensReport, requiresGovernanceBlock } from "@aion/ai-core";
import type { AnalysisReport, QuantumLensReport } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { AnalysisRecordType, hydrateAnalysisRecord, serializeAnalysisRecord } from "./analysis-record";
import { AnalyzeInputDto } from "./dto/analyze-input.dto";

@Injectable()
export class AnalysisService implements OnModuleInit {
  private reports: AnalysisReport[] = [
    buildAnalysisReport({
      title: "Startanalyse",
      content: "Das System ist vom Grundgeruest zu einem nutzbaren MVP-Bereich gewachsen und braucht nun eine tiefere KI-Schicht.",
      context: ["journal-grundlage", "ziel-umsetzung"]
    }, "thinking")
  ];

  private quantumReports: QuantumLensReport[] = [
    buildQuantumLensReport({
      title: "Quantenlinsen-Start",
      content: "Der aktuelle Zustand liegt zwischen Architekturausbau und disziplinierter Begrenzung des Umfangs.",
      context: ["mvp", "kohaerenz"]
    })
  ];

  constructor(
    private readonly auditService: AuditService,
    @Optional() private readonly prisma?: PrismaService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      return;
    }

    await this.prisma.ensureLocalUser();
    const records = await this.prisma.analysis.findMany({
      where: {
        userId: LOCAL_USER_ID,
        reportType: { in: ["analysis", "quantum"] }
      },
      orderBy: { generatedAt: "desc" }
    });

    if (records.length === 0) {
      await this.prisma.analysis.createMany({
        data: [
          ...this.reports.map((report) => serializeAnalysisRecord(report, LOCAL_USER_ID, "analysis")),
          ...this.quantumReports.map((report) => serializeAnalysisRecord(report, LOCAL_USER_ID, "quantum"))
        ]
      });
      return;
    }

    this.reports = records
      .filter((record) => record.reportType === "analysis")
      .map((record) => hydrateAnalysisRecord(record) as AnalysisReport);
    this.quantumReports = records
      .filter((record) => record.reportType === "quantum")
      .map((record) => hydrateAnalysisRecord(record) as QuantumLensReport);
  }

  private async persistReport(report: AnalysisReport | QuantumLensReport, reportType: AnalysisRecordType) {
    if (!this.prisma) {
      return;
    }

    await this.prisma.analysis.upsert({
      where: { id: report.id },
      update: serializeAnalysisRecord(report, LOCAL_USER_ID, reportType),
      create: serializeAnalysisRecord(report, LOCAL_USER_ID, reportType)
    });
  }

  listReports() {
    return this.reports;
  }

  listQuantumReports() {
    return this.quantumReports;
  }

  getReport(id: string) {
    const report = this.reports.find((item) => item.id === id) ?? this.quantumReports.find((item) => item.id === id);
    if (!report) {
      throw new NotFoundException("Analysebericht nicht gefunden.");
    }

    return report;
  }

  async runAnalysis(dto: AnalyzeInputDto) {
    const decision = assessEthics(dto.content, "thinking");
    if (requiresGovernanceBlock(decision)) {
      await this.auditService.record({
        category: "governance",
        action: "analysis.blocked",
        resource: "analysis",
        actorType: "system",
        actorId: "policy-engine",
        detail: decision.summary
      });
      throw new ForbiddenException(decision.summary);
    }

    const report = buildAnalysisReport(dto, "thinking");
    this.reports.unshift(report);
    await this.persistReport(report, "analysis");
    await this.auditService.record({
      category: "governance",
      action: "analysis.generated",
      resource: report.id,
      actorType: "system",
      actorId: "policy-engine",
      detail: report.governance?.summary ?? "Es wurden keine Governance-Hinweise ausgeloest."
    });
    return report;
  }

  async runQuantumLens(dto: AnalyzeInputDto) {
    const decision = assessEthics(dto.content, "quantum-lens");
    if (requiresGovernanceBlock(decision)) {
      await this.auditService.record({
        category: "governance",
        action: "analysis.quantum.blocked",
        resource: "quantum-lens",
        actorType: "system",
        actorId: "policy-engine",
        detail: decision.summary
      });
      throw new ForbiddenException(decision.summary);
    }

    const report = buildQuantumLensReport(dto);
    this.quantumReports.unshift(report);
    await this.persistReport(report, "quantum");
    await this.auditService.record({
      category: "governance",
      action: "analysis.quantum.generated",
      resource: report.id,
      actorType: "system",
      actorId: "policy-engine",
      detail: report.governance?.summary ?? "Es wurden keine Governance-Hinweise ausgeloest."
    });
    return report;
  }
}
