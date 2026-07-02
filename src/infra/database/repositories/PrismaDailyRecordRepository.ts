import { DailyRecord } from "@domain/entities/DailyRecord";
import { IDailyRecordRepository } from "@domain/repositories/IDailyRecordRepository";
import { PrismaClient } from "@prisma/client";
import { DailyRecordMapper } from "../mappers/DailyRecordMapper";

export class PrismaDailyRecordRepository implements IDailyRecordRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async findByDateAndUserId(
    date: Date,
    userId: string,
  ): Promise<DailyRecord | null> {
    const found = await this.prisma.dailyRecord.findUnique({
      where: { userId_date: { userId, date } },
      include: {
        medicationLogs: true,
        parameterEvaluations: true,
      },
    });
    return found ? DailyRecordMapper.toDomain(found) : null;
  }

  async create(dailyRecord: DailyRecord): Promise<DailyRecord> {
    await this.prisma.$transaction(async (tx) => {
      await tx.dailyRecord.create({
        data: DailyRecordMapper.toPrismaCreate(dailyRecord),
      });

      if (dailyRecord.medicationLogs.length > 0) {
        await tx.medicationLog.createMany({
          data: dailyRecord.medicationLogs.map((log) => ({
            dailyRecordId: dailyRecord.id,
            medicationId: log.medicationId,
            status: log.status,
          })),
        });
      }

      if (dailyRecord.parameterEvaluations.length > 0) {
        await tx.parameterEvaluation.createMany({
          data: dailyRecord.parameterEvaluations.map((evaluation) => ({
            dailyRecordId: dailyRecord.id,
            parameterId: evaluation.parameterId,
            valuationBool: evaluation.valuationBool ?? null,
            valuationInt: evaluation.valuationInt ?? null,
          })),
        });
      }
    });

    const created = await this.prisma.dailyRecord.findUniqueOrThrow({
      where: { id: dailyRecord.id },
      include: {
        medicationLogs: true,
        parameterEvaluations: true,
      },
    });

    return DailyRecordMapper.toDomain(created);
  }

  async listByUserAndMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<{ id: string; date: Date }[]> {
    const firstDay = new Date(Date.UTC(year, month - 1, 1));
    const lastDay = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const records = await this.prisma.dailyRecord.findMany({
      where: {
        userId,
        date: { gte: firstDay, lte: lastDay },
      },
      select: {
        id: true,
        date: true,
      },
      orderBy: { date: "asc" },
    });
    return records;
  }
}
