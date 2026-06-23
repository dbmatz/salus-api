import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { DeleteMedicationUseCase } from "@app/use-cases/medication/DeleteMedication.usecase";
import { InMemoryMedicationRepository } from "../../../mocks/InMemoryMedicationRepository";
import { createMedication } from "../../../mocks/CreateMedication";

describe("DeleteMedicationUseCase", () => {
  let sut: DeleteMedicationUseCase;
  let userRepository: InMemoryUserRepository;
  let medicationRepository: InMemoryMedicationRepository;

  beforeEach(() => {
    medicationRepository = new InMemoryMedicationRepository();
    userRepository = new InMemoryUserRepository();
    sut = new DeleteMedicationUseCase({
      medicationRepository,
    });
  });

  describe("execute", () => {
    it("should delete an medication successfully", async () => {
      const user = await createUser(userRepository);
      const medication = await createMedication(medicationRepository, user.id);

      const deleteMedication = await sut.execute({
        userId: user.id,
        medicationId: medication.id,
      });
      expect(deleteMedication).toBeUndefined();
    });
    
    it("should mark medication as deleted", async () => {
      const user = await createUser(userRepository);
      const medication = await createMedication(medicationRepository, user.id);

      await sut.execute({ userId: user.id, medicationId: medication.id });

      const deleted = await medicationRepository.findById(medication.id);
      expect(deleted?.isDeleted).toBe(true);
      expect(deleted?.deletedAt).toBeInstanceOf(Date);
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
