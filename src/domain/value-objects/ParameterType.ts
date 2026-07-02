import { DomainError } from "../errors/DomainError";

export type ParameterTypeValue = "BOOLEAN" | "SCALE_1_5" | "SCALE_1_10";

export class ParameterType {
  readonly value: ParameterTypeValue;

  private constructor(value: ParameterTypeValue) {
    this.value = value;
  }

  static create(value: string): ParameterType {
    if (!["BOOLEAN", "SCALE_1_5", "SCALE_1_10"].includes(value)) {
      throw new DomainError(`Invalid parameter type: ${value}`);
    }
    return new ParameterType(value as ParameterTypeValue);
  }

  static boolean(): ParameterType {
    return new ParameterType("BOOLEAN");
  }

  static scale1_5(): ParameterType {
    return new ParameterType("SCALE_1_5");
  }

  static scale1_10(): ParameterType {
    return new ParameterType("SCALE_1_10");
  }

  validateValue(value: boolean | number): void {
    if (this.value === "BOOLEAN") {
      if (typeof value !== "boolean") {
        throw new DomainError("Boolean parameter requires a boolean value.");
      }
      return;
    }

    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new DomainError("Scale parameter requires an integer value.");
    }

    if (this.value === "SCALE_1_5" && (value < 1 || value > 5)) {
      throw new DomainError(
        "Scale 1-5 parameter requires a value between 1 and 5.",
      );
    }

    if (this.value === "SCALE_1_10" && (value < 1 || value > 10)) {
      throw new DomainError(
        "Scale 1-10 parameter requires a value between 1 and 10.",
      );
    }
  }

  get isBoolean(): boolean {
    return this.value === "BOOLEAN";
  }

  get isScale(): boolean {
    return this.value === "SCALE_1_5" || this.value === "SCALE_1_10";
  }
}
