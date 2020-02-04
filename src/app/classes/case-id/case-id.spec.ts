import { CaseId } from "./case-id";

describe("CaseId", () => {
  it("should create an instance for valid Case ID", () => {
    var validCaseIds: [string, number][] = [
      ["ABC", 0],
      ["ABC", 123],
      ["ABC", 4567890],
      ["ABC", 1029385728],
      ["ABC0000000000", undefined],
      ["ABC0000000000", null]
    ];
    for (var caseIdComponents of validCaseIds) {
      var caseId = new CaseId(caseIdComponents[0], caseIdComponents[1]);
      expect(caseId).toBeTruthy();
      if (!caseIdComponents[1] && caseIdComponents[1] !== 0) {
        expect(caseId.toString()).toEqual(caseIdComponents[0]);
      } else {
        expect(caseId.toString()).toEqual(
          `${caseIdComponents[0]}${caseIdComponents[1]
            .toString()
            .padStart(10, "0")}`
        );
      }
    }
  });

  it("should throw exception for invalid Case ID", () => {
    var invalidCaseIds: [string, number][] = [
      // valid, invalid
      ["ABC", null],
      ["ABC", undefined],
      ["ABC", -1],
      // invalid, valid
      [null, 0],
      [undefined, 0],
      ["ABCD", 0],
      // invalid, invalid
      [null, null],
      [null, undefined],
      [undefined, null],
      [undefined, undefined],
      ["ABCD", null],
      ["ABCD", undefined]
    ];
    for (var caseIdComponents of invalidCaseIds) {
      expect(
        () => new CaseId(caseIdComponents[0], caseIdComponents[1])
      ).toThrow("Invalid case ID");
    }
  });
});
