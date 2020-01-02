export interface IDataProvider {
  getCaseInfo: (caseId: string, callback: Function) => void;
}
