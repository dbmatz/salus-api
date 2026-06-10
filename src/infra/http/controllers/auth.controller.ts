import { FastifyInstance } from "fastify";
import { z } from "zod";
import { loginUseCase, registerUserUseCase } from "../../../container";

const registerBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authController(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    const body = registerBodySchema.parse(request.body);
    await registerUserUseCase.execute(body);
    return reply.status(201).send();
  });

  app.post("/auth/login", async (request, reply) => {
    const body = loginBodySchema.parse(request.body);
    const result = await loginUseCase.execute(body);
    return reply.status(200).send(result);
  });
}
