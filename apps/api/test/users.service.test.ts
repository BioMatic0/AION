import assert from "node:assert/strict";
import test from "node:test";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { hashPassword } from "../src/modules/auth/password-utils";
import { UsersService } from "../src/modules/users/users.service";

test("UsersService updates profile data and normalizes the email address", async () => {
  const service = new UsersService();
  const created = await service.createUser({
    displayName: "Patrick Wirth",
    email: "Patrick@Example.com ",
    passwordHash: hashPassword("123456789012")
  });

  const updated = await service.updateProfile(created.id, {
    displayName: "Patrick W.",
    email: "NewMail@Example.com "
  });

  assert.equal(updated.displayName, "Patrick W.");
  assert.equal(updated.email, "newmail@example.com");
  assert.ok(updated.updatedAt);
});

test("UsersService rejects password changes with the wrong current password", async () => {
  const service = new UsersService();
  const created = await service.createUser({
    displayName: "Patrick Wirth",
    email: "patrick@example.com",
    passwordHash: hashPassword("123456789012")
  });

  await assert.rejects(
    () =>
      service.changePassword(created.id, {
        currentPassword: "wrong-password-123",
        newPassword: "12345678901234",
        confirmPassword: "12345678901234"
      }),
    (error: unknown) => error instanceof UnauthorizedException
  );
});

test("UsersService enforces 2FA scaffold requirements for SMS", async () => {
  const service = new UsersService();
  const created = await service.createUser({
    displayName: "Patrick Wirth",
    email: "patrick@example.com",
    passwordHash: hashPassword("123456789012")
  });

  await assert.rejects(
    () =>
      service.updateTwoFactor(created.id, {
        enabled: true,
        method: "sms"
      }),
    (error: unknown) => error instanceof BadRequestException
  );

  const configured = await service.updateTwoFactor(created.id, {
    enabled: true,
    method: "sms",
    phoneHint: "+49 *** 1234"
  });

  assert.equal(configured.twoFactorEnabled, true);
  assert.equal(configured.twoFactorMethod, "sms");
  assert.equal(configured.twoFactorPhoneHint, "+49 *** 1234");
});
