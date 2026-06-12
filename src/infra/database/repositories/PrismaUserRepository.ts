import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserMapper } from "../mappers/UserMapper";
import { PrismaClient } from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: UserMapper.toPrismaCreate(user),
    });
    return UserMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.prisma.user.findUnique({
      where: { email },
    });

    return found ? UserMapper.toDomain(found) : null;
  }

  async findById(userId: string): Promise<User | null> {
    const found = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return found ? UserMapper.toDomain(found) : null;
  }
}
