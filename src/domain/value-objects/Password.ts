import { DomainError } from "@domain/errors/DomainError";

export class Password {
  readonly value: string;

  private constructor(password: string) {
    this.value = password;
  }

  static create(value: string): Password {
    if (!value || value.length < 8) {
      throw new DomainError(
        `Invalid password. Password must be at least 8 characters long.`,
        "PASSWORD_TOO_SHORT",
      );
    }

    if (/\s/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must not contain whitespace.`,
        "PASSWORD_CONTAINS_WHITESPACE",
      );
    }

    if (!/[A-Z]/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must contain at least one uppercase letter.`,
        "PASSWORD_MISSING_UPPERCASE",
      );
    }

    if (!/[a-z]/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must contain at least one lowercase letter.`,
        "PASSWORD_MISSING_LOWERCASE",
      );
    }

    if (!/[0-9]/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must contain at least one digit.`,
        "PASSWORD_MISSING_DIGIT",
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      throw new DomainError(
        `Invalid password. Password must contain at least one special character.`,
        "PASSWORD_MISSING_SPECIAL_CHARACTER",
      );
    }

    return new Password(value);
  }
}
