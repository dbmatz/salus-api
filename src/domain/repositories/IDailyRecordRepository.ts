import { DailyRecord } from "@domain/entities/DailyRecord";

export interface IDailyRecordRepository {
  findByDateAndUserId(date: Date, userId: string): Promise<DailyRecord | null>;
  create(dailyRecord: DailyRecord): Promise<DailyRecord>;
  listByUserAndMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<{ id: string; date: Date }[]>;
}
