import { Controller, Get, Param, Post } from "@nestjs/common";
import { SecurityService } from "./security.service";

@Controller("security")
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get("overview")
  getOverview() {
    return this.securityService.getOverview();
  }

  @Get("incidents")
  getIncidents() {
    return this.securityService.listIncidents();
  }

  @Get("notifications")
  getNotifications() {
    return this.securityService.listNotifications();
  }

  @Post("simulate/suspicious-login")
  simulateSuspiciousLogin() {
    return this.securityService.simulateSuspiciousLogin();
  }

  @Post("notifications/:notificationId/acknowledge")
  acknowledgeNotification(@Param("notificationId") notificationId: string) {
    return this.securityService.acknowledgeNotification(notificationId);
  }
}
