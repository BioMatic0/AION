import { Global, Module } from "@nestjs/common";
import { DesktopStateService } from "./desktop-state.service";

@Global()
@Module({
  providers: [DesktopStateService],
  exports: [DesktopStateService]
})
export class DesktopStateModule {}
