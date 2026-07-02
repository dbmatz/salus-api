import { DailyRecord } from "@domain/entities/DailyRecord";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { IDailyRecordRepository } from "@domain/repositories/IDailyRecordRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";

interface ListDailyRecordByMonthInput {
  userId: string;
  month: number;
  year: number;
}

interface ListDailyRecordByMonthDeps {
  userRepository: IUserRepository;
  dailyRecordRepository: IDailyRecordRepository;
}

export class ListDailyRecordByMonthUseCase {
  constructor(private readonly deps: ListDailyRecordByMonthDeps) {}

  async execute(
    input: ListDailyRecordByMonthInput,
  ): Promise<{ id: string; date: Date }[]> {
    const { month, userId, year } = input;

    const foundUser = await this.deps.userRepository.findById(userId);
    if (!foundUser) {
      throw new NotFoundError("User not found");
    }

    const foundDailyRecords =
      await this.deps.dailyRecordRepository.listByUserAndMonth(
        userId,
        month,
        year,
      );

    return foundDailyRecords;
  }
}
