import { describe, expect, it } from "vitest";
import { DomainError } from "@domain/errors/DomainError";
import { DailyRecord } from "@domain/entities/DailyRecord";

function makeValidDailyRecordProps() {
  return {
    userId: "userId",
    emotionId: "emotionId",
    date: new Date(),
    dayDescription: "It was a good day",
    medicationLogs: [],
    parameterEvaluations: [],
  };
}

describe("DailyRecord", () => {
  describe("create", () => {
    it("must create a valid dailyRecord with empty medicationLogs and parameterEvaluations", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      expect(dailyRecord.userId).toBe("userId");
      expect(dailyRecord.emotionId).toBe("emotionId");
      expect(dailyRecord.date).toBeInstanceOf(Date);
      expect(dailyRecord.dayDescription).toBe("It was a good day");
      expect(dailyRecord.medicationLogs).toHaveLength(0);
      expect(dailyRecord.parameterEvaluations).toHaveLength(0);
    });

    it("must create a valid dailyRecord for today", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dailyRecord = DailyRecord.create({
        ...makeValidDailyRecordProps(),
        date: today,
      });
      expect(dailyRecord.date).toBeInstanceOf(Date);
    });

    it("must create a valid dailyRecord with medicationLogs and parameterEvaluations", () => {
      const dailyRecord = DailyRecord.create({
        ...makeValidDailyRecordProps(),
        medicationLogs: [{ medicationId: "medicationId", status: "TAKEN" }],
        parameterEvaluations: [
          {
            parameterId: "parameterId",
            valuationBool: true,
            valuationInt: undefined,
          },
        ],
      });
      expect(dailyRecord.userId).toBe("userId");
      expect(dailyRecord.emotionId).toBe("emotionId");
      expect(dailyRecord.date).toBeInstanceOf(Date);
      expect(dailyRecord.dayDescription).toBe("It was a good day");
      expect(dailyRecord.medicationLogs).toHaveLength(1);
      expect(dailyRecord.parameterEvaluations).toHaveLength(1);
    });

    it("must throw DomainError when date is in the future", () => {
      expect(() =>
        DailyRecord.create({
          ...makeValidDailyRecordProps(),
          date: new Date(2100, 6, 23),
        }),
      ).toThrow(DomainError);
    });
  });

  describe("updateEmotion", () => {
    it("must update emotion successfully", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateEmotion("EmotionTwo");
      expect(dailyRecord.emotionId).toBe("EmotionTwo");
    });

    it("must update updatedAt when emotion is changed", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateEmotion("EmotionTwo");
      expect(dailyRecord.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("updateDayDescription", () => {
    it("must update day description successfully", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateDayDescription("It was an awesome day.");
      expect(dailyRecord.dayDescription).toBe("It was an awesome day.");
    });

    it("must update updatedAt when day description is changed", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateDayDescription("It was an awesome day.");
      expect(dailyRecord.updatedAt).toBeInstanceOf(Date);
    });

    it("must allow removing day description by passing undefined", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateDayDescription(undefined);
      expect(dailyRecord.dayDescription).toBeUndefined();
    });
  });

  describe("updateMedicationLogs", () => {
    it("must update medication log successfully", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateMedicationLogs([
        { medicationId: "medicationId", status: "TAKEN" },
      ]);
      expect(dailyRecord.medicationLogs).toHaveLength(1);
    });

    it("must replace medication logs entirely on update", () => {
      const dailyRecord = DailyRecord.create({
        ...makeValidDailyRecordProps(),
        medicationLogs: [{ medicationId: "old-med", status: "TAKEN" }],
      });

      dailyRecord.updateMedicationLogs([
        { medicationId: "new-med-1", status: "NOT_TAKEN" },
        { medicationId: "new-med-2", status: "SKIPPED" },
      ]);

      expect(dailyRecord.medicationLogs).toHaveLength(2);
      expect(dailyRecord.medicationLogs[0]?.medicationId).toBe("new-med-1");
    });

    it("must update updatedAt when medication log is changed", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateMedicationLogs([
        { medicationId: "medicationId", status: "TAKEN" },
      ]);
      expect(dailyRecord.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("updateParameterEvaluations", () => {
    it("must replace parameter evaluations entirely on update", () => {
      const dailyRecord = DailyRecord.create({
        ...makeValidDailyRecordProps(),
        parameterEvaluations: [
          {
            parameterId: "old-param",
            valuationBool: true,
            valuationInt: undefined,
          },
        ],
      });

      dailyRecord.updateParameterEvaluations([
        {
          parameterId: "new-param-1",
          valuationBool: undefined,
          valuationInt: 3,
        },
        {
          parameterId: "new-param-2",
          valuationBool: undefined,
          valuationInt: 7,
        },
      ]);

      expect(dailyRecord.parameterEvaluations).toHaveLength(2);
      expect(dailyRecord.parameterEvaluations[0]?.parameterId).toBe(
        "new-param-1",
      );
    });
    it("must update parameter evaluation successfully", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateParameterEvaluations([
        {
          parameterId: "parameterId",
          valuationBool: true,
          valuationInt: undefined,
        },
      ]);
      expect(dailyRecord.parameterEvaluations).toHaveLength(1);
    });

    it("must update updatedAt when parameter evaluation is changed", () => {
      const dailyRecord = DailyRecord.create(makeValidDailyRecordProps());
      dailyRecord.updateParameterEvaluations([
        {
          parameterId: "parameterId",
          valuationBool: true,
          valuationInt: undefined,
        },
      ]);
      expect(dailyRecord.updatedAt).toBeInstanceOf(Date);
    });
  });
});
