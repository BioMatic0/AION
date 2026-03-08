import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUserId } from "../auth/current-user.decorator";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { NotesService } from "./notes.service";

@UseGuards(SessionAuthGuard)
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  listNotes(@CurrentUserId() userId: string) {
    return this.notesService.listNotes(userId);
  }

  @Get(":id")
  getNote(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.notesService.getNote(id, userId);
  }

  @Post()
  createNote(@CurrentUserId() userId: string, @Body() dto: CreateNoteDto) {
    return this.notesService.createNote(dto, userId);
  }

  @Patch(":id")
  updateNote(@CurrentUserId() userId: string, @Param("id") id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.updateNote(id, dto, userId);
  }

  @Delete(":id")
  removeNote(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.notesService.removeNote(id, userId);
  }
}
