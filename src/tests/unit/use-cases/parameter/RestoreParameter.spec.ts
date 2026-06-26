import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { RestoreParameterUseCase } from "@app/use-cases/parameter/RestoreParameter.usecase";
import { InMemoryParameterRepository } from "../../../mocks/InMemoryParameterRepository";
import { createParameter } from "../../../mocks/CreateParameter";

describe("RestoreParameterUseCase", () => {
  let sut: RestoreParameterUseCase;
  let userRepository: InMemoryUserRepository;
  let parameterRepository: InMemoryParameterRepository;

  beforeEach(() => {
    parameterRepository = new InMemoryParameterRepository();
    userRepository = new InMemoryUserRepository();
    sut = new RestoreParameterUseCase({
      parameterRepository,
    });
  });

  describe("execute", () => {
    it("should restore an parameter successfully", async () => {
      const user = await createUser(userRepository);
      const parameter = await createParameter(parameterRepository, user.id);

      parameter.delete();
      await parameterRepository.update(parameter);

      await sut.execute({
        userId: user.id,
        parameterId: parameter.id,
      });

      const restored = await parameterRepository.findById(parameter.id);
      expect(restored?.isDeleted).toBe(false);
      expect(restored?.deletedAt).toBeUndefined();
    });

    it("should throw NotFoundError when parameter does not exist", async () => {
      const user = await createUser(userRepository);
      await expect(
        sut.execute({
          userId: user.id,
          parameterId: "parameter.id",
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when parameter belongs to another user", async () => {
      const user = await createUser(userRepository);
      const parameter = await createParameter(parameterRepository, user.id);
      const userTwo = await createUser(userRepository);
      await expect(
        sut.execute({
          userId: userTwo.id,
          parameterId: parameter.id,
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
