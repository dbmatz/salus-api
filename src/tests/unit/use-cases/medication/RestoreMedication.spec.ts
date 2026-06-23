import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { RestoreMedicationUseCase } from "@app/use-cases/medication/RestoreMedication.usecase";
import { InMemoryMedicationRepository } from "../../../mocks/InMemoryMedicationRepository";
import { createMedication } from "../../../mocks/CreateMedication";

describe("RestoreMedicationUseCase", () => {
  let sut: RestoreMedicationUseCase;
  let userRepository: InMemoryUserRepository;
  let medicationRepository: InMemoryMedicationRepository;

  beforeEach(() => {
    medicationRepository = new InMemoryMedicationRepository();
    userRepository = new InMemoryUserRepository();
    sut = new RestoreMedicationUseCase({
      medicationRepository,
    });
  });

  describe("execute", () => {
    it("should restore an medication successfully", async () => {
      const user = await createUser(userRepository);
      const medication = await createMedication(medicationRepository, user.id);

      medication.delete();
      await medicationRepository.update(medication);

      await sut.execute({
        userId: user.id,
        medicationId: medication.id,
      });

      const restored = await medicationRepository.findById(medication.id);
      expect(restored?.isDeleted).toBe(false);
      expect(restored?.deletedAt).toBeUndefined();
    });

    it("should throw NotFoundError when medication does not exist", async () => {
      const user = await createUser(userRepository);
      await expect(
        sut.execute({
          userId: user.id,
          medicationId: "medication.id",
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError when medication belongs to another user", async () => {
      const user = await createUser(userRepository);
      const medication = await createMedication(medicationRepository, user.id);
      const userTwo = await createUser(userRepository);
      await expect(
        sut.execute({
          userId: userTwo.id,
          medicationId: medication.id,
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
