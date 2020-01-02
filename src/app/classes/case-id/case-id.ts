export class CaseId {
  constructor(caseId: string) {
    if (!caseId) {
      caseId = "";
      throw `Invalid case ID: ${caseId}`;
    }
    var regEx = /^([A-Z]{3})([0-9]{10})$/gi;
    var caseIdParseResult = regEx.exec(caseId);
    if (!caseIdParseResult) {
      throw `Invalid case ID: ${caseId}`;
    }
    this.prefix = caseIdParseResult[1];
    this.prefix = caseIdParseResult[2];
  }

  public prefix: string;
  public numCaseId: number;

  public toString(): string {
    if (!this.prefix || !this.numCaseId) {
      return "";
    }
    return `${this.prefix.toUpperCase()}${this.numCaseId
      .toString()
      .padStart(10, "0")}`;
  }
}
