import { Emotion } from "@domain/entities/Emotion";

export interface IEmotionRepository {
  create(emotion: Emotion): Promise<Emotion>;
  findById(emotionId: string): Promise<Emotion | null>;
  update(emotion: Emotion): Promise<Emotion>;
  listByUserId(userId: string): Promise<Emotion[]>
  findByUserIdAndName(userId: string, name: string): Promise<Emotion | null>
}
