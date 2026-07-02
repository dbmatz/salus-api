import { InMemoryMedicationRepository } from "./InMemoryMedicationRepository";
import { Medication } from "@domain/entities/Medication";

export async function createMedication(
  repo: InMemoryMedicationRepository,
  userId: string,
  medicationName: string = "Valium",
  dosage: string | undefined = undefined,
) {
  const medication = Medication.create({
    name: medicationName,
    userId,
    dosage,
  });
  await repo.create(medication);
  return medication;
}
