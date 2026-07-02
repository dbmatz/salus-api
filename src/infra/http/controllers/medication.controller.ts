import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  authenticate,
  createMedicationUseCase,
  deleteMedicationUseCase,
  listMedicationUseCase,
  restoreMedicationUseCase,
} from "../../../container";

const createMedicationBodySchema = z.object({
  name: z.string().min(3),
  dosage: z.string().optional(),
});

const deleteMedicationParamsSchema = z.object({
  medicationId: z.uuid(),
});

const restoreMedicationParamsSchema = z.object({
  medicationId: z.uuid(),
});

export async function medicationController(app: FastifyInstance) {
  app.post("/", { preHandler: authenticate }, async (request, reply) => {
    const body = createMedicationBodySchema.parse(request.body);
    await createMedicationUseCase.execute({
      ...body,
      userId: request.userId,
    });
    return reply.status(201).send();
  });

  app.get("/", { preHandler: authenticate }, async (request, reply) => {
    const result = await listMedicationUseCase.execute({
      userId: request.userId,
    });
    return reply.status(200).send({
      medications: result.map((e) => ({
        id: e.id,
        name: e.name,
        dosage: e.dosage ?? null,
        createdAt: e.createdAt,
        deletedAt: e.deletedAt,
        updatedAt: e.updatedAt,
      })),
    });
  });

  app.delete(
    "/:medicationId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { medicationId } = deleteMedicationParamsSchema.parse(
        request.params,
      );
      await deleteMedicationUseCase.execute({
        medicationId,
        userId: request.userId,
      });
      return reply.status(204).send();
    },
  );

  app.patch(
    "/:medicationId/restore",
    { preHandler: authenticate },
    async (request, reply) => {
      const { medicationId } = restoreMedicationParamsSchema.parse(
        request.params,
      );
      await restoreMedicationUseCase.execute({
        medicationId,
        userId: request.userId,
      });
      return reply.status(200).send();
    },
  );
}
