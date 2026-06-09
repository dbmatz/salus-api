import { DomainError } from "@domain/errors/DomainError";
import { Email } from "@domain/value-objects/Email";
import { randomUUID } from "node:crypto";

interface UserProps {
  id?: string;
  name: string;
  email: Email;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
  deletedAt?: Date | undefined;
}

export class User {
  private readonly _id: string;
  private _name: string;
  private _email: Email;
  private _passwordHash: string;
  private readonly _createdAt: Date;
  private _updatedAt?: Date | undefined;
  private _deletedAt?: Date | undefined;

  private constructor(props: UserProps) {
    this._id = props.id ?? randomUUID();
    this._name = props.name;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt;
  }

  static create(
    props: Omit<UserProps, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ): User {
    const nameParts = props.name.trim().split(/\s+/);

    if (nameParts.length < 2) {
      throw new DomainError(
        "Name must contain at least a first name and a last name.",
      );
    }

    if (nameParts.some((part) => part.length < 2)) {
      throw new DomainError(
        "Name and last name must be at least 2 characters each.",
      );
    }
    return new User(props);
  }

  static reconstitute(props: {
    id: string;
    name: string;
    email: Email;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date | undefined;
    deletedAt: Date | undefined;
  }): User {
    return new User(props);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
  get email(): Email {
    return this._email;
  }
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }
  get isDeleted(): boolean {
    return this._deletedAt !== undefined;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }

  updateName(name: string): void {
    const nameParts = name.trim().split(/\s+/);

    if (nameParts.length < 2) {
      throw new DomainError(
        "Name must contain at least a first name and a last name.",
      );
    }

    if (nameParts.some((part) => part.length < 2)) {
      throw new DomainError(
        "Name and last name must be at least 2 characters each.",
      );
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateEmail(email: Email): void {
    this._email = email;
    this._updatedAt = new Date();
  }

  delete(): void {
    if (this.isDeleted) {
      throw new DomainError("User already deleted.");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }
}
