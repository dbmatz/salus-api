import { Parameter } from "@domain/entities/Parameter";
import { ParameterType } from "@domain/value-objects/ParameterType";

export interface IParameterRepository {
  create(parameter: Parameter): Promise<Parameter>;
  findById(parameterId: string): Promise<Parameter | null>;
  findByUserIdAndName(
    userId: string,
    name: string,
  ): Promise<Parameter | null>;
  update(parameter: Parameter): Promise<Parameter>;
  listByUserId(userId: string): Promise<Parameter[]>;
}
