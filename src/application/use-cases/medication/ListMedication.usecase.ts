import { Medication } from "@domain/entities/Medication";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { IMedicationRepository } from "@domain/repositories/IMedicationRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";

interface ListMedicationInput {
  userId: string;
}

interface ListMedicationDeps {
  medicationRepository: IMedicationRepository;
  userRepository: IUserRepository;
}

export class ListMedicationUseCase {
  constructor(private readonly deps: ListMedicationDeps) {}

  async execute(input: ListMedicationInput): Promise<Medication[]> {
    const { userId } = input;
    const foundUserById = await this.deps.userRepository.findById(userId);

    if (!foundUserById) {
      throw new NotFoundError("User not found");
    }

    return await this.deps.medicationRepository.listByUserId(userId);
  }
}
