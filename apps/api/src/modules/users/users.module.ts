import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { AuthService } from "../auth/auth.service";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { PrismaModule } from "../common/prisma.module";
import { SecurityModule } from "../security/security.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [PrismaModule, AuditModule, SecurityModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, SessionAuthGuard],
  exports: [UsersService]
})
export class UsersModule {}
