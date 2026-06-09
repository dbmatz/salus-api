import { describe, expect, it } from "vitest";
import { User } from "@domain/entities/User";
import { DomainError } from "@domain/errors/DomainError";
import { Email } from "@domain/value-objects/Email";

function makeValidUserProps() {
  return {
    name: "Ana Silva",
    email: Email.create("ana@email.com"),
    passwordHash: "hashed_password",
  };
}

describe("User", () => {
  describe("create", () => {
    it("must create a valid user", () => {
      const user = User.create(makeValidUserProps());
      expect(user.name).toBe("Ana Silva");
      expect(user.email.value).toBe("ana@email.com");
      expect(user.isDeleted).toBe(false);
    });

    it("must throw DomainError when name has no last name", () => {
      expect(() =>
        User.create({ ...makeValidUserProps(), name: "Ana" }),
      ).toThrow(DomainError);
    });

    it("must throw DomainError when any name part is shorter than 2 characters", () => {
      expect(() =>
        User.create({ ...makeValidUserProps(), name: "E A" }),
      ).toThrow(DomainError);
    });
  });

  describe("updateName", () => {
    it("must update name successfully", () => {
      const user = User.create(makeValidUserProps());
      user.updateName("Maria Oliveira");
      expect(user.name).toBe("Maria Oliveira");
    });

    it("must update updatedAt when name is changed", () => {
      const user = User.create(makeValidUserProps());
      user.updateName("Maria Oliveira");
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it("must throw DomainError when name has no last name", () => {
      const user = User.create(makeValidUserProps());
      expect(() => user.updateName("Maria")).toThrow(DomainError);
    });

    it("must throw DomainError when any name part is shorter than 2 characters", () => {
      const user = User.create(makeValidUserProps());
      expect(() => user.updateName("M O")).toThrow(DomainError);
    });
  });

  describe("updateEmail", () => {
    it("must update email successfully", () => {
      const user = User.create(makeValidUserProps());
      const newEmail = Email.create("ana3@email.com");
      user.updateEmail(newEmail);
      expect(user.email.value).toBe("ana3@email.com");
    });

    it("must update updatedAt when email is changed", () => {
      const user = User.create(makeValidUserProps());
      user.updateEmail(Email.create("new@email.com"));
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("delete", () => {
    it("must mark user as deleted", () => {
      const user = User.create(makeValidUserProps());
      user.delete();
      expect(user.isDeleted).toBe(true);
      expect(user.deletedAt).toBeInstanceOf(Date);
    });

    it("must throw DomainError when deleting an already deleted user", () => {
      const user = User.create(makeValidUserProps());
      user.delete();
      expect(() => user.delete()).toThrow(DomainError);
    });
  });
});