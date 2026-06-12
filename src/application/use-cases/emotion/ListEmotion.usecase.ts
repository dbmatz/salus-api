import { Emotion } from "@domain/entities/Emotion";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { IEmotionRepository } from "@domain/repositories/IEmotionRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";

interface ListEmotionInput {
  userId: string;
}

interface ListEmotionDeps {
  emotionRepository: IEmotionRepository;
  userRepository: IUserRepository;
}

export class ListEmotionUseCase {
  constructor(private readonly deps: ListEmotionDeps) {}

  async execute(input: ListEmotionInput): Promise<Emotion[]> {
    const { userId } = input;
    const foundUserById = await this.deps.userRepository.findById(userId);

    if (!foundUserById) {
      throw new NotFoundError("User not found");
    }

    return await this.deps.emotionRepository.listByUserId(userId);
  }
}
