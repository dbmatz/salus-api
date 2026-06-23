import { PrismaClient } from "@prisma/client";
import { IMedicationRepository } from "@domain/repositories/IMedicationRepository";
import { Medication } from "@domain/entities/Medication";
import { MedicationMapper } from "../mappers/MedicationMapper";

export class PrismaMedicationRepository implements IMedicationRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(medication: Medication): Promise<Medication> {
    const created = await this.prisma.medication.create({
      data: MedicationMapper.toPrismaCreate(medication),
    });
    return MedicationMapper.toDomain(created);
  }

  async findById(medicationId: string): Promise<Medication | null> {
    const found = await this.prisma.medication.findUnique({
      where: { id: medicationId },
    });

    return found ? MedicationMapper.toDomain(found) : null;
  }

  async update(medication: Medication): Promise<Medication> {
    const updated = await this.prisma.medication.update({
      where: { id: medication.id },
      data: MedicationMapper.toPrismaUpdate(medication),
    });
    return MedicationMapper.toDomain(updated);
  }

  async listByUserId(userId: string): Promise<Medication[]> {
    const medications = await this.prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return medications.map((medication) =>
      MedicationMapper.toDomain(medication),
    );
  }

  async findByUserIdAndNameAndDosage(
    userId: string,
    name: string,
    dosage: string | undefined,
  ): Promise<Medication | null> {
    const found = await this.prisma.medication.findFirst({
      where: {
        userId,
        name,
        dosage: dosage ?? null,
      },
    });

    return found ? MedicationMapper.toDomain(found) : null;
  }
}
