import { DomainError } from "@domain/errors/DomainError";

export class Email {
  private value;

  private constructor(email: string) {
    this.value = email.toLowerCase().trim();
  }

  static create(value: string): Email {
    if (!value || !/.+@.+\..+/.test(value)) {
      throw new DomainError(`Invalid email: ${value}`);
    }
    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
