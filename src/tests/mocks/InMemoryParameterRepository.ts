import { Parameter } from "@domain/entities/Parameter";
import { IParameterRepository } from "@domain/repositories/IParameterRepository";

export class InMemoryParameterRepository implements IParameterRepository {
  public items: Parameter[] = [];

  async create(parameter: Parameter): Promise<Parameter> {
    this.items.push(parameter);
    return parameter;
  }

  async findById(id: string): Promise<Parameter | null> {
    return this.items.find((e) => e.id === id) ?? null;
  }

  async findByUserIdAndName(
    userId: string,
    name: string,
  ): Promise<Parameter | null> {
    return (
      this.items.find((e) => e.userId === userId && e.name === name) ?? null
    );
  }

  async listByUserId(userId: string): Promise<Parameter[]> {
    return this.items.filter((e) => e.userId === userId);
  }

  async update(parameter: Parameter): Promise<Parameter> {
    const index = this.items.findIndex((e) => e.id === parameter.id);
    if (index >= 0) {
      this.items[index] = parameter;
    }
    return parameter;
  }
}
