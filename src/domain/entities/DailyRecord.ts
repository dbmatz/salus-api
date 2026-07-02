import { randomUUID } from "node:crypto";
import { DomainError } from "../errors/DomainError";

export type MedicationStatus = "TAKEN" | "NOT_TAKEN" | "SKIPPED";

export interface MedicationLog {
  medicationId: string;
  status: MedicationStatus;
}

export interface ParameterEvaluation {
  parameterId: string;
  valuationBool: boolean | undefined;
  valuationInt: number | undefined;
}

interface DailyRecordProps {
  id?: string;
  userId: string;
  emotionId: string;
  date: Date;
  dayDescription?: string | undefined;
  medicationLogs?: MedicationLog[];
  parameterEvaluations?: ParameterEvaluation[];
  createdAt?: Date;
  updatedAt?: Date | undefined;
}

export class DailyRecord {
  private readonly _id: string;
  private readonly _userId: string;
  private _emotionId: string;
  private readonly _date: Date;
  private _dayDescription: string | undefined;
  private _medicationLogs: MedicationLog[];
  private _parameterEvaluations: ParameterEvaluation[];
  private readonly _createdAt: Date;
  private _updatedAt: Date | undefined;

  private constructor(props: DailyRecordProps) {
    this._id = props.id ?? randomUUID();
    this._userId = props.userId;
    this._emotionId = props.emotionId;
    this._date = props.date;
    this._dayDescription = props.dayDescription;
    this._medicationLogs = props.medicationLogs ?? [];
    this._parameterEvaluations = props.parameterEvaluations ?? [];
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<DailyRecordProps, "id" | "createdAt" | "updatedAt">,
  ): DailyRecord {
    if (props.date > new Date()) {
      throw new DomainError("Cannot create a record for a future date.");
    }
    return new DailyRecord(props);
  }

  static reconstitute(props: {
    id: string;
    userId: string;
    emotionId: string;
    date: Date;
    dayDescription: string | undefined;
    medicationLogs: MedicationLog[];
    parameterEvaluations: ParameterEvaluation[];
    createdAt: Date;
    updatedAt: Date | undefined;
  }): DailyRecord {
    return new DailyRecord(props);
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get emotionId(): string {
    return this._emotionId;
  }
  get date(): Date {
    return this._date;
  }
  get dayDescription(): string | undefined {
    return this._dayDescription;
  }
  get medicationLogs(): MedicationLog[] {
    return this._medicationLogs;
  }
  get parameterEvaluations(): ParameterEvaluation[] {
    return this._parameterEvaluations;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  updateEmotion(emotionId: string): void {
    this._emotionId = emotionId;
    this._updatedAt = new Date();
  }

  updateDayDescription(description: string | undefined): void {
    this._dayDescription = description;
    this._updatedAt = new Date();
  }

  updateMedicationLogs(logs: MedicationLog[]): void {
    this._medicationLogs = logs;
    this._updatedAt = new Date();
  }

  updateParameterEvaluations(evaluations: ParameterEvaluation[]): void {
    this._parameterEvaluations = evaluations;
    this._updatedAt = new Date();
  }
}
