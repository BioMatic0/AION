import { Inject, Injectable, NotFoundException, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateJournalEntryDto } from "./dto/create-journal-entry.dto";
import { UpdateJournalEntryDto } from "./dto/update-journal-entry.dto";

interface JournalEntryRecord extends CreateJournalEntryDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class JournalService implements OnModuleInit {
  private entries: JournalEntryRecord[] = [];

  constructor(
    private readonly auditService: AuditService,
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.entries = await this.desktopState.loadSection("journal.entries", this.entries);
      }
      return;
    }

    await this.prisma.ensureLocalUser();
    const entries = await this.prisma.journalEntry.findMany({
      where: { userId: LOCAL_USER_ID },
      orderBy: { createdAt: "desc" }
    });

    this.entries = entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      entryType: entry.entryType as JournalEntryRecord["entryType"],
      mood: entry.mood ?? undefined,
      intensity: entry.intensity ?? undefined,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString()
    }));
  }

  private async persistCreate(entry: JournalEntryRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("journal.entries", this.entries);
      }
      return;
    }

    await this.prisma.journalEntry.create({
      data: {
        id: entry.id,
        userId: LOCAL_USER_ID,
        title: entry.title,
        content: entry.content,
        entryType: entry.entryType,
        mood: entry.mood,
        intensity: entry.intensity,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt)
      }
    });
  }

  private async persistUpdate(entry: JournalEntryRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("journal.entries", this.entries);
      }
      return;
    }

    await this.prisma.journalEntry.update({
      where: { id: entry.id },
      data: {
        title: entry.title,
        content: entry.content,
        entryType: entry.entryType,
        mood: entry.mood,
        intensity: entry.intensity,
        updatedAt: new Date(entry.updatedAt)
      }
    });
  }

  private async persistDelete(id: string) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("journal.entries", this.entries);
      }
      return;
    }

    await this.prisma.journalEntry.delete({
      where: { id }
    });
  }

  listEntries() {
    return this.entries;
  }

  getEntry(id: string) {
    const entry = this.entries.find((item) => item.id === id);
    if (!entry) {
      throw new NotFoundException("Journaleintrag nicht gefunden.");
    }

    return entry;
  }

  async createEntry(dto: CreateJournalEntryDto) {
    const now = new Date().toISOString();
    const entry: JournalEntryRecord = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...dto
    };

    this.entries.unshift(entry);
    await this.persistCreate(entry);
    await this.auditService.record({
      category: "journal",
      action: "entry.created",
      resource: entry.id,
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Der Journaleintrag "${entry.title}" wurde angelegt.`
    });
    return entry;
  }

  async updateEntry(id: string, dto: UpdateJournalEntryDto) {
    const entry = this.getEntry(id);
    Object.assign(entry, dto, { updatedAt: new Date().toISOString() });
    await this.persistUpdate(entry);
    await this.auditService.record({
      category: "journal",
      action: "entry.updated",
      resource: entry.id,
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Der Journaleintrag "${entry.title}" wurde aktualisiert.`
    });
    return entry;
  }

  async removeEntry(id: string) {
    const index = this.entries.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException("Journaleintrag nicht gefunden.");
    }

    const [removed] = this.entries.splice(index, 1);
    await this.persistDelete(id);
    await this.auditService.record({
      category: "journal",
      action: "entry.removed",
      resource: removed.id,
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Der Journaleintrag "${removed.title}" wurde entfernt.`
    });
    return removed;
  }
}
