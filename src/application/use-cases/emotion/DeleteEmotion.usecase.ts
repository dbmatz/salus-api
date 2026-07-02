import { NotFoundError } from "@domain/errors/NotFoundError";
import { IEmotionRepository } from "@domain/repositories/IEmotionRepository";

interface DeleteEmotionInput {
  emotionId: string;
  userId: string;
}

interface DeleteEmotionDeps {
  emotionRepository: IEmotionRepository;
}

export class DeleteEmotionUseCase {
  constructor(private readonly deps: DeleteEmotionDeps) {}

  async execute(input: DeleteEmotionInput): Promise<void> {
    const { emotionId, userId } = input;
    const foundEmotionById =
      await this.deps.emotionRepository.findById(emotionId);

    if (!foundEmotionById) {
      throw new NotFoundError("Emotion not found");
    }

    if (foundEmotionById.userId !== userId) {
      throw new NotFoundError("Emotion not found");
    }

    foundEmotionById.delete();
    await this.deps.emotionRepository.update(foundEmotionById);
  }
}
