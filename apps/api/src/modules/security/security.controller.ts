import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { SecurityService } from "./security.service";

@UseGuards(SessionAuthGuard)
@Controller("security")
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get("overview")
  getOverview(@CurrentUserId() userId: string) {
    return this.securityService.getOverview(userId);
  }

  @Get("incidents")
  getIncidents(@CurrentUserId() userId: string) {
    return this.securityService.listIncidents(userId);
  }

  @Get("notifications")
  getNotifications(@CurrentUserId() userId: string) {
    return this.securityService.listNotifications(userId);
  }

  @Post("simulate/suspicious-login")
  simulateSuspiciousLogin(@CurrentUserId() userId: string) {
    return this.securityService.simulateSuspiciousLogin(userId);
  }

  @Post("notifications/:notificationId/acknowledge")
  acknowledgeNotification(@CurrentUserId() userId: string, @Param("notificationId") notificationId: string) {
    return this.securityService.acknowledgeNotification(notificationId, userId);
  }
}
