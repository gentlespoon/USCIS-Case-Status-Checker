export class CaseId {
  constructor(caseIdOrPrefix: string, numCaseId?: number) {
    if (!caseIdOrPrefix) {
      throw "Invalid case ID";
    }

    if (!numCaseId && numCaseId !== 0) {
      var regEx = /^([A-Z]{3})([0-9]{10})$/gi;
      var caseIdParseResult = regEx.exec(caseIdOrPrefix);
      if (!caseIdParseResult) {
        throw "Invalid case ID";
      }
      this.prefix = caseIdParseResult[1].toUpperCase();
      this.numCaseId = parseInt(caseIdParseResult[2]);
    } else {
      if (caseIdOrPrefix.length !== 3) {
        throw "Invalid case ID";
      }
      if (numCaseId < 0) {
        throw "Invalid case ID";
      }
      this.prefix = caseIdOrPrefix;
      this.numCaseId = numCaseId;
    }
  }

  public prefix: string;
  public numCaseId: number;

  public toString(): string {
    if (!this.prefix || (!this.numCaseId && this.numCaseId !== 0)) {
      return "";
    }
    return `${this.prefix.toUpperCase()}${this.numCaseId
      .toString()
      .padStart(10, "0")}`;
  }
}
