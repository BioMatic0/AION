import { ForbiddenException, Injectable, NotFoundException, OnModuleInit, Optional } from "@nestjs/common";
import { assessEthics, buildMirrorReport, requiresGovernanceBlock } from "@aion/ai-core";
import type { MirrorReport } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { hydrateAnalysisRecord, serializeAnalysisRecord } from "../analysis/analysis-record";
import { MirrorInputDto } from "./dto/mirror-input.dto";

@Injectable()
export class MirrorService implements OnModuleInit {
  private reports: MirrorReport[] = [
    buildMirrorReport({
      title: "Spiegel-Start",
      content: "Auch eine starke Vision kann abdriften, wenn der Umfang weiter waechst, bevor der aktuelle Bereich verankert ist.",
      context: ["mvp", "disziplin"]
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
        reportType: "mirror"
      },
      orderBy: { generatedAt: "desc" }
    });

    if (records.length === 0) {
      await this.prisma.analysis.createMany({
        data: this.reports.map((report) => serializeAnalysisRecord(report, LOCAL_USER_ID, "mirror"))
      });
      return;
    }

    this.reports = records.map((record) => hydrateAnalysisRecord(record) as MirrorReport);
  }

  private async persistReport(report: MirrorReport) {
    if (!this.prisma) {
      return;
    }

    await this.prisma.analysis.upsert({
      where: { id: report.id },
      update: serializeAnalysisRecord(report, LOCAL_USER_ID, "mirror"),
      create: serializeAnalysisRecord(report, LOCAL_USER_ID, "mirror")
    });
  }

  listReports() {
    return this.reports;
  }

  getReport(id: string) {
    const report = this.reports.find((item) => item.id === id);
    if (!report) {
      throw new NotFoundException("Spiegelbericht nicht gefunden.");
    }

    return report;
  }

  async runMirror(dto: MirrorInputDto) {
    const decision = assessEthics(dto.content, "mirror");
    if (requiresGovernanceBlock(decision)) {
      await this.auditService.record({
        category: "governance",
        action: "mirror.blocked",
        resource: "mirror",
        actorType: "system",
        actorId: "policy-engine",
        detail: decision.summary
      });
      throw new ForbiddenException(decision.summary);
    }

    const report = buildMirrorReport(dto);
    this.reports.unshift(report);
    await this.persistReport(report);
    await this.auditService.record({
      category: "governance",
      action: "mirror.generated",
      resource: report.id,
      actorType: "system",
      actorId: "policy-engine",
      detail: report.governance?.summary ?? "Es wurden keine Governance-Hinweise ausgeloest."
    });
    return report;
  }
}
