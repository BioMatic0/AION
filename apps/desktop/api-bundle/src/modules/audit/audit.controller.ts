import { Controller, Get, Query } from "@nestjs/common";
import { AuditService } from "./audit.service";

@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("logs")
  getLogs(@Query("limit") limit?: string) {
    const parsed = Number(limit ?? 20);
    return this.auditService.list(Number.isFinite(parsed) ? parsed : 20);
  }
}
