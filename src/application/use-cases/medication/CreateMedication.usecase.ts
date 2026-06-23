import { Medication } from "@domain/entities/Medication";
import { ConflictError } from "@domain/errors/ConflictError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { IMedicationRepository } from "@domain/repositories/IMedicationRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";

interface CreateMedicationInput {
  name: string;
  userId: string;
  dosage?: string | undefined;
}

interface CreateMedicationDeps {
  medicationRepository: IMedicationRepository;
  userRepository: IUserRepository;
}

export class CreateMedicationUseCase {
  constructor(private readonly deps: CreateMedicationDeps) {}

  async execute(input: CreateMedicationInput): Promise<Medication> {
    const { name, userId, dosage } = input;
    const foundUserById = await this.deps.userRepository.findById(userId);

    if (!foundUserById) {
      throw new NotFoundError("User not found");
    }

    const validateUniqueness =
      await this.deps.medicationRepository.findByUserIdAndNameAndDosage(
        userId,
        name,
        dosage,
      );
    if (validateUniqueness) {
      throw new ConflictError("Medication with this name and dosage already exists.");
    }

    const medication = Medication.create({ name, userId, dosage });
    const createdMedication =
      await this.deps.medicationRepository.create(medication);

    return createdMedication;
  }
}
