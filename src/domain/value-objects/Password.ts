import { DomainError } from "@domain/errors/DomainError";

export class Password {
  readonly value: string;

  private constructor(password: string) {
    this.value = password;
  }

  static create(value: string): Password {
    if (!value || value.trim().length < 6) {
      throw new DomainError(
        `Invalid password. Password must be at least 6 characters long.`,
      );
    }

    if (/\s/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must not contain whitespace.`,
      );
    }

    if (!/[A-Z]/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must contain at least one uppercase letter.`,
      );
    }

    if (!/[a-z]/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must contain at least one lowercase letter.`,
      );
    }

    if (!/[0-9]/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must contain at least one digit.`,
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must contain at least one special character.`,
      );
    }

    return new Password(value);
  }
}
