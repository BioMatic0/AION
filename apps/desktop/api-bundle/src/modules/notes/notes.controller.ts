import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { NotesService } from "./notes.service";

@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  listNotes() {
    return this.notesService.listNotes();
  }

  @Get(":id")
  getNote(@Param("id") id: string) {
    return this.notesService.getNote(id);
  }

  @Post()
  createNote(@Body() dto: CreateNoteDto) {
    return this.notesService.createNote(dto);
  }

  @Patch(":id")
  updateNote(@Param("id") id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.updateNote(id, dto);
  }

  @Delete(":id")
  removeNote(@Param("id") id: string) {
    return this.notesService.removeNote(id);
  }
}