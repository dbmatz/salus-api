import { describe, it, expect, beforeEach } from "vitest";
import { RegisterUserUseCase } from "@app/use-cases/auth/RegisterUser.usecase";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { FakeHashingService } from "../../../mocks/FakeHashingService";
import { ConflictError } from "@domain/errors/ConflictError";

describe("RegisterUserUseCase", () => {
  let sut: RegisterUserUseCase;
  let userRepository: InMemoryUserRepository;
  let hashingService: FakeHashingService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashingService = new FakeHashingService();
    sut = new RegisterUserUseCase({
      userRepository,
      hashingService,
    });
  });

  describe("execute", () => {
    it("should register a new user", async () => {
      const result = await sut.execute({
        name: "John Doe",
        email: "john@email.com",
        password: "Senh@123",
        birthDate: new Date("1990-01-01"),
      });
      expect(result).toBe(undefined);
    });

    it("should save a new user", async () => {
      await sut.execute({
        name: "John Doe",
        email: "john@email.com",
        password: "Senh@123",
        birthDate: new Date("1990-01-01"),
      });
      const user = await userRepository.findByEmail("john@email.com");
      expect(user).toBeDefined();
    });

    it("should save user with hashed password", async () => {
      await sut.execute({
        name: "John Doe",
        email: "john@email.com",
        password: "Senh@123",
        birthDate: new Date("1990-01-01"),
      });
      const user = await userRepository.findByEmail("john@email.com");
      expect(user).toBeDefined();
      expect(user?.passwordHash).toBe("hashed:Senh@123");
    });

    it("should throw ConflictError when email already exists", () => {
      expect(async () => {
        await sut.execute({
          name: "John Doe",
          email: "john@email.com",
          password: "Senh@123",
          birthDate: new Date("1990-01-01"),
        });

        await sut.execute({
          name: "John Doe",
          email: "john@email.com",
          password: "Senh@123",
          birthDate: new Date("1990-01-01"),
        });
      }).rejects.toThrow(ConflictError);
    });
  });
});
