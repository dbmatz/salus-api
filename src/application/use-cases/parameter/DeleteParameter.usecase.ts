import { NotFoundError } from "@domain/errors/NotFoundError";
import { IParameterRepository } from "@domain/repositories/IParameterRepository";

interface DeleteParameterInput {
  parameterId: string;
  userId: string;
}

interface DeleteParameterDeps {
  parameterRepository: IParameterRepository;
}

export class DeleteParameterUseCase {
  constructor(private readonly deps: DeleteParameterDeps) {}

  async execute(input: DeleteParameterInput): Promise<void> {
    const { parameterId, userId } = input;
    const foundParameterById =
      await this.deps.parameterRepository.findById(parameterId);

    if (!foundParameterById) {
      throw new NotFoundError("Parameter not found");
    }

    if (foundParameterById.userId !== userId) {
      throw new NotFoundError("Parameter not found");
    }

    foundParameterById.delete();
    await this.deps.parameterRepository.update(foundParameterById);
  }
}
