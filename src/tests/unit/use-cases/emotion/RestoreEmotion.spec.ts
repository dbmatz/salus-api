import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { InMemoryEmotionRepository } from "../../../mocks/InMemoryEmotionRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { createEmotion } from "../../../mocks/CreateEmotion";
import { RestoreEmotionUseCase } from "@app/use-cases/emotion/RestoreEmotion.usecase";

describe("RestoreEmotionUseCase", () => {
  let sut: RestoreEmotionUseCase;
  let userRepository: InMemoryUserRepository;
  let emotionRepository: InMemoryEmotionRepository;

  beforeEach(() => {
    emotionRepository = new InMemoryEmotionRepository();
    userRepository = new InMemoryUserRepository();
    sut = new RestoreEmotionUseCase({
      emotionRepository,
    });
  });

  describe("execute", () => {
    it("should restore an emotion successfully", async () => {
      const user = await createUser(userRepository);
      const emotion = await createEmotion(emotionRepository, user.id);

      emotion.delete();
      await emotionRepository.update(emotion);

      await sut.execute({
        userId: user.id,
        emotionId: emotion.id,
      });

      const restored = await emotionRepository.findById(emotion.id);
      expect(restored?.isDeleted).toBeFalsy();
      expect(restored?.deletedAt).toBeUndefined();
    });

    it("should throw NotFoundError when emotion does not exist", async () => {
      const user = await createUser(userRepository);
      await expect(
        sut.execute({
          userId: user.id,
          emotionId: "emotion.id",
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when emotion belongs to another user", async () => {
      const user = await createUser(userRepository);
      const emotion = await createEmotion(emotionRepository, user.id);
      const userTwo = await createUser(userRepository);
      await expect(
        sut.execute({
          userId: userTwo.id,
          emotionId: emotion.id,
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
