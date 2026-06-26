import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ListParameterUseCase } from "@app/use-cases/parameter/ListParameter.usecase";
import { InMemoryParameterRepository } from "../../../mocks/InMemoryParameterRepository";
import { createParameter } from "../../../mocks/CreateParameter";

describe("ListParameterUseCase", () => {
  let sut: ListParameterUseCase;
  let userRepository: InMemoryUserRepository;
  let parameterRepository: InMemoryParameterRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    parameterRepository = new InMemoryParameterRepository();
    sut = new ListParameterUseCase({
      userRepository,
      parameterRepository,
    });
  });

  describe("execute", () => {
    it("should list parameters for a user", async () => {
      const user = await createUser(userRepository);
      await createParameter(parameterRepository, user.id);

      const parameters = await sut.execute({
        userId: user.id,
      });
      expect(parameters).toBeDefined();
      expect(parameters).toHaveLength(1);
    });

    it("should return all parameters including deleted ones", async () => {
      const user = await createUser(userRepository);
      const parameter = await createParameter(parameterRepository, user.id);
      await createParameter(parameterRepository, user.id, "Run");

      parameter.delete();
      await parameterRepository.update(parameter);

      const parameters = await sut.execute({ userId: user.id });

      expect(parameters).toHaveLength(2);
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
