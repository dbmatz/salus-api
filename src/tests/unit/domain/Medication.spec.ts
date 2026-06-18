import { describe, expect, it } from "vitest";
import { DomainError } from "@domain/errors/DomainError";
import { Medication } from "@domain/entities/Medication";

function makeValidMedicationProps() {
  return {
    name: "Escitalopram",
    userId: "teste",
    dosage: "10mg"
  };
}

describe("Medication", () => {
  describe("create", () => {
    it("must create a valid medication", () => {
      const medication = Medication.create(makeValidMedicationProps());
      expect(medication.name).toBe("Escitalopram");
      expect(medication.userId).toBe("teste");
      expect(medication.isDeleted).toBe(false);
    });

    it("must throw DomainError when name is shorter than 3 characters", () => {
      expect(() =>
        Medication.create({ ...makeValidMedicationProps(), name: "Es" }),
      ).toThrow(DomainError);
    });

    it("must throw DomainError when name is empty", () => {
      expect(() =>
        Medication.create({ ...makeValidMedicationProps(), name: "" }),
      ).toThrow(DomainError);
    });
  });

  describe("updateName", () => {
    it("must update name successfully", () => {
      const medication = Medication.create(makeValidMedicationProps());
      medication.updateName("Venvanse");
      expect(medication.name).toBe("Venvanse");
    });

    it("must update updatedAt when name is changed", () => {
      const medication = Medication.create(makeValidMedicationProps());
      medication.updateName("Venvanse");
      expect(medication.updatedAt).toBeInstanceOf(Date);
    });

    it("must throw DomainError when updating name to shorter than 3 characters", () => {
      const medication = Medication.create(makeValidMedicationProps());
      expect(() => medication.updateName("Ve")).toThrow(DomainError);
    });
  });

  describe("delete", () => {
    it("must mark medication as deleted", () => {
      const medication = Medication.create(makeValidMedicationProps());
      medication.delete();
      expect(medication.isDeleted).toBe(true);
      expect(medication.deletedAt).toBeInstanceOf(Date);
    });

    it("must throw DomainError when deleting an already deleted medication", () => {
      const medication = Medication.create(makeValidMedicationProps());
      medication.delete();
      expect(() => medication.delete()).toThrow(DomainError);
    });
  });

  describe("restore", () => {
    it("must restore medication", () => {
      const medication = Medication.create(makeValidMedicationProps());
      medication.delete();
      medication.restore();
      expect(medication.isDeleted).toBe(false);
      expect(medication.deletedAt).toBeUndefined();
    });

    it("must throw DomainError when restoring an undeleted medication", () => {
      const medication = Medication.create(makeValidMedicationProps());
      expect(() => medication.restore()).toThrow(DomainError);
    });
  });

  describe("updateDosage", () => {
    it("must update medication dosage", () => {
      const medication = Medication.create(makeValidMedicationProps());
      medication.updateDosage("20mg");
      expect(medication.dosage).toBe("20mg");
      expect(medication.updatedAt).toBeInstanceOf(Date);
    });

    it("must allow removing dosage", () => {
      const medication = Medication.create(makeValidMedicationProps());
      medication.updateDosage(undefined);
      expect(medication.dosage).toBeUndefined();
      expect(medication.updatedAt).toBeInstanceOf(Date);
    });
  });
});
