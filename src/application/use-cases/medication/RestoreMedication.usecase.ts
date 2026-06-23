import { NotFoundError } from "@domain/errors/NotFoundError";
import { IMedicationRepository } from "@domain/repositories/IMedicationRepository";

interface RestoreMedicationInput {
  medicationId: string;
  userId: string;
}

interface RestoreMedicationDeps {
  medicationRepository: IMedicationRepository;
}

export class RestoreMedicationUseCase {
  constructor(private readonly deps: RestoreMedicationDeps) {}

  async execute(input: RestoreMedicationInput): Promise<void> {
    const { medicationId, userId } = input;
    const foundMedicationById =
      await this.deps.medicationRepository.findById(medicationId);

    if (!foundMedicationById) {
      throw new NotFoundError("Medication not found");
    }

    if (foundMedicationById.userId !== userId) {
      throw new NotFoundError("Medication not found");
    }

    foundMedicationById.restore();
    await this.deps.medicationRepository.update(foundMedicationById);
  }
}
