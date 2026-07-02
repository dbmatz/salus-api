import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../mocks/InMemoryUserRepository";
import { createUser } from "../../../mocks/CreateUser";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ListMedicationUseCase } from "@app/use-cases/medication/ListMedication.usecase";
import { InMemoryMedicationRepository } from "../../../mocks/InMemoryMedicationRepository";
import { createMedication } from "../../../mocks/CreateMedication";

describe("ListMedicationUseCase", () => {
  let sut: ListMedicationUseCase;
  let userRepository: InMemoryUserRepository;
  let medicationRepository: InMemoryMedicationRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    medicationRepository = new InMemoryMedicationRepository();
    sut = new ListMedicationUseCase({
      userRepository,
      medicationRepository,
    });
  });

  describe("execute", () => {
    it("should list medications for a user", async () => {
      const user = await createUser(userRepository);
      await createMedication(medicationRepository, user.id);

      const medications = await sut.execute({
        userId: user.id,
      });
      expect(medications).toBeDefined();
      expect(medications).toHaveLength(1);
    });

    it("should return all medications including deleted ones", async () => {
      const user = await createUser(userRepository);
      const medication = await createMedication(medicationRepository, user.id);
      await createMedication(medicationRepository, user.id, "Rivotril");

      medication.delete();
      await medicationRepository.update(medication);

      const medications = await sut.execute({ userId: user.id });

      expect(medications).toHaveLength(2);
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
