import { Medication } from "@domain/entities/Medication";
import { PrismaClient } from "@prisma/client";

type PrismaMedicationRow = Awaited<
  ReturnType<PrismaClient["medication"]["findUniqueOrThrow"]>
>;

export class MedicationMapper {
  static toDomain(row: PrismaMedicationRow): Medication {
    return Medication.reconstitute({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? undefined,
      deletedAt: row.deletedAt ?? undefined,
      userId: row.userId,
      dosage: row.dosage ?? undefined,
    });
  }

  static toPrismaCreate(medication: Medication) {
    return {
      id: medication.id,
      name: medication.name,
      userId: medication.userId,
      dosage: medication.dosage ?? null,
    };
  }

  static toPrismaUpdate(medication: Medication) {
    return {
      name: medication.name,
      updatedAt: medication.updatedAt ?? new Date(),
      deletedAt: medication.deletedAt ?? null,
      dosage: medication.dosage ?? null,
    };
  }
}
