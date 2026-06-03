import { RegisterUserUseCase } from "@app/use-cases/auth/RegisterUser.usecase";
import { prisma } from "@infra/database/prisma/client";
import { PrismaUserRepository } from "@infra/database/repositories/PrismaUserRepository";
import { ArgonHashingService } from "@infra/services/ArgonHashingService";

// --- INFRA ---
const userRepository = new PrismaUserRepository(prisma);
const hashingService = new ArgonHashingService();

//--- USE CASES ---
export const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  hashingService,
);
