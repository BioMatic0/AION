import assert from "node:assert/strict";
import test from "node:test";
import { AuditService } from "../src/modules/audit/audit.service";

test("AuditService persists the real user id for user-originated records", async () => {
  const created: Array<{ data: { userId: string | null } }> = [];
  const prisma = {
    auditLog: {
      create: async (input: { data: { userId: string | null } }) => {
        created.push(input);
        return input.data;
      }
    }
  };

  const service = new AuditService(prisma as never);
  await service.record({
    category: "security",
    action: "session.checked",
    resource: "session-1",
    actorType: "user",
    actorId: "user-42",
    detail: "The user reviewed the session state."
  });

  assert.equal(created[0]?.data.userId, "user-42");
});
