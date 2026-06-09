import { DomainError } from "@domain/errors/DomainError";
import { Email } from "@domain/value-objects/Email";
import { describe, it, expect } from "vitest";

describe("Email", () => {
  describe("create", () => {
    it("must create a valid email", () => {
      const email = Email.create("ana@email.com");

      expect(email.value).toBe("ana@email.com");
    });

    it("must normalize to lowercase", () => {
      const email = Email.create("ANA@EMAIL.COM");

      expect(email.value).toBe("ana@email.com");
    });

    it("must remove the white spaces", () => {
      const email = Email.create("  ana@email.com  ");

      expect(email.value).toBe("ana@email.com");
    });

    it("must throw DomainError to email without @", () => {
      expect(() => Email.create("anaemail.com")).toThrow(DomainError);
    });

    it("must throw DomainError to empty email", () => {
      expect(() => Email.create("")).toThrow(DomainError);
    });

    it("must throw DomainError to email without domain", () => {
      expect(() => Email.create("ana@")).toThrow(DomainError);
    });
  });

  describe("equals", () => {
    it("must return true to identical emails", () => {
      const email1 = Email.create("ana@email.com");
      const email2 = Email.create("ana@email.com");
      expect(email1.equals(email2)).toBe(true);
    });

    it("must return true to identical emails with different captalization", () => {
      const email1 = Email.create("ana@email.com");
      const email2 = Email.create("ANA@EMAIL.COM");
      expect(email1.equals(email2)).toBe(true);
    });

    it("must return false to identical emails", () => {
      const email1 = Email.create("ana@email.com");
      const email2 = Email.create("joao@email.com");
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
