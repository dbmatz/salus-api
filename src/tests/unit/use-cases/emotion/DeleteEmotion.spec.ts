import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { InMemoryEmotionRepository } from "../../../mocks/InMemoryEmotionRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { createEmotion } from "../../../mocks/CreateEmotion";
import { DeleteEmotionUseCase } from "@app/use-cases/emotion/DeleteEmotion.usecase";

describe("DeleteEmotionUseCase", () => {
  let sut: DeleteEmotionUseCase;
  let userRepository: InMemoryUserRepository;
  let emotionRepository: InMemoryEmotionRepository;

  beforeEach(() => {
    emotionRepository = new InMemoryEmotionRepository();
    userRepository = new InMemoryUserRepository();
    sut = new DeleteEmotionUseCase({
      emotionRepository,
    });
  });

  describe("execute", () => {
    it("should delete an emotion successfully", async () => {
      const user = await createUser(userRepository);
      const emotion = await createEmotion(emotionRepository, user.id);

      const deleteEmotion = await sut.execute({
        userId: user.id,
        emotionId: emotion.id,
      });
      expect(deleteEmotion).toBeUndefined();
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
