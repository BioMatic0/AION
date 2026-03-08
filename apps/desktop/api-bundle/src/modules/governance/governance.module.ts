import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { GovernanceController } from "./governance.controller";
import { GovernanceService } from "./governance.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [GovernanceController],
  providers: [GovernanceService],
  exports: [GovernanceService]
})
export class GovernanceModule {}
