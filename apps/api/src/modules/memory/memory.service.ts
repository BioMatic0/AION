import { Inject, Injectable, OnModuleInit, Optional } from "@nestjs/common";
import { createMemoryItem, searchMemory } from "@aion/ai-core";
import type { MemoryItem } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { DiaryService } from "../diary/diary.service";
import { GoalsService } from "../goals/goals.service";
import { JournalService } from "../journal/journal.service";
import { NotesService } from "../notes/notes.service";
import { CreateMemoryItemDto } from "./dto/create-memory-item.dto";

@Injectable()
export class MemoryService implements OnModuleInit {
  private manualItems: MemoryItem[] = [];
  private syncedItems: MemoryItem[] = [];

  constructor(
    private readonly journalService: JournalService,
    private readonly diaryService: DiaryService,
    private readonly notesService: NotesService,
    private readonly goalsService: GoalsService,
    private readonly auditService: AuditService,
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.manualItems = await this.desktopState.loadSection("memory.manualItems", this.manualItems);
        this.syncedItems = await this.desktopState.loadSection("memory.syncedItems", this.syncedItems);
      }
      return;
    }

    await this.prisma.ensureLocalUser();
    const records = await this.prisma.memoryItemRecord.findMany({
      where: { userId: LOCAL_USER_ID },
      orderBy: { updatedAt: "desc" }
    });

    this.manualItems = records
      .filter((record) => !record.isDerived)
      .map((record) => this.mapRecord(record));
    this.syncedItems = records
      .filter((record) => record.isDerived)
      .map((record) => this.mapRecord(record));
  }

  private mapRecord(record: {
    id: string;
    sourceType: string;
    title: string;
    content: string;
    concepts: unknown;
    relevance: number;
    createdAt: Date;
  }): MemoryItem {
    return {
      id: record.id,
      sourceType: record.sourceType as MemoryItem["sourceType"],
      title: record.title,
      content: record.content,
      concepts: Array.isArray(record.concepts) ? record.concepts.filter((item): item is string => typeof item === "string") : [],
      relevance: record.relevance,
      createdAt: record.createdAt.toISOString()
    };
  }

  private buildDerivedItem(sourceType: MemoryItem["sourceType"], sourceId: string, title: string, content: string, createdAt?: string) {
    const base = createMemoryItem(sourceType, title, content);

    return {
      ...base,
      id: `${sourceType}:${sourceId}`,
      createdAt: createdAt ?? base.createdAt
    } satisfies MemoryItem;
  }

  private async buildDerivedItems(userId: string) {
    const [journalItems, diaryItems, noteItems, goalResponse] = await Promise.all([
      this.journalService.listEntries(userId),
      this.diaryService.listEntries(userId),
      this.notesService.listNotes(userId),
      this.goalsService.listGoals(userId)
    ]);

    const journalMemory = journalItems.map((entry) =>
      this.buildDerivedItem("journal", entry.id, entry.title, entry.content, entry.updatedAt)
    );
    const diaryMemory = diaryItems.map((entry) =>
      this.buildDerivedItem("diary", entry.id, entry.title, entry.content, entry.updatedAt)
    );
    const noteMemory = noteItems.map((note) =>
      this.buildDerivedItem("note", note.id, note.title, note.content, note.updatedAt)
    );
    const goalMemory = goalResponse.items.map((goal) =>
      this.buildDerivedItem(
        "goal",
        goal.id,
        goal.title,
        `${goal.description} ${goal.milestones.map((milestone) => milestone.title).join(" ")}`.trim(),
        goal.updatedAt
      )
    );

    return [...journalMemory, ...diaryMemory, ...noteMemory, ...goalMemory].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt)
    );
  }

  private async persistManualItem(item: MemoryItem, userId: string) {
    if (!this.prisma || userId === LOCAL_USER_ID) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("memory.manualItems", this.manualItems);
      }
      return;
    }

    await this.prisma.memoryItemRecord.create({
      data: {
        id: item.id,
        userId,
        sourceType: item.sourceType,
        title: item.title,
        content: item.content,
        concepts: item.concepts,
        relevance: item.relevance,
        isDerived: false,
        createdAt: new Date(item.createdAt)
      }
    });
  }

  private async persistSyncedItems(items: MemoryItem[], userId: string) {
    if (!this.prisma || userId === LOCAL_USER_ID) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("memory.syncedItems", this.syncedItems);
      }
      return;
    }

    await this.prisma.memoryItemRecord.deleteMany({
      where: {
        userId,
        isDerived: true
      }
    });

    if (items.length > 0) {
      await this.prisma.memoryItemRecord.createMany({
        data: items.map((item) => ({
          id: item.id,
          userId,
          sourceType: item.sourceType,
          sourceRef: item.id.split(":").slice(1).join(":") || null,
          syncKey: item.id,
          title: item.title,
          content: item.content,
          concepts: item.concepts,
          relevance: item.relevance,
          isDerived: true,
          createdAt: new Date(item.createdAt)
        }))
      });
    }
  }

  private async currentItems(userId: string) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const records = await this.prisma.memoryItemRecord.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" }
      });
      return records.map((record) => this.mapRecord(record));
    }

    const derivedItems = this.syncedItems.length > 0 ? this.syncedItems : await this.buildDerivedItems(userId);
    return [...this.manualItems, ...derivedItems].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async listItems(userId: string = LOCAL_USER_ID) {
    return this.currentItems(userId);
  }

  async addItem(dto: CreateMemoryItemDto, userId: string = LOCAL_USER_ID) {
    const item = createMemoryItem(dto.sourceType, dto.title, dto.content);
    if (!this.prisma || userId === LOCAL_USER_ID) {
      this.manualItems.unshift(item);
    }
    await this.persistManualItem(item, userId);
    await this.auditService.record({
      category: "memory",
      action: "item.created",
      resource: item.id,
      actorType: "user",
      actorId: userId,
      detail: `Manual memory item "${item.title}" was created.`
    });
    return item;
  }

  async syncSystemMemory(userId: string = LOCAL_USER_ID) {
    const items = await this.buildDerivedItems(userId);
    if (!this.prisma || userId === LOCAL_USER_ID) {
      this.syncedItems = items;
    }
    await this.persistSyncedItems(items, userId);
    await this.auditService.record({
      category: "memory",
      action: "sync.completed",
      resource: "system-memory",
      actorType: "system",
      actorId: "memory-engine",
      detail: `System memory sync completed with ${items.length} derived items.`
    });

    return {
      total: items.length,
      generatedAt: new Date().toISOString(),
      items
    };
  }

  async search(query: string, userId: string = LOCAL_USER_ID) {
    return searchMemory(query, await this.currentItems(userId));
  }
}
