import { Global, Module } from "@nestjs/common";
import { SecurityModule } from "../security/security.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionAuthGuard } from "./session-auth.guard";

@Global()
@Module({
  imports: [UsersModule, SecurityModule],
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard],
  exports: [AuthService, SessionAuthGuard]
})
export class AuthModule {}
