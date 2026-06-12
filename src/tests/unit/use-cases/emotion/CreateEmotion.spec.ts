import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { ConflictError } from "@domain/errors/ConflictError";
import { CreateEmotionUseCase } from "@app/use-cases/emotion/CreateEmotion.usecase";
import { InMemoryEmotionRepository } from "../../../mocks/InMemoryEmotionRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";

describe("CreateEmotionUseCase", () => {
  let sut: CreateEmotionUseCase;
  let userRepository: InMemoryUserRepository;
  let emotionRepository: InMemoryEmotionRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    emotionRepository = new InMemoryEmotionRepository();
    sut = new CreateEmotionUseCase({
      userRepository,
      emotionRepository,
    });
  });

  describe("execute", () => {
    it("should create an emotion successfully", async () => {
      const user = await createUser(userRepository);

      const emotion = await sut.execute({
        name: "Happy",
        userId: user.id,
      });
      expect(emotion).toBeDefined();
      expect(emotion.name).toBe("Happy");
      expect(emotion.userId).toBe(user.id);
    });

    it("should throw NotFoundError when user does not exist", async () => {
      await expect(
        sut.execute({
          name: "Happy",
          userId: "user.id",
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError when emotion name already exists", async () => {
      const user = await createUser(userRepository);

      await sut.execute({
        name: "Happy",
        userId: user.id,
      });
      await expect(
        sut.execute({
          name: "Happy",
          userId: user.id,
        }),
      ).rejects.toThrow(ConflictError);
    });
  });
});
