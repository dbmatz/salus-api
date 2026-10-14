import { User } from "@domain/entities/User";
import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { Email } from "@domain/value-objects/Email";

let counter = 0;
export async function createUser(repo: InMemoryUserRepository) {
  counter++;
  const user = User.create({
    name: "John Doe",
    email: Email.create(`john${counter}@email.com`),
    passwordHash: "hashed:Senh@123",
    birthDate: new Date("1990-01-01"),
  });
  await repo.create(user);
  return user;
}
