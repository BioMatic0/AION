import { Injectable } from "@nestjs/common";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

interface DesktopStateRecord {
  version: 1;
  updatedAt: string;
  sections: Record<string, unknown>;
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

@Injectable()
export class DesktopStateService {
  private readonly enabled = process.env.AION_DESKTOP_RUNTIME === "1";
  private readonly filePath = this.enabled
    ? path.join(
        process.env.AION_DESKTOP_DATA_DIR
          ? path.resolve(process.env.AION_DESKTOP_DATA_DIR)
          : path.resolve(process.cwd(), ".aion-desktop-data"),
        "desktop-state.json"
      )
    : null;

  private state: DesktopStateRecord | null = null;
  private writeQueue = Promise.resolve();

  isEnabled() {
    return this.enabled;
  }

  getStateFilePath() {
    return this.filePath;
  }

  private createEmptyState(): DesktopStateRecord {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      sections: {}
    };
  }

  private async ensureLoaded() {
    if (!this.enabled || !this.filePath) {
      return this.createEmptyState();
    }

    if (this.state) {
      return this.state;
    }

    await mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      const raw = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<DesktopStateRecord>;
      this.state = {
        version: 1,
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
        sections: typeof parsed.sections === "object" && parsed.sections ? parsed.sections : {}
      };
    } catch {
      this.state = this.createEmptyState();
      await this.flush();
    }

    return this.state;
  }

  private async flush() {
    if (!this.enabled || !this.filePath || !this.state) {
      return;
    }

    const payload = JSON.stringify(this.state, null, 2);
    this.writeQueue = this.writeQueue.then(() => writeFile(this.filePath!, payload, "utf8"));
    await this.writeQueue;
  }

  async loadSection<T>(key: string, fallback: T): Promise<T> {
    if (!this.enabled) {
      return cloneValue(fallback);
    }

    const state = await this.ensureLoaded();
    if (!(key in state.sections)) {
      const initialValue = cloneValue(fallback);
      state.sections[key] = initialValue;
      state.updatedAt = new Date().toISOString();
      await this.flush();
      return cloneValue(initialValue);
    }

    return cloneValue(state.sections[key] as T);
  }

  async saveSection<T>(key: string, value: T) {
    if (!this.enabled) {
      return;
    }

    const state = await this.ensureLoaded();
    state.sections[key] = cloneValue(value);
    state.updatedAt = new Date().toISOString();
    await this.flush();
  }
}
