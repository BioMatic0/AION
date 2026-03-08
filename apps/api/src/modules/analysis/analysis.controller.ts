import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AnalyzeInputDto } from "./dto/analyze-input.dto";
import { AnalysisService } from "./analysis.service";

@Controller("analysis")
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  listReports() {
    return this.analysisService.listReports();
  }

  @Get("quantum-lens")
  listQuantumReports() {
    return this.analysisService.listQuantumReports();
  }

  @Get(":id")
  getReport(@Param("id") id: string) {
    return this.analysisService.getReport(id);
  }

  @Post("run")
  runAnalysis(@Body() dto: AnalyzeInputDto) {
    return this.analysisService.runAnalysis(dto);
  }

  @Post("quantum-lens")
  runQuantumLens(@Body() dto: AnalyzeInputDto) {
    return this.analysisService.runQuantumLens(dto);
  }
}