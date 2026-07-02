import { NotFoundError } from "@domain/errors/NotFoundError";
import { IMedicationRepository } from "@domain/repositories/IMedicationRepository";

interface DeleteMedicationInput {
  medicationId: string;
  userId: string;
}

interface DeleteMedicationDeps {
  medicationRepository: IMedicationRepository;
}

export class DeleteMedicationUseCase {
  constructor(private readonly deps: DeleteMedicationDeps) {}

  async execute(input: DeleteMedicationInput): Promise<void> {
    const { medicationId, userId } = input;
    const foundMedicationById =
      await this.deps.medicationRepository.findById(medicationId);

    if (!foundMedicationById) {
      throw new NotFoundError("Medication not found");
    }

    if (foundMedicationById.userId !== userId) {
      throw new NotFoundError("Medication not found");
    }

    foundMedicationById.delete();
    await this.deps.medicationRepository.update(foundMedicationById);
  }
}
