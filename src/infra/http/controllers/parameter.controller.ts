import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  authenticate,
  createParameterUseCase,
  deleteParameterUseCase,
  listParameterUseCase,
  restoreParameterUseCase,
} from "../../../container";

const createParameterBodySchema = z.object({
  name: z.string().min(3),
  type: z.string(),
});

const deleteparameterParamsSchema = z.object({
  parameterId: z.uuid(),
});

const restoreParameterParamsSchema = z.object({
  parameterId: z.uuid(),
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

  app.get("/", { preHandler: authenticate }, async (request, reply) => {
    const result = await listParameterUseCase.execute({
      userId: request.userId,
    });
    return reply.status(200).send({
      medications: result.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type.value,
        createdAt: e.createdAt,
        deletedAt: e.deletedAt,
        updatedAt: e.updatedAt,
      })),
    });
  });

  app.delete(
    "/:parameterId",
    { preHandler: authenticate },
    async (request, reply) => {
      const { parameterId } = deleteparameterParamsSchema.parse(request.params);
      await deleteParameterUseCase.execute({
        parameterId,
        userId: request.userId,
      });
      return reply.status(204).send();
    },
  );

  app.patch(
    "/:parameterId/restore",
    { preHandler: authenticate },
    async (request, reply) => {
      const { parameterId } = restoreParameterParamsSchema.parse(
        request.params,
      );
      await restoreParameterUseCase.execute({
        parameterId,
        userId: request.userId,
      });
      return reply.status(200).send();
    },
  );
}
