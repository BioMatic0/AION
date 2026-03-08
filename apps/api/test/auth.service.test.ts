import assert from "node:assert/strict";
import test from "node:test";
import { UnauthorizedException } from "@nestjs/common";
import { AuditService } from "../src/modules/audit/audit.service";
import { AuthService } from "../src/modules/auth/auth.service";
import { SecurityService } from "../src/modules/security/security.service";
import { UsersService } from "../src/modules/users/users.service";

test("AuthService rejects malformed password hashes without crashing", async () => {
  const users = new UsersService();
  const security = new SecurityService(new AuditService());
  const auth = new AuthService(users, security);

  await users.createUser({
    displayName: "Patrick Wirth",
    email: "patrick@example.com",
    passwordHash: "broken-hash-format"
  });

  await assert.rejects(
    () =>
      auth.login({
        email: "patrick@example.com",
        password: "123456789012"
      }),
    (error: unknown) => error instanceof UnauthorizedException
  );
});

test("AuthService creates and revokes token-backed sessions", async () => {
  const users = new UsersService();
  const security = new SecurityService(new AuditService());
  const auth = new AuthService(users, security);

  const registration = await auth.register({
    displayName: "Patrick Wirth",
    email: "patrick@example.com",
    password: "123456789012"
  });

  const currentSession = await auth.getCurrentSession(registration.token);
  assert.ok(currentSession);
  assert.equal(currentSession?.user.email, "patrick@example.com");

  const revocation = await auth.logoutByToken(registration.token);
  assert.equal(revocation.revoked, true);

  const afterLogout = await auth.getCurrentSession(registration.token);
  assert.equal(afterLogout, null);
});
