import { Module } from "@nestjs/common";
import { AnalysisModule } from "./modules/analysis/analysis.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DesktopStateModule } from "./modules/common/desktop-state.module";
import { ConsentsModule } from "./modules/consents/consents.module";
import { DiaryModule } from "./modules/diary/diary.module";
import { GoalsModule } from "./modules/goals/goals.module";
import { GovernanceModule } from "./modules/governance/governance.module";
import { GrowthModule } from "./modules/growth/growth.module";
import { HealthModule } from "./modules/health/health.module";
import { JournalModule } from "./modules/journal/journal.module";
import { MemoryModule } from "./modules/memory/memory.module";
import { MirrorModule } from "./modules/mirror/mirror.module";
import { NotesModule } from "./modules/notes/notes.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PrivacyModule } from "./modules/privacy/privacy.module";
import { SearchModule } from "./modules/search/search.module";
import { SecurityModule } from "./modules/security/security.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    DesktopStateModule,
    HealthModule,
    AuditModule,
    UsersModule,
    SecurityModule,
    AuthModule,
    JournalModule,
    DiaryModule,
    NotesModule,
    GoalsModule,
    NotificationsModule,
    AnalysisModule,
    MirrorModule,
    GrowthModule,
    MemoryModule,
    SearchModule,
    ConsentsModule,
    PrivacyModule,
    GovernanceModule
  ]
})
export class DesktopAppModule {}
