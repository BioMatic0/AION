import { Body, Controller, Get, Post } from "@nestjs/common";
import { GovernanceService } from "./governance.service";
import { EvaluateGovernanceDto } from "./dto/evaluate-governance.dto";

@Controller("governance")
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Get("overview")
  getOverview() {
    return this.governanceService.getOverview();
  }

  @Get("policies")
  getPolicies() {
    return this.governanceService.getPolicies();
  }

  @Get("charter")
  getCharter() {
    return this.governanceService.getCharter();
  }

  @Post("evaluate")
  evaluate(@Body() dto: EvaluateGovernanceDto) {
    return this.governanceService.evaluate(dto);
  }

  @Post("integrity/sweep")
  runIntegritySweep() {
    return this.governanceService.runIntegritySweep();
  }
}
