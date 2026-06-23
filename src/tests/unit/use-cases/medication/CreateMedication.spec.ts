import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { ConflictError } from "@domain/errors/ConflictError";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { CreateMedicationUseCase } from "@app/use-cases/medication/CreateMedication.usecase";
import { InMemoryMedicationRepository } from "../../../mocks/InMemoryMedicationRepository";

describe("CreateMedicationUseCase", () => {
  let sut: CreateMedicationUseCase;
  let userRepository: InMemoryUserRepository;
  let medicationRepository: InMemoryMedicationRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    medicationRepository = new InMemoryMedicationRepository();
    sut = new CreateMedicationUseCase({
      userRepository,
      medicationRepository,
    });
  });

  describe("execute", () => {
    it("should create an medication with no dosage successfully", async () => {
      const user = await createUser(userRepository);

      const medication = await sut.execute({
        name: "Valium",
        userId: user.id,
      });
      expect(medication).toBeDefined();
      expect(medication.name).toBe("Valium");
      expect(medication.userId).toBe(user.id);
      expect(medication.dosage).toBeUndefined();
    });

    it("should create an medication with dosage successfully", async () => {
      const user = await createUser(userRepository);

      const medication = await sut.execute({
        name: "Valium",
        userId: user.id,
        dosage: "60mg",
      });
      expect(medication).toBeDefined();
      expect(medication.name).toBe("Valium");
      expect(medication.userId).toBe(user.id);
      expect(medication.dosage).toBe("60mg");
    });

    it("should throw NotFoundError when user does not exist", async () => {
      await expect(
        sut.execute({
          name: "Valium",
          userId: "user.id",
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError when medication name and dosage already exists", async () => {
      const user = await createUser(userRepository);

      await sut.execute({
        name: "Valium",
        userId: user.id,
        dosage: "20mg",
      });
      await expect(
        sut.execute({
          name: "Valium",
          userId: user.id,
          dosage: "20mg",
        }),
      ).rejects.toThrow(ConflictError);
    });

    it("should allow same medication name with different dosages", async () => {
      const user = await createUser(userRepository);

      await sut.execute({ name: "Valium", userId: user.id, dosage: "20mg" });

      const medication = await sut.execute({
        name: "Valium",
        userId: user.id,
        dosage: "40mg",
      });

      expect(medication).toBeDefined();
      expect(medication.dosage).toBe("40mg");
    });
  });
});
