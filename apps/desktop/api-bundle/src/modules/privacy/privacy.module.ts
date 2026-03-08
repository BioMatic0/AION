import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { ConsentsModule } from "../consents/consents.module";
import { PrivacyController } from "./privacy.controller";
import { PrivacyService } from "./privacy.service";

@Module({
  imports: [AuditModule, ConsentsModule, PrismaModule],
  controllers: [PrivacyController],
  providers: [PrivacyService],
  exports: [PrivacyService]
})
export class PrivacyModule {}
