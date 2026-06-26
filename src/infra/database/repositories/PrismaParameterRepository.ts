import { Parameter } from "@domain/entities/Parameter";
import { IParameterRepository } from "@domain/repositories/IParameterRepository";
import { PrismaClient } from "@prisma/client";
import { ParameterMapper } from "../mappers/ParameterMapper";

export class PrismaParameterRepository implements IParameterRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(parameter: Parameter): Promise<Parameter> {
    const created = await this.prisma.parameter.create({
      data: ParameterMapper.toPrismaCreate(parameter),
    });
    return ParameterMapper.toDomain(created);
  }

  async findById(parameterId: string): Promise<Parameter | null> {
    const found = await this.prisma.parameter.findUnique({
      where: { id: parameterId },
    });

    return found ? ParameterMapper.toDomain(found) : null;
  }

  async update(parameter: Parameter): Promise<Parameter> {
    const updated = await this.prisma.parameter.update({
      where: { id: parameter.id },
      data: ParameterMapper.toPrismaUpdate(parameter),
    });
    return ParameterMapper.toDomain(updated);
  }

  async listByUserId(userId: string): Promise<Parameter[]> {
    const parameters = await this.prisma.parameter.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return parameters.map((parameter) => ParameterMapper.toDomain(parameter));
  }

  async findByUserIdAndName(
    userId: string,
    name: string,
  ): Promise<Parameter | null> {
    const found = await this.prisma.parameter.findFirst({
      where: {
        userId,
        name,
      },
    });

    return found ? ParameterMapper.toDomain(found) : null;
  }
}
