import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { DeleteParameterUseCase } from "@app/use-cases/parameter/DeleteParameter.usecase";
import { InMemoryParameterRepository } from "../../../mocks/InMemoryParameterRepository";
import { createParameter } from "../../../mocks/CreateParameter";

describe("DeleteParameterUseCase", () => {
  let sut: DeleteParameterUseCase;
  let userRepository: InMemoryUserRepository;
  let parameterRepository: InMemoryParameterRepository;

  beforeEach(() => {
    parameterRepository = new InMemoryParameterRepository();
    userRepository = new InMemoryUserRepository();
    sut = new DeleteParameterUseCase({
      parameterRepository,
    });
  });

  describe("execute", () => {
    it("should mark parameter as deleted", async () => {
      const user = await createUser(userRepository);
      const parameter = await createParameter(parameterRepository, user.id);

      await sut.execute({ userId: user.id, parameterId: parameter.id });

      const deleted = await parameterRepository.findById(parameter.id);
      expect(deleted?.isDeleted).toBe(true);
      expect(deleted?.deletedAt).toBeInstanceOf(Date);
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
