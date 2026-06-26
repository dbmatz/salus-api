import { DomainError } from "@domain/errors/DomainError";
import { ParameterType } from "@domain/value-objects/ParameterType";
import { describe, it, expect } from "vitest";

describe("ParameterType", () => {
  describe("create", () => {
    it("must create a valid boolean parameterType", () => {
      const parameterType = ParameterType.create("BOOLEAN");

      expect(parameterType.value).toBe("BOOLEAN");
    });

    it("must create a valid scale 1 to 5 parameterType", () => {
      const parameterType = ParameterType.create("SCALE_1_5");

      expect(parameterType.value).toBe("SCALE_1_5");
    });

    it("must create a valid scale 1 to 10 parameterType", () => {
      const parameterType = ParameterType.create("SCALE_1_10");

      expect(parameterType.value).toBe("SCALE_1_10");
    });

    it("must throw DomainError to invalid parameterType", () => {
      expect(() => ParameterType.create("SCALE_5_10")).toThrow(DomainError);
    });
  });

  describe("validateValue", () => {
    it("must accept true for boolean parameter", () => {
      const parameterType = ParameterType.create("BOOLEAN");
      expect(() => parameterType.validateValue(true)).not.toThrow();
    });

    it("must accept 5 for scale 1-5 parameter", () => {
      const parameterType = ParameterType.create("SCALE_1_5");
      expect(() => parameterType.validateValue(5)).not.toThrow();
    });

    it("must accept 10 for scale 1-10 parameter", () => {
      const parameterType = ParameterType.create("SCALE_1_10");
      expect(() => parameterType.validateValue(10)).not.toThrow();
    });

    it("must throw DomainError when value is not boolean", () => {
      const parameterType = ParameterType.create("BOOLEAN");
      expect(() => parameterType.validateValue(5)).toThrow(DomainError);
    });

    it("must throw DomainError when scale 1-5 value exceeds maximum", () => {
      const parameterType = ParameterType.create("SCALE_1_5");
      expect(() => parameterType.validateValue(8)).toThrow(DomainError);
    });

    it("must throw DomainError when scale 1-10 value is below minimum", () => {
      const parameterType = ParameterType.create("SCALE_1_10");
      expect(() => parameterType.validateValue(0)).toThrow(DomainError);
    });

    it("must throw DomainError when value is not a integer number", () => {
      const parameterType = ParameterType.create("SCALE_1_5");
      expect(() => parameterType.validateValue(2.5)).toThrow(DomainError);
    });
  });

  describe("validateType", () => {
    it("must return isBoolean true for BOOLEAN", () => {
      const parameterType = ParameterType.create("BOOLEAN");
      expect(parameterType.isBoolean).toBe(true);
    });

    it("must return isScale true for SCALE_1_5", () => {
      const parameterType = ParameterType.create("SCALE_1_10");
      expect(parameterType.isScale).toBe(true);
    });

    it("must return isScale true for SCALE_1_5", () => {
      const parameterType = ParameterType.create("SCALE_1_5");
      expect(parameterType.isScale).toBe(true);
    });

    it("must return isBoolean false for scale parameter", () => {
      const parameterType = ParameterType.create("SCALE_1_5");
      expect(parameterType.isBoolean).toBe(false);
    });
  });
});
