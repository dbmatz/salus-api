import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  authenticate,
  createEmotionUseCase,
  deleteEmotionUseCase,
  listEmotionUseCase,
  restoreEmotionUseCase,
} from "../../../container";

const createEmotionBodySchema = z.object({
  name: z.string().min(3),
});

const deleteEmotionParamsSchema = z.object({
  emotionId: z.uuid(),
});

const restoreEmotionParamsSchema = z.object({
  emotionId: z.uuid(),
});

export async function emotionController(app: FastifyInstance) {
  app.post("/", { preHandler: authenticate }, async (request, reply) => {
    const body = createEmotionBodySchema.parse(request.body);
    await createEmotionUseCase.execute({ ...body, userId: request.userId });
    return reply.status(201).send();
  });

  app.get("/", { preHandler: authenticate }, async (request, reply) => {
    const result = await listEmotionUseCase.execute({ userId: request.userId });
    return reply.status(200).send({
      emotions: result.map((e) => ({
        id: e.id,
        name: e.name,
        createdAt: e.createdAt,
        deletedAt: e.deletedAt,
        updatedAt: e.updatedAt,
      })),
    });
  });

  app.delete(
    "/:emotionId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { emotionId } = deleteEmotionParamsSchema.parse(request.params);
      await deleteEmotionUseCase.execute({ emotionId, userId: request.userId });
      return reply.status(204).send();
    },
  );

  app.patch(
    "/:emotionId/restore",
    { preHandler: authenticate },
    async (request, reply) => {
      const { emotionId } = restoreEmotionParamsSchema.parse(request.params);
      await restoreEmotionUseCase.execute({
        emotionId,
        userId: request.userId,
      });
      return reply.status(200).send();
    },
  );
}
