import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate, createMedicationUseCase } from "../../../container";

const createMedicationBodySchema = z.object({
  name: z.string().min(3),
  dosage: z.string().optional(),
});

export async function medicationController(app: FastifyInstance) {
  app.post("/", { preHandler: authenticate }, async (request, reply) => {
    console.log(request.userId)
    const body = createMedicationBodySchema.parse(request.body);
    await createMedicationUseCase.execute({
      ...body,
      userId: request.userId,
    });
    return reply.status(201).send();
  });
}
