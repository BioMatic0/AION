import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { LOCAL_USER_DISPLAY_NAME, LOCAL_USER_EMAIL, LOCAL_USER_ID } from "./app-constants";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.$disconnect();
  }

  async ensureLocalUser() {
    return this.user.upsert({
      where: { id: LOCAL_USER_ID },
      update: {
        email: LOCAL_USER_EMAIL,
        displayName: LOCAL_USER_DISPLAY_NAME,
        passwordHash: null
      },
      create: {
        id: LOCAL_USER_ID,
        email: LOCAL_USER_EMAIL,
        displayName: LOCAL_USER_DISPLAY_NAME,
        passwordHash: null
      }
    });
  }
}
