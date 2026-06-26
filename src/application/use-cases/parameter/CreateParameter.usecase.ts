import { Parameter } from "@domain/entities/Parameter";
import { ConflictError } from "@domain/errors/ConflictError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { IParameterRepository } from "@domain/repositories/IParameterRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { ParameterType } from "@domain/value-objects/ParameterType";

interface CreateParameterInput {
  name: string;
  userId: string;
  type: string;
}

interface CreateParameterDeps {
  parameterRepository: IParameterRepository;
  userRepository: IUserRepository;
}

export class CreateParameterUseCase {
  constructor(private readonly deps: CreateParameterDeps) {}

  async execute(input: CreateParameterInput): Promise<Parameter> {
    const { name, userId, type } = input;
    const foundUserById = await this.deps.userRepository.findById(userId);

    if (!foundUserById) {
      throw new NotFoundError("User not found");
    }

    const validateUniqueness =
      await this.deps.parameterRepository.findByUserIdAndName(
        userId,
        name,
      );
    if (validateUniqueness) {
      throw new ConflictError(
        "Parameter with this name and type already exists.",
      );
    }

    const parameterType = ParameterType.create(type);
    const parameter = Parameter.create({ name, userId, type: parameterType });

    const createdParameter =
      await this.deps.parameterRepository.create(parameter);

    return createdParameter;
  }
}
