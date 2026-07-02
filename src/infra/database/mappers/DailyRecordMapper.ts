import {
  DailyRecord,
  MedicationLog,
  MedicationStatus,
  ParameterEvaluation,
} from "@domain/entities/DailyRecord";
import { PrismaClient } from "@prisma/client";

type PrismaDailyRecordRow = Awaited<
  ReturnType<PrismaClient["dailyRecord"]["findUniqueOrThrow"]>
>;

type PrismaDailyRecordWithRelations = PrismaDailyRecordRow & {
  medicationLogs: {
    medicationId: string;
    status: string;
  }[];
  parameterEvaluations: {
    parameterId: string;
    valuationBool: boolean | null;
    valuationInt: number | null;
  }[];
};

export class DailyRecordMapper {
  static toDomain(row: PrismaDailyRecordWithRelations): DailyRecord {
    return DailyRecord.reconstitute({
      id: row.id,
      createdAt: row.createdAt,
      date: row.date,
      dayDescription: row.dayDescription ?? undefined,
      emotionId: row.emotionId,
      medicationLogs: row.medicationLogs.map(
        (log): MedicationLog => ({
          medicationId: log.medicationId,
          status: log.status as MedicationStatus,
        }),
      ),
      parameterEvaluations: row.parameterEvaluations.map(
        (e): ParameterEvaluation => ({
          parameterId: e.parameterId,
          valuationBool: e.valuationBool ?? undefined,
          valuationInt: e.valuationInt ?? undefined,
        }),
      ),
      updatedAt: row.updatedAt ?? undefined,
      userId: row.userId,
    });
  }

  static toPrismaCreate(dailyRecord: DailyRecord) {
    return {
      id: dailyRecord.id,
      userId: dailyRecord.userId,
      emotionId: dailyRecord.emotionId,
      date: dailyRecord.date,
      dayDescription: dailyRecord.dayDescription ?? null,
      createdAt: dailyRecord.createdAt,
    };
  }

  static toPrismaUpdate(dailyRecord: DailyRecord) {
    return {
      dayDescription: dailyRecord.dayDescription ?? null,
      emotionId: dailyRecord.emotionId,
      updatedAt: dailyRecord.updatedAt,
    };
  }
}
