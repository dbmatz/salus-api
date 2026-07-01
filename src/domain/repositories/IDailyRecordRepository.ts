import { DailyRecord } from "@domain/entities/DailyRecord";

export interface IDailyRecordRepository {
  findByDateAndUserId(date: Date, userId: string): Promise<DailyRecord | null>;
  create(dailyRecord: DailyRecord): Promise<DailyRecord>;
}
