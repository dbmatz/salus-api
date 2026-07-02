import { InMemoryParameterRepository } from "./InMemoryParameterRepository";
import { ParameterType } from "@domain/value-objects/ParameterType";
import { Parameter } from "@domain/entities/Parameter";

export async function createParameter(
  repo: InMemoryParameterRepository,
  userId: string,
  parameterName: string = "Sleep",
  type?: ParameterType,
) {
  const parameterType = type ?? ParameterType.create("BOOLEAN");
  const parameter = Parameter.create({
    name: parameterName,
    userId,
    type: parameterType,
  });
  await repo.create(parameter);
  return parameter;
}
