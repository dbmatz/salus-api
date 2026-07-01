import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate, createDailyRecordUseCase } from "../../../container";

const createDailyRecordBodySchema = z.object({
  emotionId: z.string().uuid(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  dayDescription: z.string().optional(),
  medicationLogs: z
    .array(
      z.object({
        medicationId: z.string().uuid(),
        status: z.enum(["TAKEN", "NOT_TAKEN", "SKIPPED"]),
      }),
    )
    .optional(),
  parameterEvaluations: z
    .array(
      z.object({
        parameterId: z.string().uuid(),
        valuationBool: z.string().optional(),
        valuationInt: z.number().optional(),
      }),
    )
    .optional(),
});

export async function dailyRecordController(app: FastifyInstance) {
  app.post("/", { preHandler: authenticate }, async (request, reply) => {
    const body = createDailyRecordBodySchema.parse(request.body);
    const { dayDescription, medicationLogs, parameterEvaluations, ...rest } =
      body;
    await createDailyRecordUseCase.execute({
      ...rest,
      userId: request.userId,
      date: new Date(body.date),
      ...(dayDescription !== undefined && { dayDescription }),
      ...(medicationLogs !== undefined && { medicationLogs }),
      ...(parameterEvaluations !== undefined && {
        parameterEvaluations: parameterEvaluations.map((pe) => ({
          ...pe,
          valuationBool:
            pe.valuationBool === undefined
              ? undefined
              : pe.valuationBool === "true",
          valuationInt: pe.valuationInt ?? 0,
        })),
      }),
    });
    return reply.status(201).send();
  });
}
