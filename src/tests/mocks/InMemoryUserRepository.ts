import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];

  async create(user: User): Promise<User> {
    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((u) => u.email.value === email) ?? null;
  }
}
