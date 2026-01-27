import { validation, masks } from "@/utils/validation";

describe("Validation Utils", () => {
  // CPF
  describe("isValidCPF", () => {
    it("should validate a correct CPF", () => {
      expect(validation.isValidCPF("11144477735")).toBe(true);
    });

    it("should reject CPF with wrong length", () => {
      expect(validation.isValidCPF("123")).toBe(false);
    });

    it("should reject CPF with all same digits", () => {
      expect(validation.isValidCPF("11111111111")).toBe(false);
    });
  });

  // Email
  describe("isValidEmail", () => {
    it("should validate a correct email", () => {
      expect(validation.isValidEmail("test@example.com")).toBe(true);
    });

    it("should reject email without @", () => {
      expect(validation.isValidEmail("testexample.com")).toBe(false);
    });

    it("should reject email without domain", () => {
      expect(validation.isValidEmail("test@")).toBe(false);
    });
  });

  // Phone
  describe("isValidPhone", () => {
    it("should validate a 10-digit phone", () => {
      expect(validation.isValidPhone("1133334444")).toBe(true);
    });

    it("should validate an 11-digit phone", () => {
      expect(validation.isValidPhone("11933334444")).toBe(true);
    });

    it("should reject a 9-digit phone", () => {
      expect(validation.isValidPhone("113333444")).toBe(false);
    });
  });

  // Name
  describe("isValidName", () => {
    it("should validate a name with 3+ characters", () => {
      expect(validation.isValidName("João")).toBe(true);
    });

    it("should reject a name with less than 3 characters", () => {
      expect(validation.isValidName("Jo")).toBe(false);
    });

    it("should reject empty name", () => {
      expect(validation.isValidName("")).toBe(false);
    });
  });

  // Age
  describe("isValidAge", () => {
    it("should validate age between 1 and 50", () => {
      expect(validation.isValidAge(5)).toBe(true);
    });

    it("should reject age 0", () => {
      expect(validation.isValidAge(0)).toBe(false);
    });

    it("should reject age above 50", () => {
      expect(validation.isValidAge(51)).toBe(false);
    });
  });
});

describe("Masks", () => {
  // CPF Mask
  describe("cpf mask", () => {
    it("should apply CPF mask", () => {
      expect(masks.cpf("11144477735")).toBe("111.444.777-35");
    });

    it("should handle partial input", () => {
      expect(masks.cpf("111")).toBe("111");
    });

    it("should remove non-numeric characters", () => {
      expect(masks.cpf("111.444.777-35")).toBe("111.444.777-35");
    });
  });

  // Phone Mask
  describe("phone mask", () => {
    it("should apply 10-digit phone mask", () => {
      expect(masks.phone("1133334444")).toBe("(11) 3333-4444");
    });

    it("should apply 11-digit phone mask", () => {
      expect(masks.phone("11933334444")).toBe("(11) 93333-4444");
    });
  });

  // Unmask
  describe("unmask", () => {
    it("should remove all non-numeric characters", () => {
      expect(masks.unmask("111.444.777-35")).toBe("11144477735");
    });

    it("should handle phone unmasking", () => {
      expect(masks.unmask("(11) 9333-4444")).toBe("11933344");
    });
  });
});
