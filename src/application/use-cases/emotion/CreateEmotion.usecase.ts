import { Emotion } from "@domain/entities/Emotion";
import { ConflictError } from "@domain/errors/ConflictError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { IEmotionRepository } from "@domain/repositories/IEmotionRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";

interface CreateEmotionInput {
  name: string;
  userId: string;
}

interface CreateEmotionDeps {
  emotionRepository: IEmotionRepository;
  userRepository: IUserRepository;
}

export class CreateEmotionUseCase {
  constructor(private readonly deps: CreateEmotionDeps) {}

  async execute(input: CreateEmotionInput): Promise<Emotion> {
    const { name, userId } = input;
    const foundUserById = await this.deps.userRepository.findById(userId);

    if (!foundUserById) {
      throw new NotFoundError("User not found");
    }

    const validateUniqueness =
      await this.deps.emotionRepository.findByUserIdAndName(userId, name);
    if (validateUniqueness) {
      throw new ConflictError("Emotion with this name already exists.");
    }

    const emotion = Emotion.create({ name, userId });
    const createdEmotion = await this.deps.emotionRepository.create(emotion);

    return createdEmotion;
  }
}
