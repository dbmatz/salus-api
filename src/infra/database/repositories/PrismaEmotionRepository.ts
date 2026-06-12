import { PrismaClient } from "@prisma/client";
import { IEmotionRepository } from "@domain/repositories/IEmotionRepository";
import { Emotion } from "@domain/entities/Emotion";
import { EmotionMapper } from "../mappers/EmotionMapper";

export class PrismaEmotionRepository implements IEmotionRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(emotion: Emotion): Promise<Emotion> {
    const created = await this.prisma.emotion.create({
      data: EmotionMapper.toPrismaCreate(emotion),
    });
    return EmotionMapper.toDomain(created);
  }

  async findById(emotionId: string): Promise<Emotion | null> {
    const found = await this.prisma.emotion.findUnique({
      where: { id: emotionId },
    });

    return found ? EmotionMapper.toDomain(found) : null;
  }

  async update(emotion: Emotion): Promise<Emotion> {
    const updated = await this.prisma.emotion.update({
      where: { id: emotion.id },
      data: EmotionMapper.toPrismaUpdate(emotion),
    });
    return EmotionMapper.toDomain(updated);
  }

  async listByUserId(userId: string): Promise<Emotion[]> {
    const emotions = await this.prisma.emotion.findMany({
      where: { userId },
    });

    return emotions.map((emotion) => EmotionMapper.toDomain(emotion));
  }

  async findByUserIdAndName(
    userId: string,
    name: string,
  ): Promise<Emotion | null> {
    const found = await this.prisma.emotion.findUnique({
      where: { userId_name: { userId, name } },
    });

    return found ? EmotionMapper.toDomain(found) : null;
  }
}
