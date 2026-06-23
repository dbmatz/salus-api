import { Medication } from "@domain/entities/Medication";

export interface IMedicationRepository {
  create(medication: Medication): Promise<Medication>;
  findById(medicationId: string): Promise<Medication | null>;
  findByUserIdAndNameAndDosage(
    userId: string,
    name: string,
    dosage: string | undefined,
  ): Promise<Medication | null>;
  update(medication: Medication): Promise<Medication>;
  listByUserId(userId: string): Promise<Medication[]>;
}
