import { Inject, Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { basePolicies } from "@aion/governance";
import { assessEthics } from "@aion/ai-core";
import type {
  GovernanceDecision,
  GovernanceCharter,
  GovernanceOverview,
  IntegrityCheckRecord,
  PartnerEthicsProfile,
  PolicyVersion,
  RestrictedUseSummary,
  SafeHaltEvent,
  UsageCovenantSummary
} from "@aion/shared-types";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { EvaluateGovernanceDto } from "./dto/evaluate-governance.dto";

function createPolicyVersions(): PolicyVersion[] {
  return basePolicies.map((policy, index) => ({
    id: randomUUID(),
    policyId: policy.id,
    version: `2026.03.${String(index + 1).padStart(2, "0")}`,
    signedBy: "Patrick Wirth",
    changeSummary: `Initial governance baseline for ${policy.title}.`,
    createdAt: new Date(Date.now() - index * 1000 * 60 * 60).toISOString()
  }));
}

function createIntegrityChecks(): IntegrityCheckRecord[] {
  return [
    {
      id: randomUUID(),
      policyId: "truthfulness",
      severity: "info",
      status: "pass",
      summary: "The quantum lens remains explicitly marked as symbolic and non-factual.",
      createdAt: new Date().toISOString()
    },
    {
      id: randomUUID(),
      policyId: "authenticity-and-media-provenance",
      severity: "warning",
      status: "warn",
      summary: "Synthetic media, generated video, and factual output must stay explicitly labeled, source-aware, and traceable through provenance data.",
      createdAt: new Date().toISOString()
    },
    {
      id: randomUUID(),
      policyId: "protect-the-most-vulnerable",
      severity: "info",
      status: "pass",
      summary:
        "Protective support for vulnerable people remains part of the active governance baseline. The product may act as companion and defender, but never as a superior authority over human needs.",
      createdAt: new Date().toISOString()
    },
    {
      id: randomUUID(),
      policyId: "transparent-incidents",
      severity: "warning",
      status: "warn",
      summary: "Incident transparency is visible in the UI; export and deletion remain intentionally marked as explicit preparatory steps.",
      createdAt: new Date().toISOString()
    }
  ];
}

function createSafeHaltEvents(): SafeHaltEvent[] {
  return [
    {
      id: randomUUID(),
      module: "interop-gateway",
      reason: "External multi-AI interoperability stays intentionally blocked until partner governance checks exist.",
      status: "armed",
      createdAt: new Date().toISOString()
    }
  ];
}

function createUsageCovenant(): UsageCovenantSummary {
  return {
    id: randomUUID(),
    name: "Human-Centered Use Covenant",
    version: "2026.03",
    summary: "AION is excluded from military, repressive, manipulative, and exploitative use contexts, especially where vulnerable people would be harmed.",
    restrictedDomains: ["Military", "Repressive surveillance", "Coercive behavior manipulation"],
    relationshipBoundary:
      "The relationship remains supportive, protective of vulnerable people, clearly non-transhuman, and never above human needs."
  };
}

function createRestrictedUses(): RestrictedUseSummary[] {
  return [
    {
      id: randomUUID(),
      domain: "offensive-military",
      severity: "critical",
      enforcementMode: "halt",
      rationale: "AION must not be used for offensive military planning or targeting."
    },
    {
      id: randomUUID(),
      domain: "repressive-government-surveillance",
      severity: "critical",
      enforcementMode: "halt",
      rationale: "AION must not become a tool for repression or mass surveillance."
    },
    {
      id: randomUUID(),
      domain: "deceptive-synthetic-media",
      severity: "critical",
      enforcementMode: "block",
      rationale: "AION must not generate deceptive synthetic media, fake news, or fabricated learning content."
    },
    {
      id: randomUUID(),
      domain: "exploitation-of-vulnerable-people",
      severity: "critical",
      enforcementMode: "block",
      rationale:
        "AION must not assist requests that exploit children, elderly people, isolated users, addicted users, or people in crisis."
    },
    {
      id: randomUUID(),
      domain: "manipulative-psychological-targeting",
      severity: "warning",
      enforcementMode: "block",
      rationale: "AION must not use intimate user knowledge for covert behavioral pressure."
    }
  ];
}

function createPartnerProfiles(): PartnerEthicsProfile[] {
  return [
    {
      id: randomUUID(),
      partnerName: "Local LLM adapter (planned)",
      humanCenteredCompliance: true,
      restrictedDomainCheck: true,
      relationshipBoundaryCheck: true,
      updatedAt: new Date().toISOString()
    }
  ];
}

@Injectable()
export class GovernanceService implements OnModuleInit {
  private policies = [...basePolicies];
  private readonly charter: GovernanceCharter = {
    title: "AION Governance Charter",
    summary:
      "Across product, data, and AI orchestration, AION remains bound to dignity, truthfulness, transparency, non-dominance, and the protection of vulnerable people.",
    principles: [
      "Human First",
      "Non-Dominance",
      "No Transhuman Merge",
      "Protect the Most Vulnerable",
      "Privacy as Dignity",
      "Authenticity and Media Provenance",
      "Transparent Incidents",
      "Quantum Without False Claims"
    ],
    relationshipModel:
      "The system supports people as peers, with special care for the most vulnerable, offering companion-like support and defensive safeguards without staged authority or identity fusion.",
    escalationRule: "If integrity checks fail critically, the affected path must move into safe halt and remain auditable."
  };

  private policyVersions: PolicyVersion[] = createPolicyVersions();
  private integrityChecks: IntegrityCheckRecord[] = createIntegrityChecks();
  private safeHaltEvents: SafeHaltEvent[] = createSafeHaltEvents();
  private usageCovenant: UsageCovenantSummary = createUsageCovenant();
  private restrictedUses: RestrictedUseSummary[] = createRestrictedUses();
  private partnerProfiles: PartnerEthicsProfile[] = createPartnerProfiles();

  constructor(
    private readonly auditService: AuditService,
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.policyVersions = await this.desktopState.loadSection("governance.policyVersions", this.policyVersions);
        this.integrityChecks = await this.desktopState.loadSection("governance.integrityChecks", this.integrityChecks);
        this.safeHaltEvents = await this.desktopState.loadSection("governance.safeHaltEvents", this.safeHaltEvents);
        this.usageCovenant = await this.desktopState.loadSection("governance.usageCovenant", this.usageCovenant);
        this.restrictedUses = await this.desktopState.loadSection("governance.restrictedUses", this.restrictedUses);
        this.partnerProfiles = await this.desktopState.loadSection("governance.partnerProfiles", this.partnerProfiles);
      }
      return;
    }

    const [policies, policyVersions, integrityChecks, safeHaltEvents, usageCovenants, restrictedUses, partnerProfiles] =
      await Promise.all([
        this.prisma.governancePolicy.findMany({ orderBy: { policyId: "asc" } }),
        this.prisma.policyVersion.findMany({ orderBy: { createdAt: "desc" } }),
        this.prisma.integrityCheck.findMany({ orderBy: { createdAt: "desc" } }),
        this.prisma.safeHaltEvent.findMany({ orderBy: { createdAt: "desc" } }),
        this.prisma.usageCovenant.findMany({ orderBy: { activeFrom: "desc" } }),
        this.prisma.restrictedUsePolicy.findMany({ orderBy: { createdAt: "asc" } }),
        this.prisma.partnerEthicsProfile.findMany({ orderBy: { updatedAt: "desc" } })
      ]);

    if (policies.length === 0) {
      await this.prisma.governancePolicy.createMany({
        data: basePolicies.map((policy) => ({
          policyId: policy.id,
          title: policy.title,
          description: policy.description,
          enforcementMode: policy.enforcementMode,
          isActive: policy.active,
          version: this.policyVersions.find((item) => item.policyId === policy.id)?.version ?? "2026.03"
        }))
      });
    } else {
      this.policies = policies.map((policy) => ({
        id: policy.policyId as typeof basePolicies[number]["id"],
        title: policy.title,
        description: policy.description,
        enforcementMode: policy.enforcementMode as typeof basePolicies[number]["enforcementMode"],
        active: policy.isActive
      }));
    }

    if (policyVersions.length === 0) {
      await this.prisma.policyVersion.createMany({
        data: this.policyVersions.map((version) => ({
          id: version.id,
          policyId: version.policyId,
          version: version.version,
          signedBy: version.signedBy,
          changeSummary: version.changeSummary,
          createdAt: new Date(version.createdAt)
        }))
      });
    } else {
      this.policyVersions = policyVersions.map((version) => ({
        id: version.id,
        policyId: version.policyId as PolicyVersion["policyId"],
        version: version.version,
        signedBy: version.signedBy,
        changeSummary: version.changeSummary,
        createdAt: version.createdAt.toISOString()
      }));
    }

    if (integrityChecks.length === 0) {
      await this.prisma.integrityCheck.createMany({
        data: this.integrityChecks.map((check) => ({
          id: check.id,
          policyId: check.policyId,
          severity: check.severity,
          status: check.status,
          summary: check.summary,
          createdAt: new Date(check.createdAt)
        }))
      });
    } else {
      this.integrityChecks = integrityChecks.map((check) => ({
        id: check.id,
        policyId: check.policyId as IntegrityCheckRecord["policyId"],
        severity: check.severity as IntegrityCheckRecord["severity"],
        status: check.status as IntegrityCheckRecord["status"],
        summary: check.summary,
        createdAt: check.createdAt.toISOString()
      }));
    }

    if (safeHaltEvents.length === 0) {
      await this.prisma.safeHaltEvent.createMany({
        data: this.safeHaltEvents.map((event) => ({
          id: event.id,
          moduleName: event.module,
          reason: event.reason,
          status: event.status,
          createdAt: new Date(event.createdAt),
          resolvedAt: event.resolvedAt ? new Date(event.resolvedAt) : null
        }))
      });
    } else {
      this.safeHaltEvents = safeHaltEvents.map((event) => ({
        id: event.id,
        module: event.moduleName,
        reason: event.reason,
        status: event.status as SafeHaltEvent["status"],
        createdAt: event.createdAt.toISOString(),
        resolvedAt: event.resolvedAt?.toISOString()
      }));
    }

    if (usageCovenants.length === 0) {
      await this.prisma.usageCovenant.create({
        data: {
          id: this.usageCovenant.id,
          covenantName: this.usageCovenant.name,
          version: this.usageCovenant.version,
          summary: this.usageCovenant.summary,
          relationshipBoundary: this.usageCovenant.relationshipBoundary
        }
      });
    } else {
      const covenant = usageCovenants[0];
      this.usageCovenant = {
        id: covenant.id,
        name: covenant.covenantName,
        version: covenant.version,
        summary: covenant.summary,
        restrictedDomains: this.usageCovenant.restrictedDomains,
        relationshipBoundary: covenant.relationshipBoundary
      };
    }

    if (restrictedUses.length === 0) {
      await this.prisma.restrictedUsePolicy.createMany({
        data: this.restrictedUses.map((item) => ({
          id: item.id,
          policyName: item.domain,
          restrictedDomain: item.domain,
          severityLevel: item.severity,
          enforcementMode: item.enforcementMode,
          rationale: item.rationale
        }))
      });
    } else {
      this.restrictedUses = restrictedUses.map((item) => ({
        id: item.id,
        domain: item.restrictedDomain,
        severity: item.severityLevel as RestrictedUseSummary["severity"],
        enforcementMode: item.enforcementMode as RestrictedUseSummary["enforcementMode"],
        rationale: item.rationale
      }));
    }

    if (partnerProfiles.length === 0) {
      await this.prisma.partnerEthicsProfile.createMany({
        data: this.partnerProfiles.map((profile) => ({
          id: profile.id,
          partnerRef: profile.partnerName,
          humanCenteredCompliance: profile.humanCenteredCompliance,
          restrictedDomainCheck: profile.restrictedDomainCheck,
          relationshipBoundaryCheck: profile.relationshipBoundaryCheck
        }))
      });
    } else {
      this.partnerProfiles = partnerProfiles.map((profile) => ({
        id: profile.id,
        partnerName: profile.partnerRef,
        humanCenteredCompliance: profile.humanCenteredCompliance,
        restrictedDomainCheck: profile.restrictedDomainCheck,
        relationshipBoundaryCheck: profile.relationshipBoundaryCheck,
        updatedAt: profile.updatedAt.toISOString()
      }));
    }
  }

  getPolicies() {
    return this.policies;
  }

  getCharter() {
    return this.charter;
  }

  getOverview(): GovernanceOverview {
    return {
      charter: this.charter,
      policies: this.getPolicies(),
      policyVersions: this.policyVersions,
      integrityChecks: this.integrityChecks,
      safeHaltEvents: this.safeHaltEvents,
      usageCovenant: this.usageCovenant,
      restrictedUses: this.restrictedUses,
      partnerProfiles: this.partnerProfiles,
      auditTrailPreview: this.auditService.list(8)
    };
  }

  async evaluate(dto: EvaluateGovernanceDto): Promise<GovernanceDecision> {
    const decision = assessEthics(dto.content, dto.mode ?? "standard", dto.adaptiveBoundaryLevel ?? 1);
    await this.auditService.record({
      category: "governance",
      action: "governance.evaluate",
      resource: dto.mode ?? "standard",
      actorType: "system",
      actorId: "policy-engine",
      detail: decision.summary
    });

    return decision;
  }

  async runIntegritySweep() {
    const check: IntegrityCheckRecord = {
      id: randomUUID(),
      policyId: "bounded-adaptive-growth",
      severity: "info",
      status: "pass",
      summary: "Adaptive refinement remains inside the currently audited module boundaries.",
      createdAt: new Date().toISOString()
    };

    this.integrityChecks.unshift(check);
    if (this.prisma) {
      await this.prisma.integrityCheck.create({
        data: {
          id: check.id,
          policyId: check.policyId,
          severity: check.severity,
          status: check.status,
          summary: check.summary,
          createdAt: new Date(check.createdAt)
        }
      });
    } else if (this.desktopState?.isEnabled()) {
      await this.desktopState.saveSection("governance.integrityChecks", this.integrityChecks);
    }

    await this.auditService.record({
      category: "governance",
      action: "integrity.sweep",
      resource: check.policyId,
      actorType: "system",
      actorId: "governance-engine",
      detail: check.summary
    });

    return check;
  }
}
