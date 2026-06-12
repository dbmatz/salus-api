import { Emotion } from "@domain/entities/Emotion";
import { IEmotionRepository } from "@domain/repositories/IEmotionRepository";

export class InMemoryEmotionRepository implements IEmotionRepository {
  public items: Emotion[] = [];

  async create(emotion: Emotion): Promise<Emotion> {
    this.items.push(emotion);
    return emotion;
  }

  async findById(id: string): Promise<Emotion | null> {
    return this.items.find((e) => e.id === id) ?? null;
  }

  async findByUserIdAndName(
    userId: string,
    name: string,
  ): Promise<Emotion | null> {
    return (
      this.items.find((e) => e.userId === userId && e.name === name) ?? null
    );
  }

  async listByUserId(userId: string): Promise<Emotion[]> {
    return this.items.filter((e) => e.userId === userId);
  }

  async update(emotion: Emotion): Promise<Emotion> {
    const index = this.items.findIndex((e) => e.id === emotion.id);
    if (index >= 0) {
      this.items[index] = emotion;
    }
    return emotion;
  }
}
