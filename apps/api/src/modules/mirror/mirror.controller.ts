import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { MirrorInputDto } from "./dto/mirror-input.dto";
import { MirrorService } from "./mirror.service";

@UseGuards(SessionAuthGuard)
@Controller("mirror")
export class MirrorController {
  constructor(private readonly mirrorService: MirrorService) {}

  @Get()
  listReports(@CurrentUserId() userId: string) {
    return this.mirrorService.listReports(userId);
  }

  @Get(":id")
  getReport(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.mirrorService.getReport(id, userId);
  }

  @Post("run")
  runMirror(@CurrentUserId() userId: string, @Body() dto: MirrorInputDto) {
    return this.mirrorService.runMirror(dto, userId);
  }
}
