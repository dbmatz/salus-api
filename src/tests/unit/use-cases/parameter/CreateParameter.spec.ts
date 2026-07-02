import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { ConflictError } from "@domain/errors/ConflictError";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { CreateParameterUseCase } from "@app/use-cases/parameter/CreateParameter.usecase";
import { InMemoryParameterRepository } from "../../../mocks/InMemoryParameterRepository";

describe("CreateParameterUseCase", () => {
  let sut: CreateParameterUseCase;
  let userRepository: InMemoryUserRepository;
  let parameterRepository: InMemoryParameterRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    parameterRepository = new InMemoryParameterRepository();
    sut = new CreateParameterUseCase({
      userRepository,
      parameterRepository,
    });
  });

  describe("execute", () => {
    it("should create an parameter with type boolean successfully", async () => {
      const user = await createUser(userRepository);

      const parameter = await sut.execute({
        name: "Sleep",
        userId: user.id,
        type: "BOOLEAN",
      });
      expect(parameter).toBeDefined();
      expect(parameter.name).toBe("Sleep");
      expect(parameter.userId).toBe(user.id);
      expect(parameter.type.value).toBe("BOOLEAN");
    });

    it("should create an parameter with type scale successfully", async () => {
      const user = await createUser(userRepository);

      const parameter = await sut.execute({
        name: "Sleep",
        userId: user.id,
        type: "SCALE_1_5",
      });
      expect(parameter).toBeDefined();
      expect(parameter.name).toBe("Sleep");
      expect(parameter.userId).toBe(user.id);
      expect(parameter.type.value).toBe("SCALE_1_5");
    });

    it("should throw NotFoundError when user does not exist", async () => {
      await expect(
        sut.execute({
          name: "Sleep",
          userId: "user.id",
          type: "SCALE_1_5",
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError when parameter name already exists", async () => {
      const user = await createUser(userRepository);

      await sut.execute({
        name: "Sleep",
        userId: user.id,
        type: "SCALE_1_5",
      });
      await expect(
        sut.execute({
          name: "Sleep",
          userId: user.id,
          type: "SCALE_1_5",
        }),
      ).rejects.toThrow(ConflictError);
    });

    it("should not allow same parameter name with different type", async () => {
      const user = await createUser(userRepository);

      await sut.execute({ name: "Sleep", userId: user.id, type: "SCALE_1_5" });

      await expect(
        sut.execute({
          name: "Sleep",
          userId: user.id,
          type: "SCALE_1_10",
        }),
      ).rejects.toThrow(ConflictError);
    });
  });
});
