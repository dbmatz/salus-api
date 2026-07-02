import { DomainError } from "@domain/errors/DomainError";
import { Password } from "@domain/value-objects/Password";
import { describe, expect, it } from "vitest";

describe("Password", () => {
  describe("create", () => {
    it("must create a valid password", () => {
      const password = Password.create("Senha@123");

      expect(password.value).toBe("Senha@123");
    });

    it("must throw DomainError to password with fewer than 8 caracters", () => {
      expect(() => Password.create("Senh@1")).toThrow(DomainError);
    });

    it("must throw DomainError to empty password", () => {
      expect(() => Password.create("")).toThrow(DomainError);
    });

    it("must throw DomainError to password with withespaces", () => {
      expect(() => Password.create("Senh @123")).toThrow(DomainError);
    });

    it("must throw DomainError to password without uppercase", () => {
      expect(() => Password.create("senh@123")).toThrow(DomainError);
    });

    it("must throw DomainError to password without lowercase", () => {
      expect(() => Password.create("SENH@123")).toThrow(DomainError);
    });

    it("must throw DomainError to password without number", () => {
      expect(() => Password.create("Seeeenha@")).toThrow(DomainError);
    });

    it("must throw DomainError to password without special character", () => {
      expect(() => Password.create("Senha1234")).toThrow(DomainError);
    });
  });
});