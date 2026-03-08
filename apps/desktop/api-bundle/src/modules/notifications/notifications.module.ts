import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../common/prisma.module";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
