import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { AnalyzeInputDto } from "./dto/analyze-input.dto";
import { AnalysisService } from "./analysis.service";

@UseGuards(SessionAuthGuard)
@Controller("analysis")
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  listReports(@CurrentUserId() userId: string) {
    return this.analysisService.listReports(userId);
  }

  @Get("quantum-lens")
  listQuantumReports(@CurrentUserId() userId: string) {
    return this.analysisService.listQuantumReports(userId);
  }

  @Get(":id")
  getReport(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.analysisService.getReport(id, userId);
  }

  @Post("run")
  runAnalysis(@CurrentUserId() userId: string, @Body() dto: AnalyzeInputDto) {
    return this.analysisService.runAnalysis(dto, userId);
  }

  @Post("quantum-lens")
  runQuantumLens(@CurrentUserId() userId: string, @Body() dto: AnalyzeInputDto) {
    return this.analysisService.runQuantumLens(dto, userId);
  }
}
