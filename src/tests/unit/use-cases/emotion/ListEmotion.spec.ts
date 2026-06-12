import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { InMemoryEmotionRepository } from "../../../mocks/InMemoryEmotionRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ListEmotionUseCase } from "@app/use-cases/emotion/ListEmotion.usecase";
import { createEmotion } from "../../../mocks/CreateEmotion";

describe("ListEmotionUseCase", () => {
  let sut: ListEmotionUseCase;
  let userRepository: InMemoryUserRepository;
  let emotionRepository: InMemoryEmotionRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    emotionRepository = new InMemoryEmotionRepository();
    sut = new ListEmotionUseCase({
      userRepository,
      emotionRepository,
    });
  });

  describe("execute", () => {
    it("should list emotions for a user", async () => {
      const user = await createUser(userRepository);
      await createEmotion(emotionRepository, user.id);

      const emotions = await sut.execute({
        userId: user.id,
      });
      expect(emotions).toBeDefined();
      expect(emotions).toHaveLength(1);
    });

    it("should return all emotions including deleted ones", async () => {
      const user = await createUser(userRepository);
      const emotion = await createEmotion(emotionRepository, user.id, "Happy");
      await createEmotion(emotionRepository, user.id, "Sad");

      emotion.delete();
      await emotionRepository.update(emotion);

      const emotions = await sut.execute({ userId: user.id });

      expect(emotions).toHaveLength(2);
    });

    it("should throw NotFoundError when user does not exist", async () => {
      await expect(
        sut.execute({
          userId: "user.id",
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
