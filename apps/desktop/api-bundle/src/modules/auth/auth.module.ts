import { Module } from "@nestjs/common";
import { SecurityModule } from "../security/security.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UsersModule, SecurityModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}