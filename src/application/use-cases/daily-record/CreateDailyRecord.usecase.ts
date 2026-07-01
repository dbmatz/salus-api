import {
  DailyRecord,
  MedicationLog,
  ParameterEvaluation,
} from "@domain/entities/DailyRecord";
import { ConflictError } from "@domain/errors/ConflictError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { IDailyRecordRepository } from "@domain/repositories/IDailyRecordRepository";
import { IEmotionRepository } from "@domain/repositories/IEmotionRepository";
import { IMedicationRepository } from "@domain/repositories/IMedicationRepository";
import { IParameterRepository } from "@domain/repositories/IParameterRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";

interface CreateDailyRecordInput {
  date: Date;
  userId: string;
  emotionId: string;
  dayDescription?: string;
  medicationLogs?: MedicationLog[];
  parameterEvaluations?: ParameterEvaluation[];
}

interface CreateDailyRecordDeps {
  dailyRecordRepository: IDailyRecordRepository;
  userRepository: IUserRepository;
  medicationRepository: IMedicationRepository;
  parameterRepository: IParameterRepository;
  emotionRepository: IEmotionRepository;
}

export class CreateDailyRecordUseCase {
  constructor(private readonly deps: CreateDailyRecordDeps) {}

  async execute(input: CreateDailyRecordInput): Promise<DailyRecord> {
    const {
      date,
      emotionId,
      userId,
      dayDescription,
      medicationLogs,
      parameterEvaluations,
    } = input;
    const foundUser = await this.deps.userRepository.findById(userId);

    if (!foundUser) {
      throw new NotFoundError("User not found");
    }

    const foundByDateAndUser =
      await this.deps.dailyRecordRepository.findByDateAndUserId(date, userId);
    if (foundByDateAndUser) {
      throw new ConflictError("Record to this date already exists.");
    }

    const foundEmotion = await this.deps.emotionRepository.findById(emotionId);
    if (
      !foundEmotion ||
      foundEmotion.userId !== userId ||
      foundEmotion.isDeleted
    ) {
      throw new NotFoundError("Emotion not found");
    }
    await this.validateMedications(medicationLogs, userId);
    await this.validateParameters(parameterEvaluations, userId);
    const dailyRecord = DailyRecord.create({
      date,
      emotionId,
      userId,
      dayDescription,
      medicationLogs: medicationLogs ?? [],
      parameterEvaluations: parameterEvaluations ?? [],
    });

    const createdDailyRecord =
      await this.deps.dailyRecordRepository.create(dailyRecord);
    return createdDailyRecord;
  }

  private async validateMedications(
    medicationLogs: MedicationLog[] | undefined,
    userId: string,
  ) {
    if (!medicationLogs) return;

    for (const log of medicationLogs) {
      const medication = await this.deps.medicationRepository.findById(
        log.medicationId,
      );
      if (!medication || medication.userId !== userId) {
        throw new NotFoundError("Medication not found");
      }
      if (medication.isDeleted) {
        throw new ConflictError("Medication is deleted and cannot be used.");
      }
    }
  }

  private async validateParameters(
    parametersEvaluation: ParameterEvaluation[] | undefined,
    userId: string,
  ) {
    if (!parametersEvaluation) return;

    for (const param of parametersEvaluation) {
      const parameter = await this.deps.parameterRepository.findById(
        param.parameterId,
      );
      if (!parameter || parameter.userId !== userId) {
        throw new NotFoundError("Parameter not found");
      }
      if (parameter.isDeleted) {
        throw new ConflictError("Parameter is deleted and cannot be used.");
      }
      const value = param.valuationBool ?? param.valuationInt;
      if (value === undefined || value === null) {
        throw new ConflictError("Parameter evaluation must have a value.");
      }
      parameter.type.validateValue(value);
    }
  }
}
