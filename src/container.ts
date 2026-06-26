import { LoginUseCase } from "@app/use-cases/auth/Login.usecase";
import { RegisterUserUseCase } from "@app/use-cases/auth/RegisterUser.usecase";
import { CreateEmotionUseCase } from "@app/use-cases/emotion/CreateEmotion.usecase";
import { DeleteEmotionUseCase } from "@app/use-cases/emotion/DeleteEmotion.usecase";
import { ListEmotionUseCase } from "@app/use-cases/emotion/ListEmotion.usecase";
import { RestoreEmotionUseCase } from "@app/use-cases/emotion/RestoreEmotion.usecase";
import { CreateMedicationUseCase } from "@app/use-cases/medication/CreateMedication.usecase";
import { DeleteMedicationUseCase } from "@app/use-cases/medication/DeleteMedication.usecase";
import { ListMedicationUseCase } from "@app/use-cases/medication/ListMedication.usecase";
import { RestoreMedicationUseCase } from "@app/use-cases/medication/RestoreMedication.usecase";
import { CreateParameterUseCase } from "@app/use-cases/parameter/CreateParameter.usecase";
import { DeleteParameterUseCase } from "@app/use-cases/parameter/DeleteParameter.usecase";
import { ListParameterUseCase } from "@app/use-cases/parameter/ListParameter.usecase";
import { RestoreParameterUseCase } from "@app/use-cases/parameter/RestoreParameter.usecase";
import { prisma } from "@infra/database/prisma/client";
import { PrismaEmotionRepository } from "@infra/database/repositories/PrismaEmotionRepository";
import { PrismaMedicationRepository } from "@infra/database/repositories/PrismaMedicationRepository";
import { PrismaParameterRepository } from "@infra/database/repositories/PrismaParameterRepository";
import { PrismaUserRepository } from "@infra/database/repositories/PrismaUserRepository";
import { buildAuthMiddleware } from "@infra/http/middleware/authenticate.middleware";
import { ArgonHashingService } from "@infra/services/ArgonHashingService";
import { JoseJwtService } from "@infra/services/JoseJwtService";

// --- INFRA ---
const userRepository = new PrismaUserRepository(prisma);
const hashingService = new ArgonHashingService();
const jwtService = new JoseJwtService();
const emotionRepository = new PrismaEmotionRepository(prisma);
const medicationRepository = new PrismaMedicationRepository(prisma);
const parameterRepository = new PrismaParameterRepository(prisma);

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

export const createEmotionUseCase = new CreateEmotionUseCase({
  emotionRepository,
  userRepository,
});

export const listEmotionUseCase = new ListEmotionUseCase({
  emotionRepository,
  userRepository,
});

export const deleteEmotionUseCase = new DeleteEmotionUseCase({
  emotionRepository,
});

export const restoreEmotionUseCase = new RestoreEmotionUseCase({
  emotionRepository,
});

export const createMedicationUseCase = new CreateMedicationUseCase({
  medicationRepository,
  userRepository,
});

export const listMedicationUseCase = new ListMedicationUseCase({
  medicationRepository,
  userRepository,
});

export const deleteMedicationUseCase = new DeleteMedicationUseCase({
  medicationRepository,
});

export const restoreMedicationUseCase = new RestoreMedicationUseCase({
  medicationRepository,
});

export const createParameterUseCase = new CreateParameterUseCase({
  parameterRepository,
  userRepository,
});

export const listParameterUseCase = new ListParameterUseCase({
  parameterRepository,
  userRepository,
});

export const deleteParameterUseCase = new DeleteParameterUseCase({
  parameterRepository,
});

export const restoreParameterUseCase = new RestoreParameterUseCase({
  parameterRepository,
});
