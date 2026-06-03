import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { PrismaClient } from "@prisma/client/extension";
import { UserMapper } from "../mappers/UserMapper";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email.value,
        passwordHash: user.passwordHash,
      },
    });
    return UserMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.prisma.user.findUnique({
      where: { email },
    });

    return found ? UserMapper.toDomain(found) : null;
  }
}
