import { ConflictError } from "@domain/errors/ConflictError";
import { DomainError } from "@domain/errors/DomainError";
import { FastifyInstance } from "fastify";
import { z, ZodError } from "zod";
import { registerUserUseCase } from "../../../container";

const registerBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function authController(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    try {
      const body = registerBodySchema.parse(request.body);
      await registerUserUseCase.execute(body);
      return reply.status(201).send();
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: "Validation failed",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      if (error instanceof DomainError) {
        return reply.status(400).send({ message: error.message });
      }
      if (error instanceof ConflictError) {
        return reply.status(409).send({ message: error.message });
      }
      throw error;
    }
  });
}
