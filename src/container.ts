import { LoginUseCase } from "@app/use-cases/auth/Login.usecase";
import { RegisterUserUseCase } from "@app/use-cases/auth/RegisterUser.usecase";
import { prisma } from "@infra/database/prisma/client";
import { PrismaUserRepository } from "@infra/database/repositories/PrismaUserRepository";
import { buildAuthMiddleware } from "@infra/http/middleware/authenticate.middleware";
import { ArgonHashingService } from "@infra/services/ArgonHashingService";
import { JoseJwtService } from "@infra/services/JoseJwtService";

// --- INFRA ---
const userRepository = new PrismaUserRepository(prisma);
const hashingService = new ArgonHashingService();
const jwtService = new JoseJwtService();

// --- MIDDLEWARE ---
export const authenticate = buildAuthMiddleware(jwtService);

//--- USE CASES ---
export const registerUserUseCase = new RegisterUserUseCase({
  userRepository,
  hashingService,
});

export const loginUseCase = new LoginUseCase({
  hashingService,
  userRepository,
  jwtService,
});
