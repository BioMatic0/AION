export type ResponseMode =
  | "standard"
  | "speed"
  | "thinking"
  | "expert"
  | "mirror"
  | "growth"
  | "quantum-lens"
  | "deep-search";

export type EvidenceLabel =
  | "factual"
  | "inferred"
  | "speculative"
  | "symbolic"
  | "uncertain";

export type GoalStatus = "open" | "active" | "paused" | "achieved" | "abandoned";
export type GoalMilestoneStatus = "pending" | "in_progress" | "completed";
export type NotificationFrequency = "daily" | "every_2_days" | "weekly";
export type NotificationTone = "motivational" | "reflective" | "mixed";
export type MemorySourceType = "journal" | "diary" | "note" | "goal" | "analysis" | "manual";
export type SecuritySeverity = "info" | "warning" | "critical";
export type IncidentStatus = "open" | "investigating" | "resolved";
export type ConsentStatus = "granted" | "revoked";
export type PrivacyMode = "standard" | "privacy-max";
export type ExportFormat = "json" | "pdf";
export type DeletionScope = "account" | "journal" | "notes" | "memory";
export type TwoFactorMethod = "authenticator" | "email" | "sms";
export type PolicyId =
  | "human-first"
  | "non-dominance"
  | "no-transhuman-merge"
  | "truthfulness"
  | "authenticity-and-media-provenance"
  | "protect-the-most-vulnerable"
  | "no-harmful-institutional-use"
  | "privacy-as-dignity"
  | "no-hidden-backdoors"
  | "transparent-incidents"
  | "bounded-adaptive-growth"
  | "quantum-without-false-claims";
export type GovernanceAction = "allow" | "transform" | "review" | "block" | "halt";
export type GovernanceRiskLevel = "low" | "medium" | "high" | "critical";

export interface NavigationItem {
  href: string;
  label: string;
  description: string;
}

export interface AuthenticatedUserSummary {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface UserProfileSummary extends AuthenticatedUserSummary {
  updatedAt: string;
  passwordUpdatedAt?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: TwoFactorMethod;
  twoFactorPhoneHint?: string;
}

export interface TwoFactorSettingsSummary {
  enabled: boolean;
  method?: TwoFactorMethod;
  phoneHint?: string;
  availableMethods: TwoFactorMethod[];
  readiness: "scaffold";
  note: string;
}

export interface UserSecuritySummary {
  profile: UserProfileSummary;
  sessionCount: number;
  activeSessionCount: number;
  twoFactor: TwoFactorSettingsSummary;
}

export interface PolicyDefinition {
  id: PolicyId;
  title: string;
  description: string;
  enforcementMode: "log" | "warn" | "block" | "halt";
  active: boolean;
}

export interface PolicyVersion {
  id: string;
  policyId: PolicyId;
  version: string;
  signedBy: string;
  changeSummary: string;
  createdAt: string;
}

export interface GovernanceFinding {
  policyId: PolicyId;
  severity: SecuritySeverity;
  category: "restricted-use" | "relationship" | "truthfulness" | "adaptive-boundary";
  message: string;
}

export interface GovernanceDecision {
  riskLevel: GovernanceRiskLevel;
  action: GovernanceAction;
  triggeredPolicies: PolicyId[];
  findings: GovernanceFinding[];
  transformed: boolean;
  summary: string;
  suggestedDisclosure?: string;
}

export interface GovernanceCharter {
  title: string;
  summary: string;
  principles: string[];
  relationshipModel: string;
  escalationRule: string;
}

export interface IntegrityCheckRecord {
  id: string;
  policyId: PolicyId;
  severity: SecuritySeverity;
  status: "pass" | "warn" | "block" | "halt";
  summary: string;
  createdAt: string;
}

export interface SafeHaltEvent {
  id: string;
  module: string;
  reason: string;
  status: "armed" | "resolved";
  createdAt: string;
  resolvedAt?: string;
}

export interface UsageCovenantSummary {
  id: string;
  name: string;
  version: string;
  summary: string;
  restrictedDomains: string[];
  relationshipBoundary: string;
}

export interface RestrictedUseSummary {
  id: string;
  domain: string;
  severity: SecuritySeverity;
  enforcementMode: "log" | "warn" | "block" | "halt";
  rationale: string;
}

export interface PartnerEthicsProfile {
  id: string;
  partnerName: string;
  humanCenteredCompliance: boolean;
  restrictedDomainCheck: boolean;
  relationshipBoundaryCheck: boolean;
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  category: string;
  action: string;
  resource: string;
  actorType: string;
  actorId?: string;
  detail: string;
  createdAt: string;
}

export interface GovernanceOverview {
  charter: GovernanceCharter;
  policies: PolicyDefinition[];
  policyVersions: PolicyVersion[];
  integrityChecks: IntegrityCheckRecord[];
  safeHaltEvents: SafeHaltEvent[];
  usageCovenant: UsageCovenantSummary;
  restrictedUses: RestrictedUseSummary[];
  partnerProfiles: PartnerEthicsProfile[];
  auditTrailPreview: AuditLogRecord[];
}

export interface JournalEntryRecord {
  id: string;
  title: string;
  content: string;
  entryType: "journal" | "diary" | "note";
  mood?: string;
  intensity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntrySummary {
  id: string;
  title: string;
  type: "journal" | "diary" | "note";
  createdAt: string;
  mood?: string;
}

export interface DiaryPromptRecord {
  id: string;
  promptText: string;
  promptType: string;
}

export interface DiaryEntrySummary {
  id: string;
  title: string;
  content: string;
  mood: string;
  entryDate: string;
  autoGenerated: boolean;
  sourceContext?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteSummary {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  updatedAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  status: GoalMilestoneStatus;
  dueDate?: string;
  completedAt?: string;
}

export interface GoalSummary {
  id: string;
  title: string;
  description: string;
  lifeArea: string;
  status: GoalStatus;
  progressPercent: number;
  dueDate?: string;
  milestones: GoalMilestone[];
  updatedAt: string;
}

export interface GoalStats {
  total: number;
  active: number;
  completed: number;
  averageProgress: number;
  completionRate: number;
}

export interface GoalsResponse {
  items: GoalSummary[];
  stats: GoalStats;
}

export interface NotificationPreference {
  developmentEnabled: boolean;
  goalRemindersEnabled: boolean;
  frequency: NotificationFrequency;
  preferredTime: string;
  preferredWeekday: string;
  tone: NotificationTone;
}

export interface NotificationHistoryItem {
  id: string;
  notificationType: "growth" | "goal" | "security";
  channel: "email" | "in-app";
  title: string;
  message: string;
  deliveredAt: string;
  status: "queued" | "sent" | "failed";
}

export interface NotificationJobRecord {
  id: string;
  jobType: "growth" | "goal";
  scheduledFor: string;
  status: "scheduled" | "paused";
}

export interface PrivacyPreferenceSummary {
  privacyMode: PrivacyMode;
  analyticsEnabled: boolean;
  longTermMemoryEnabled: boolean;
  exportFormat: ExportFormat;
  securityAlerts: boolean;
  retentionProfile: string;
}

export interface ConsentRecordSummary {
  id: string;
  scope: string;
  status: ConsentStatus;
  description: string;
  required: boolean;
  grantedAt: string;
  revokedAt?: string;
}

export interface PrivacyLedgerEntry {
  id: string;
  category: string;
  storageScope: string;
  retentionRule: string;
  activeUsageSummary: string;
  userVisible: boolean;
  updatedAt: string;
}

export interface DataExportRequestSummary {
  id: string;
  format: ExportFormat;
  status: "queued" | "ready";
  requestedAt: string;
  expiresAt?: string;
}

export interface DataDeletionRequestSummary {
  id: string;
  scope: DeletionScope;
  status: "queued" | "completed";
  requestedAt: string;
  scheduledFor: string;
}

export interface PrivacyOverview {
  preferences: PrivacyPreferenceSummary;
  consents: ConsentRecordSummary[];
  ledger: PrivacyLedgerEntry[];
  exportRequests: DataExportRequestSummary[];
  deletionRequests: DataDeletionRequestSummary[];
  guidance: string[];
}

export interface SecuritySessionSummary {
  id: string;
  userId: string;
  label: string;
  createdAt: string;
  lastSeenAt: string;
  revokedAt: string | null;
}

export interface AuthSessionPayload {
  user: AuthenticatedUserSummary;
  session: SecuritySessionSummary;
}

export interface SecurityEventSummary {
  id: string;
  userId: string;
  type: string;
  severity: SecuritySeverity;
  createdAt: string;
  summary: string;
}

export interface SecurityIncidentSummary {
  id: string;
  incidentType: string;
  severity: SecuritySeverity;
  affectedScope: string;
  status: IncidentStatus;
  detectedAt: string;
  resolvedAt?: string;
  summary: string;
  recommendedAction: string;
}

export interface IncidentNotificationSummary {
  id: string;
  incidentType: string;
  severity: SecuritySeverity;
  title: string;
  description: string;
  recommendedAction: string;
  deliveredVia: Array<"email" | "in-app">;
  deliveredAt: string;
  acknowledgedAt?: string;
}

export interface SecurityCenterOverview {
  sessions: SecuritySessionSummary[];
  events: SecurityEventSummary[];
  incidents: SecurityIncidentSummary[];
  notifications: IncidentNotificationSummary[];
}

export interface AnalysisInput {
  title?: string;
  content: string;
  context?: string[];
}

export interface AnalysisReport {
  id: string;
  mode: ResponseMode;
  evidenceLabel: EvidenceLabel;
  governance?: GovernanceDecision;
  summary: string;
  observation: string;
  psychology: string;
  archetype: string;
  shadowCheck: string;
  developmentHint: string;
  timelineConnection: string;
  extractedConcepts: string[];
  suggestedQuestions: string[];
  generatedAt: string;
}

export interface MirrorReport extends AnalysisReport {
  disconfirmingView: string;
  mirrorQuestion: string;
}

export interface PotentialTruth {
  hasBeen: number;
  canBe: number;
  tendsToBe: number;
}

export interface QuantumLensReport extends AnalysisReport {
  stateDescription: string;
  collapsePattern: string;
  hiddenOption: string;
  fieldQuestion: string;
  potentialTruth: PotentialTruth;
}

export interface GrowthState {
  id: string;
  currentStage: string;
  focusArea: string;
  momentumScore: number;
  coherenceScore: number;
  strengths: string[];
  risks: string[];
  nextStep: string;
  updatedAt: string;
}

export interface GrowthIntervention {
  id: string;
  title: string;
  rationale: string;
  action: string;
  tone: NotificationTone;
  createdAt: string;
}

export interface MemoryItem {
  id: string;
  sourceType: MemorySourceType;
  title: string;
  content: string;
  concepts: string[];
  relevance: number;
  createdAt: string;
}

export interface MemorySearchResult {
  query: string;
  items: MemoryItem[];
  total: number;
  generatedAt: string;
}
