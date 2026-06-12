import { DomainError } from "@domain/errors/DomainError";
import { randomUUID } from "node:crypto";

interface EmotionProps {
  id?: string;
  name: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
  deletedAt?: Date | undefined;
}

export class Emotion {
  private readonly _id: string;
  private _name: string;
  private _deletedAt?: Date | undefined;
  private readonly _userId: string;
  private readonly _createdAt: Date;
  private _updatedAt?: Date | undefined;

  private constructor(props: EmotionProps) {
    this._id = props.id ?? randomUUID();
    this._name = props.name;
    this._createdAt = props.createdAt ?? new Date();
    this._deletedAt = props.deletedAt;
    this._userId = props.userId;
  }

  static create(
    props: Omit<EmotionProps, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ) {
    if (props.name.trim().length < 3) {
      throw new DomainError("Name must contain at least three letters.");
    }

    return new Emotion(props);
  }

  static reconstitute(props: {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date | undefined;
    deletedAt: Date | undefined;
  }): Emotion {
    return new Emotion(props);
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get userId(): string {
    return this._userId;
  }
  get createdAt(): Date {
    return this._createdAt;
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

  updateName(name: string): void {
    if (name.trim().length < 3) {
      throw new DomainError("Name must contain at least three letters.");
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  delete(): void {
    if (this.isDeleted) {
      throw new DomainError("Emotion already deleted.");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    if (!this.isDeleted) {
      throw new DomainError("Emotion is not deleted.");
    }
    this._deletedAt = undefined;
    this._updatedAt = new Date();
  }
}
