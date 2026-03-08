import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { UpdateNotificationPreferencesDto } from "./dto/update-notification-preferences.dto";
import { NotificationsService } from "./notifications.service";

@UseGuards(SessionAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("preferences")
  getPreferences(@CurrentUserId() userId: string) {
    return this.notificationsService.getPreferences(userId);
  }

  @Put("preferences")
  updatePreferences(@CurrentUserId() userId: string, @Body() dto: UpdateNotificationPreferencesDto) {
    return this.notificationsService.updatePreferences(dto, userId);
  }

  @Get("history")
  getHistory(@CurrentUserId() userId: string) {
    return this.notificationsService.getHistory(userId);
  }

  @Get("jobs")
  getJobs(@CurrentUserId() userId: string) {
    return this.notificationsService.getJobs(userId);
  }

  @Post("preview")
  createPreview(@CurrentUserId() userId: string) {
    return this.notificationsService.createPreviewNotification(userId);
  }
}
