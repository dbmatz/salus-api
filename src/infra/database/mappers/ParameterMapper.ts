import { Parameter } from "@domain/entities/Parameter";
import { ParameterType } from "@domain/value-objects/ParameterType";
import { PrismaClient } from "@prisma/client";

type PrismaParameterRow = Awaited<
  ReturnType<PrismaClient["parameter"]["findUniqueOrThrow"]>
>;

export class ParameterMapper {
  static toDomain(row: PrismaParameterRow): Parameter {
    return Parameter.reconstitute({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? undefined,
      deletedAt: row.deletedAt ?? undefined,
      userId: row.userId,
      type: ParameterType.create(row.type),
    });
  }

  static toPrismaCreate(parameter: Parameter) {
    return {
      name: parameter.name,
      userId: parameter.userId,
      type: parameter.type.value,
    };
  }

  static toPrismaUpdate(parameter: Parameter) {
    return {
      name: parameter.name,
      updatedAt: parameter.updatedAt ?? new Date(),
      deletedAt: parameter.deletedAt ?? null,
    };
  }
}
