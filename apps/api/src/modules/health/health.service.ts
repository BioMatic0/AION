import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: "ok",
      service: "aion-api",
      timestamp: new Date().toISOString()
    };
  }
}