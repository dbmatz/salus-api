import { FastifyReply, FastifyRequest } from "fastify";
import { IJwtService } from "@domain/services/IJwtService";
import { UnauthorizedError } from "@domain/errors/UnauthorizedError";

export function buildAuthMiddleware(jwtService: IJwtService) {
  return async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token not provided.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Token not provided.");
    }

    try {
      const payload = await jwtService.verify(token);
      request.userId = payload.sub;
    } catch {
      throw new UnauthorizedError("Invalid or expired token.");
    }
  };
}
