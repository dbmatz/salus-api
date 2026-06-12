import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  authenticate,
  createEmotionUseCase,
  listEmotionUseCase,
} from "../../../container";

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

  app.get("/emotion", { preHandler: authenticate }, async (request, reply) => {
    const result = await listEmotionUseCase.execute({ userId: request.userId });
    return reply.status(200).send({
      emotions: result.map((e) => ({
        id: e.id,
        name: e.name,
        createdAt: e.createdAt,
        deletedAt: e.deletedAt,
        updatedAt: e.updatedAt
      })),
    });
  });
}
