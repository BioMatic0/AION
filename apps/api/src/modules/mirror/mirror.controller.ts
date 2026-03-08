import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MirrorInputDto } from "./dto/mirror-input.dto";
import { MirrorService } from "./mirror.service";

@Controller("mirror")
export class MirrorController {
  constructor(private readonly mirrorService: MirrorService) {}

  @Get()
  listReports() {
    return this.mirrorService.listReports();
  }

  @Get(":id")
  getReport(@Param("id") id: string) {
    return this.mirrorService.getReport(id);
  }

  @Post("run")
  runMirror(@Body() dto: MirrorInputDto) {
    return this.mirrorService.runMirror(dto);
  }
}