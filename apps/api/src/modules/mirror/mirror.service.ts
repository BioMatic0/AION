import { ForbiddenException, Inject, Injectable, NotFoundException, OnModuleInit, Optional } from "@nestjs/common";
import { assessEthics, buildMirrorReport, requiresGovernanceBlock } from "@aion/ai-core";
import type { MirrorReport } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
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
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.reports = await this.desktopState.loadSection("mirror.reports", this.reports);
      }
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
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("mirror.reports", this.reports);
      }
      return;
    }

    await this.prisma.analysis.upsert({
      where: { id: report.id },
      update: serializeAnalysisRecord(report, LOCAL_USER_ID, "mirror"),
      create: serializeAnalysisRecord(report, LOCAL_USER_ID, "mirror")
    });
  }

  async listReports(userId: string = LOCAL_USER_ID) {
    if (!this.prisma || userId === LOCAL_USER_ID) {
      return this.reports;
    }

    const records = await this.prisma.analysis.findMany({
      where: { userId, reportType: "mirror" },
      orderBy: { generatedAt: "desc" }
    });

    return records.map((record) => hydrateAnalysisRecord(record) as MirrorReport);
  }

  async getReport(id: string, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const record = await this.prisma.analysis.findFirst({
        where: { id, userId, reportType: "mirror" }
      });

      if (!record) {
        throw new NotFoundException("Spiegelbericht nicht gefunden.");
      }

      return hydrateAnalysisRecord(record) as MirrorReport;
    }

    const report = this.reports.find((item) => item.id === id);
    if (!report) {
      throw new NotFoundException("Spiegelbericht nicht gefunden.");
    }

    return report;
  }

  async runMirror(dto: MirrorInputDto, userId: string = LOCAL_USER_ID) {
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
    if (!this.prisma || userId === LOCAL_USER_ID) {
      this.reports.unshift(report);
      await this.persistReport(report);
    } else {
      await this.prisma.analysis.create({
        data: serializeAnalysisRecord(report, userId, "mirror")
      });
    }
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
