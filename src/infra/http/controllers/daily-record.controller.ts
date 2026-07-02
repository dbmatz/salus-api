import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  authenticate,
  createDailyRecordUseCase,
  listDailyRecordByMonthUseCase,
} from "../../../container";

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
        valuationBool: z.boolean().optional(),
        valuationInt: z.number().optional(),
      }),
    )
    .optional(),
});

const listDailyRecordByMonth = z.object({
  month: z.string().refine(
    (month) => {
      const monthNum = parseInt(month, 10);
      return !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12;
    },
    {
      message: "Month must be a number between 1 and 12",
    },
  ),
  year: z.string().refine(
    (year) => {
      const yearNum = parseInt(year, 10);
      return !isNaN(yearNum);
    },
    {
      message: "Year must be a number",
    },
  ),
});

export async function dailyRecordController(app: FastifyInstance) {
  app.post("/", { preHandler: authenticate }, async (request, reply) => {
    const body = createDailyRecordBodySchema.parse(request.body);
    const { dayDescription, medicationLogs, parameterEvaluations, ...rest } =
      body;
    await createDailyRecordUseCase.execute({
      emotionId: body.emotionId,
      date: new Date(body.date),
      userId: request.userId,
      dayDescription: body.dayDescription,
      medicationLogs: body.medicationLogs,
      parameterEvaluations: body.parameterEvaluations?.map((pe) => ({
        parameterId: pe.parameterId,
        valuationBool: pe.valuationBool,
        valuationInt: pe.valuationInt,
      })),
    });
    return reply.status(201).send();
  });

  app.get<{
    Querystring: { month: string; year: string };
  }>("/", { preHandler: authenticate }, async (request, reply) => {
    const { month, year } = request.query;
    const body = listDailyRecordByMonth.parse({ month, year });
    const dailyRecords = await listDailyRecordByMonthUseCase.execute({
      month: parseInt(body.month, 10),
      year: parseInt(body.year, 10),
      userId: request.userId,
    });
    return reply.status(200).send({
      dailyRecords: dailyRecords.map((e) => ({
        id: e.id,
        date: new Date(e.date).toISOString().split("T")[0],
      })),
    });
  });
}
