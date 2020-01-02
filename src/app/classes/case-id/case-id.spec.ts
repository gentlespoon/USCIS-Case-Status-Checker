import { CaseId } from "./case-id";

describe("CaseId", () => {
  it("should create an instance for valid Case ID", () => {
    var validCaseIds: string[] = ["ABC1234567890", "WAC1234567890"];
    for (var validCaseIdString of validCaseIds) {
      var caseId = new CaseId(validCaseIdString);
      console.log("\n\n\n\n" + caseId.toString() + "\n\n\n\n");
      expect(caseId).toBeTruthy();
      expect(caseId.toString()).toBe(validCaseIdString);
    }
  });

  it("should throw exception for invalid Case ID", () => {
    var invalidCaseIds = [
      [null, ""],
      ["", ""],
      ["ABC12345", "ABC12345"],
      ["12345ABC67890", "12345ABC67890"]
    ];
    for (var invalidCaseId of invalidCaseIds) {
      expect(() => new CaseId(invalidCaseId[0])).toThrow(
        `Invalid case ID: ${invalidCaseId[1]}`
      );
    }
  });
});
