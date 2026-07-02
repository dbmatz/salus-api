import { NotFoundError } from "@domain/errors/NotFoundError";
import { IEmotionRepository } from "@domain/repositories/IEmotionRepository";

interface RestoreEmotionInput {
  emotionId: string;
  userId: string;
}

interface RestoreEmotionDeps {
  emotionRepository: IEmotionRepository;
}

export class RestoreEmotionUseCase {
  constructor(private readonly deps: RestoreEmotionDeps) {}

  async execute(input: RestoreEmotionInput): Promise<void> {
    const { emotionId, userId } = input;
    const foundEmotionById =
      await this.deps.emotionRepository.findById(emotionId);

    if (!foundEmotionById) {
      throw new NotFoundError("Emotion not found");
    }

    if (foundEmotionById.userId !== userId) {
      throw new NotFoundError("Emotion not found");
    }

    foundEmotionById.restore();
    await this.deps.emotionRepository.update(foundEmotionById);
  }
}
