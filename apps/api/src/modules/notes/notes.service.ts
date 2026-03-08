import { Inject, Injectable, NotFoundException, OnModuleInit, Optional } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { NoteSummary } from "@aion/shared-types";
import { LOCAL_USER_ID } from "../common/app-constants";
import { DesktopStateService } from "../common/desktop-state.service";
import { PRISMA_SERVICE } from "../common/prisma.tokens";
import type { PrismaService } from "../common/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";

interface NoteRecord extends NoteSummary {
  createdAt: string;
  sourceType?: string;
}

function createDefaultNotes(): NoteRecord[] {
  const now = new Date().toISOString();

  return [
    {
      id: randomUUID(),
      title: "Quantum Lens Fragen",
      content: "Welche wiederkehrenden Muster lassen den Moeglichkeitsraum zu frueh kollabieren?",
      category: "ideas",
      tags: ["quantum", "mirror"],
      isPinned: true,
      sourceType: "manual",
      createdAt: now,
      updatedAt: now
    }
  ];
}

@Injectable()
export class NotesService implements OnModuleInit {
  private notes: NoteRecord[] = createDefaultNotes();

  constructor(
    private readonly auditService: AuditService,
    @Optional() @Inject(PRISMA_SERVICE) private readonly prisma?: PrismaService,
    @Optional() private readonly desktopState?: DesktopStateService
  ) {}

  async onModuleInit() {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        this.notes = await this.desktopState.loadSection("notes.items", this.notes);
      }
      return;
    }

    await this.prisma.ensureLocalUser();
    const notes = await this.prisma.note.findMany({
      where: { userId: LOCAL_USER_ID },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }]
    });

    if (notes.length === 0) {
      await this.prisma.note.createMany({
        data: this.notes.map((note) => ({
          id: note.id,
          userId: LOCAL_USER_ID,
          title: note.title,
          content: note.content,
          noteCategory: note.category,
          isPinned: note.isPinned,
          sourceType: note.sourceType,
          tags: note.tags,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }))
      });
      return;
    }

    this.notes = notes.map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.noteCategory,
      tags: Array.isArray(note.tags) ? note.tags.filter((item): item is string => typeof item === "string") : [],
      isPinned: note.isPinned,
      sourceType: note.sourceType ?? undefined,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString()
    }));
  }

  private async persistCreate(note: NoteRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("notes.items", this.notes);
      }
      return;
    }

    await this.prisma.note.create({
      data: {
        id: note.id,
        userId: LOCAL_USER_ID,
        title: note.title,
        content: note.content,
        noteCategory: note.category,
        isPinned: note.isPinned,
        sourceType: note.sourceType,
        tags: note.tags,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }
    });
  }

  private async persistUpdate(note: NoteRecord) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("notes.items", this.notes);
      }
      return;
    }

    await this.prisma.note.update({
      where: { id: note.id },
      data: {
        title: note.title,
        content: note.content,
        noteCategory: note.category,
        isPinned: note.isPinned,
        sourceType: note.sourceType,
        tags: note.tags,
        updatedAt: new Date(note.updatedAt)
      }
    });
  }

  private async persistDelete(id: string) {
    if (!this.prisma) {
      if (this.desktopState?.isEnabled()) {
        await this.desktopState.saveSection("notes.items", this.notes);
      }
      return;
    }

    await this.prisma.note.delete({
      where: { id }
    });
  }

  listNotes() {
    return this.notes;
  }

  getNote(id: string) {
    const note = this.notes.find((item) => item.id === id);
    if (!note) {
      throw new NotFoundException("Notiz nicht gefunden.");
    }

    return note;
  }

  async createNote(dto: CreateNoteDto) {
    const now = new Date().toISOString();
    const note: NoteRecord = {
      id: randomUUID(),
      title: dto.title,
      content: dto.content,
      category: dto.category,
      tags: dto.tags ?? [],
      isPinned: dto.isPinned ?? false,
      sourceType: dto.sourceType,
      createdAt: now,
      updatedAt: now
    };

    this.notes.unshift(note);
    await this.persistCreate(note);
    await this.auditService.record({
      category: "notes",
      action: "note.created",
      resource: note.id,
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Die Notiz "${note.title}" wurde angelegt.`
    });
    return note;
  }

  async updateNote(id: string, dto: UpdateNoteDto) {
    const note = this.getNote(id);
    Object.assign(note, dto, { updatedAt: new Date().toISOString() });
    await this.persistUpdate(note);
    await this.auditService.record({
      category: "notes",
      action: "note.updated",
      resource: note.id,
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Die Notiz "${note.title}" wurde aktualisiert.`
    });
    return note;
  }

  async removeNote(id: string) {
    const index = this.notes.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException("Notiz nicht gefunden.");
    }

    const [removed] = this.notes.splice(index, 1);
    await this.persistDelete(id);
    await this.auditService.record({
      category: "notes",
      action: "note.removed",
      resource: removed.id,
      actorType: "user",
      actorId: LOCAL_USER_ID,
      detail: `Die Notiz "${removed.title}" wurde entfernt.`
    });
    return removed;
  }
}
