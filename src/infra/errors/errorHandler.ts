import { ConflictError } from "@domain/errors/ConflictError";
import { DomainError } from "@domain/errors/DomainError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { UnauthorizedError } from "@domain/errors/UnauthorizedError";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation failed.",
        errors: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    if (error instanceof ConflictError) {
      return reply.status(409).send({ message: error.message });
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof UnauthorizedError) {
      return reply.status(401).send({ message: error.message });
    }

    if (error instanceof DomainError) {
      return reply.status(400).send({ message: error.message });
    }

    app.log.error(error);
    return reply.status(500).send({ message: "Internal server error." });
  });
}
