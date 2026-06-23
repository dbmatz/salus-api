import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  authenticate,
  createMedicationUseCase,
  listMedicationUseCase,
} from "../../../container";

const createMedicationBodySchema = z.object({
  name: z.string().min(3),
  dosage: z.string().optional(),
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
}
