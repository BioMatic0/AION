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

  async listNotes(userId: string = LOCAL_USER_ID) {
    if (!this.prisma || userId === LOCAL_USER_ID) {
      return this.notes;
    }

    const notes = await this.prisma.note.findMany({
      where: { userId },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }]
    });

    return notes.map((note) => ({
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

  async getNote(id: string, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const note = await this.prisma.note.findFirst({
        where: { id, userId }
      });

      if (!note) {
        throw new NotFoundException("Notiz nicht gefunden.");
      }

      return {
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.noteCategory,
        tags: Array.isArray(note.tags) ? note.tags.filter((item): item is string => typeof item === "string") : [],
        isPinned: note.isPinned,
        sourceType: note.sourceType ?? undefined,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString()
      };
    }

    const note = this.notes.find((item) => item.id === id);
    if (!note) {
      throw new NotFoundException("Notiz nicht gefunden.");
    }

    return note;
  }

  async createNote(dto: CreateNoteDto, userId: string = LOCAL_USER_ID) {
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

    if (!this.prisma || userId === LOCAL_USER_ID) {
      this.notes.unshift(note);
      await this.persistCreate(note);
    } else {
      await this.prisma.note.create({
        data: {
          id: note.id,
          userId,
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
    await this.auditService.record({
      category: "notes",
      action: "note.created",
      resource: note.id,
      actorType: "user",
      actorId: userId,
      detail: `Die Notiz "${note.title}" wurde angelegt.`
    });
    return note;
  }

  async updateNote(id: string, dto: UpdateNoteDto, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const current = await this.prisma.note.findFirst({
        where: { id, userId }
      });

      if (!current) {
        throw new NotFoundException("Notiz nicht gefunden.");
      }

      const resolvedTags = dto.tags ?? current.tags;
      const normalizedTags = Array.isArray(resolvedTags)
        ? resolvedTags.filter((item): item is string => typeof item === "string")
        : [];
      const updatedAt = new Date();
      await this.prisma.note.update({
        where: { id: current.id },
        data: {
          title: dto.title ?? current.title,
          content: dto.content ?? current.content,
          noteCategory: dto.category ?? current.noteCategory,
          isPinned: dto.isPinned ?? current.isPinned,
          sourceType: dto.sourceType ?? current.sourceType,
          tags: normalizedTags,
          updatedAt
        }
      });

      const updated = {
        id: current.id,
        title: dto.title ?? current.title,
        content: dto.content ?? current.content,
        category: dto.category ?? current.noteCategory,
        tags: normalizedTags,
        isPinned: dto.isPinned ?? current.isPinned,
        sourceType: dto.sourceType ?? current.sourceType ?? undefined,
        createdAt: current.createdAt.toISOString(),
        updatedAt: updatedAt.toISOString()
      };

      await this.auditService.record({
        category: "notes",
        action: "note.updated",
        resource: updated.id,
        actorType: "user",
        actorId: userId,
        detail: `Die Notiz "${updated.title}" wurde aktualisiert.`
      });
      return updated;
    }

    const note = await this.getNote(id, userId);
    Object.assign(note, dto, { updatedAt: new Date().toISOString() });
    await this.persistUpdate(note);
    await this.auditService.record({
      category: "notes",
      action: "note.updated",
      resource: note.id,
      actorType: "user",
      actorId: userId,
      detail: `Die Notiz "${note.title}" wurde aktualisiert.`
    });
    return note;
  }

  async removeNote(id: string, userId: string = LOCAL_USER_ID) {
    if (this.prisma && userId !== LOCAL_USER_ID) {
      const current = await this.prisma.note.findFirst({
        where: { id, userId }
      });

      if (!current) {
        throw new NotFoundException("Notiz nicht gefunden.");
      }

      await this.prisma.note.delete({
        where: { id: current.id }
      });

      await this.auditService.record({
        category: "notes",
        action: "note.removed",
        resource: current.id,
        actorType: "user",
        actorId: userId,
        detail: `Die Notiz "${current.title}" wurde entfernt.`
      });

      return {
        id: current.id,
        title: current.title,
        content: current.content,
        category: current.noteCategory,
        tags: Array.isArray(current.tags) ? current.tags.filter((item): item is string => typeof item === "string") : [],
        isPinned: current.isPinned,
        sourceType: current.sourceType ?? undefined,
        createdAt: current.createdAt.toISOString(),
        updatedAt: current.updatedAt.toISOString()
      };
    }

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
      actorId: userId,
      detail: `Die Notiz "${removed.title}" wurde entfernt.`
    });
    return removed;
  }
}
