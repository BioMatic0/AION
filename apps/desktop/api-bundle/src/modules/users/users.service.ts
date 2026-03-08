import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

export interface UserRecord {
  id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

@Injectable()
export class UsersService {
  private readonly users = new Map<string, UserRecord>();

  listUsers() {
    return Array.from(this.users.values());
  }

  findByEmail(email: string) {
    return this.listUsers().find((user) => user.email === email.toLowerCase());
  }

  findById(id: string) {
    return this.users.get(id) ?? null;
  }

  createUser(input: { displayName: string; email: string; passwordHash: string }) {
    const user: UserRecord = {
      id: randomUUID(),
      displayName: input.displayName,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString()
    };

    this.users.set(user.id, user);
    return user;
  }

  sanitizeUser = (user: UserRecord) => ({
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    createdAt: user.createdAt
  });
}