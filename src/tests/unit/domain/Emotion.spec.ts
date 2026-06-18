import { describe, expect, it } from "vitest";
import { DomainError } from "@domain/errors/DomainError";
import { Emotion } from "@domain/entities/Emotion";

function makeValidEmotionProps() {
  return {
    name: "Happy",
    userId: "teste",
  };
}

describe("Emotion", () => {
  describe("create", () => {
    it("must create a valid emotion", () => {
      const emotion = Emotion.create(makeValidEmotionProps());
      expect(emotion.name).toBe("Happy");
      expect(emotion.userId).toBe("teste");
      expect(emotion.isDeleted).toBe(false);
    });

    it("must throw DomainError when name is shorter than 3 characters", () => {
      expect(() =>
        Emotion.create({ ...makeValidEmotionProps(), name: "Ha" }),
      ).toThrow(DomainError);
    });

    it("must throw DomainError when name is empty", () => {
      expect(() =>
        Emotion.create({ ...makeValidEmotionProps(), name: "" }),
      ).toThrow(DomainError);
    });
  });

  describe("updateName", () => {
    it("must update name successfully", () => {
      const emotion = Emotion.create(makeValidEmotionProps());
      emotion.updateName("Sad");
      expect(emotion.name).toBe("Sad");
    });

    it("must update updatedAt when name is changed", () => {
      const emotion = Emotion.create(makeValidEmotionProps());
      emotion.updateName("Angry");
      expect(emotion.updatedAt).toBeInstanceOf(Date);
    });

    it("must throw DomainError when updating name to shorter than 3 characters", () => {
      const emotion = Emotion.create(makeValidEmotionProps());
      expect(() => emotion.updateName("Ha")).toThrow(DomainError);
    });
  });

  describe("delete", () => {
    it("must mark emotion as deleted", () => {
      const emotion = Emotion.create(makeValidEmotionProps());
      emotion.delete();
      expect(emotion.isDeleted).toBe(true);
      expect(emotion.deletedAt).toBeInstanceOf(Date);
    });

    it("must throw DomainError when deleting an already deleted emotion", () => {
      const emotion = Emotion.create(makeValidEmotionProps());
      emotion.delete();
      expect(() => emotion.delete()).toThrow(DomainError);
    });
  });

  describe("restore", () => {
    it("must restore emotion", () => {
      const emotion = Emotion.create(makeValidEmotionProps());
      emotion.delete();
      emotion.restore();
      expect(emotion.isDeleted).toBe(false);
      expect(emotion.deletedAt).toBeUndefined();
    });

    it("must throw DomainError when restoring an undeleted emotion", () => {
      const emotion = Emotion.create(makeValidEmotionProps());
      expect(() => emotion.restore()).toThrow(DomainError);
    });
  });
});
