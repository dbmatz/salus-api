import { Emotion } from "@domain/entities/Emotion";
import { PrismaClient } from "@prisma/client";

type PrismaEmotionRow = Awaited<
  ReturnType<PrismaClient["emotion"]["findUniqueOrThrow"]>
>;

export class EmotionMapper {
  static toDomain(row: PrismaEmotionRow): Emotion {
    return Emotion.reconstitute({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? undefined,
      deletedAt: row.deletedAt ?? undefined,
      userId: row.userId,
    });
  }

  static toPrismaCreate(emotion: Emotion) {
    return {
      name: emotion.name,
      userId: emotion.userId,
    };
  }

  static toPrismaUpdate(emotion: Emotion) {
    return {
      name: emotion.name,
      updatedAt: emotion.updatedAt ?? new Date(),
      deletedAt: emotion.deletedAt ?? null,
    };
  }
}
