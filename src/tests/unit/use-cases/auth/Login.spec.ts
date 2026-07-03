import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { FakeHashingService } from "../../../mocks/FakeHashingService";
import { LoginUseCase } from "@app/use-cases/auth/Login.usecase";
import { IJwtService } from "@domain/services/IJwtService";
import { FakeJwtService } from "../../../mocks/FakeJwtService";
import { RegisterUserUseCase } from "@app/use-cases/auth/RegisterUser.usecase";
import { UnauthorizedError } from "@domain/errors/UnauthorizedError";

describe("LoginUseCase", () => {
  let loginSut: LoginUseCase;
  let registerSut: RegisterUserUseCase;
  let userRepository: InMemoryUserRepository;
  let hashingService: FakeHashingService;
  let jwtService: IJwtService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashingService = new FakeHashingService();
    jwtService = new FakeJwtService();
    loginSut = new LoginUseCase({
      userRepository,
      hashingService,
      jwtService,
    });
    registerSut = new RegisterUserUseCase({
      userRepository,
      hashingService,
    });
  });

  describe("execute", () => {
    it("should return a token with user id as sub", async () => {
      await registerSut.execute({
        name: "John Doe",
        email: "john@email.com",
        password: "Senh@123",
        birthDate: new Date("1990-01-01"),
      });
      const result = await loginSut.execute({
        email: "john@email.com",
        password: "Senh@123",
      });

      const user = await userRepository.findByEmail("john@email.com");
      expect(result.token).toBe(`fake-token:${user?.id}`);
    });

    it("should return a token on successful login", async () => {
      await registerSut.execute({
        name: "John Doe",
        email: "john@email.com",
        password: "Senh@123",
        birthDate: new Date("1990-01-01"),
      });

      const result = await loginSut.execute({
        email: "john@email.com",
        password: "Senh@123",
      });

      expect(result.token).toBeDefined();
    });

    it("should throw UnauthorizedError", async () => {
      await registerSut.execute({
        name: "John Doe",
        email: "john@email.com",
        password: "Senh@123",
        birthDate: new Date("1990-01-01"),
      });

      await expect(
        loginSut.execute({
          email: "john@email.com",
          password: "Senh@1234",
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError when email does not exist", async () => {
      await expect(
        loginSut.execute({
          email: "notfound@email.com",
          password: "Senh@123",
        }),
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
