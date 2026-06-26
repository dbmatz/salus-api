import { describe, expect, it } from "vitest";
import { DomainError } from "@domain/errors/DomainError";
import { Parameter } from "@domain/entities/Parameter";
import { ParameterType } from "@domain/value-objects/ParameterType";

function makeValidParameterProps() {
  return {
    name: "Studied",
    userId: "teste",
    type: ParameterType.create("BOOLEAN")
  };
}

describe("Parameter", () => {
  describe("create", () => {
    it("must create a valid parameter", () => {
      const parameter = Parameter.create(makeValidParameterProps());
      expect(parameter.name).toBe("Studied");
      expect(parameter.userId).toBe("teste");
      expect(parameter.type.value).toBe("BOOLEAN")
      expect(parameter.isDeleted).toBe(false);
    });

    it("must throw DomainError when name is shorter than 3 characters", () => {
      expect(() =>
        Parameter.create({ ...makeValidParameterProps(), name: "St" }),
      ).toThrow(DomainError);
    });

    it("must throw DomainError when name is empty", () => {
      expect(() =>
        Parameter.create({ ...makeValidParameterProps(), name: "" }),
      ).toThrow(DomainError);
    });
  });

  describe("updateName", () => {
    it("must update name successfully", () => {
      const parameter = Parameter.create(makeValidParameterProps());
      parameter.updateName("Run");
      expect(parameter.name).toBe("Run");
    });

    it("must update updatedAt when name is changed", () => {
      const parameter = Parameter.create(makeValidParameterProps());
      parameter.updateName("Run");
      expect(parameter.updatedAt).toBeInstanceOf(Date);
    });

    it("must throw DomainError when updating name to shorter than 3 characters", () => {
      const parameter = Parameter.create(makeValidParameterProps());
      expect(() => parameter.updateName("Ru")).toThrow(DomainError);
    });
  });

  describe("delete", () => {
    it("must mark parameter as deleted", () => {
      const parameter = Parameter.create(makeValidParameterProps());
      parameter.delete();
      expect(parameter.isDeleted).toBe(true);
      expect(parameter.deletedAt).toBeInstanceOf(Date);
    });

    it("must throw DomainError when deleting an already deleted parameter", () => {
      const parameter = Parameter.create(makeValidParameterProps());
      parameter.delete();
      expect(() => parameter.delete()).toThrow(DomainError);
    });
  });

  describe("restore", () => {
    it("must restore parameter", () => {
      const parameter = Parameter.create(makeValidParameterProps());
      parameter.delete();
      parameter.restore();
      expect(parameter.isDeleted).toBe(false);
      expect(parameter.deletedAt).toBeUndefined();
    });

    it("must throw DomainError when restoring an undeleted parameter", () => {
      const parameter = Parameter.create(makeValidParameterProps());
      expect(() => parameter.restore()).toThrow(DomainError);
    });
  });
});
