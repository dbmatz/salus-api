import { Parameter } from "@domain/entities/Parameter";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { IParameterRepository } from "@domain/repositories/IParameterRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";

interface ListParameterInput {
  userId: string;
}

interface ListParameterDeps {
  parameterRepository: IParameterRepository;
  userRepository: IUserRepository;
}

export class ListParameterUseCase {
  constructor(private readonly deps: ListParameterDeps) {}

  async execute(input: ListParameterInput): Promise<Parameter[]> {
    const { userId } = input;
    const foundUserById = await this.deps.userRepository.findById(userId);

    if (!foundUserById) {
      throw new NotFoundError("User not found");
    }

    return await this.deps.parameterRepository.listByUserId(userId);
  }
}
