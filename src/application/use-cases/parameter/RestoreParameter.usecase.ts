import { NotFoundError } from "@domain/errors/NotFoundError";
import { IParameterRepository } from "@domain/repositories/IParameterRepository";

interface RestoreParameterInput {
  parameterId: string;
  userId: string;
}

interface RestoreParameterDeps {
  parameterRepository: IParameterRepository;
}

export class RestoreParameterUseCase {
  constructor(private readonly deps: RestoreParameterDeps) {}

  async execute(input: RestoreParameterInput): Promise<void> {
    const { parameterId, userId } = input;
    const foundParameterById =
      await this.deps.parameterRepository.findById(parameterId);

    if (!foundParameterById) {
      throw new NotFoundError("Parameter not found");
    }

    if (foundParameterById.userId !== userId) {
      throw new NotFoundError("Parameter not found");
    }

    foundParameterById.restore();
    await this.deps.parameterRepository.update(foundParameterById);
  }
}
