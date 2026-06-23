import { Medication } from "@domain/entities/Medication";
import { IMedicationRepository } from "@domain/repositories/IMedicationRepository";

export class InMemoryMedicationRepository implements IMedicationRepository {
  public items: Medication[] = [];

  async create(medication: Medication): Promise<Medication> {
    this.items.push(medication);
    return medication;
  }

  async findById(id: string): Promise<Medication | null> {
    return this.items.find((e) => e.id === id) ?? null;
  }

  async findByUserIdAndNameAndDosage(
    userId: string,
    name: string,
    dosage: string | undefined,
  ): Promise<Medication | null> {
    return (
      this.items.find(
        (e) => e.userId === userId && e.name === name && e.dosage == dosage,
      ) ?? null
    );
  }

  async update(medication: Medication): Promise<Medication> {
    const index = this.items.findIndex((e) => e.id === medication.id);
    if (index >= 0) {
      this.items[index] = medication;
    }
    return medication;
  }

  async listByUserId(userId: string): Promise<Medication[]> {
    return this.items.filter((e) => e.userId === userId);
  }
}
