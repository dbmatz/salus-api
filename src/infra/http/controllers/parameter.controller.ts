import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate, createParameterUseCase } from "../../../container";

const createParameterBodySchema = z.object({
  name: z.string().min(3),
  type: z.string(),
});

export async function parameterController(app: FastifyInstance) {
  app.post("/", { preHandler: authenticate }, async (request, reply) => {
    const body = createParameterBodySchema.parse(request.body);
    await createParameterUseCase.execute({
      ...body,
      userId: request.userId,
    });
    return reply.status(201).send();
  });
}
