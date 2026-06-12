import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate, createEmotionUseCase } from "../../../container";

const createEmotionBodySchema = z.object({
  name: z.string().min(3),
});

export async function emotionController(app: FastifyInstance) {
  app.post(
    "/emotion/create",
    { preHandler: authenticate },
    async (request, reply) => {
      const body = createEmotionBodySchema.parse(request.body);
      await createEmotionUseCase.execute({ ...body, userId: request.userId });
      return reply.status(201).send();
    },
  );
}
