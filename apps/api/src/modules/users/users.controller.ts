import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  listUsers() {
    return this.usersService.listUsers().map(this.usersService.sanitizeUser);
  }

  @Get(":id")
  getUser(@Param("id") id: string) {
    const user = this.usersService.findById(id);
    return user ? this.usersService.sanitizeUser(user) : null;
  }
}