import { User } from "@domain/entities/User";
import { Email } from "@domain/value-objects/Email";
import { PrismaClient } from "@prisma/client";

type PrismaUserRow = Awaited<
  ReturnType<PrismaClient["user"]["findUniqueOrThrow"]>
>;

export class UserMapper {
  static toDomain(row: PrismaUserRow): User {
    return User.reconstitute({
      id: row.id,
      name: row.name,
      email: Email.create(row.email),
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? undefined,
      deletedAt: row.deletedAt ?? undefined,
    });
  }

  static toPrismaCreate(user: User) {
    return {
      name: user.name,
      email: user.email.value,
      passwordHash: user.passwordHash,
    };
  }

  static toPrismaUpdate(user: User) {
    return {
      name: user.name,
      email: user.email.value,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? null,
    };
  }
}
