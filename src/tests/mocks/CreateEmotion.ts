import { InMemoryEmotionRepository } from "./InMemoryEmotionRepository";
import { Emotion } from "@domain/entities/Emotion";

export async function createEmotion(
  repo: InMemoryEmotionRepository,
  userId: string,
  emotionName: string = "Happy",
) {
  const emotion = Emotion.create({
    name: emotionName,
    userId,
  });
  await repo.create(emotion);
  return emotion;
}
