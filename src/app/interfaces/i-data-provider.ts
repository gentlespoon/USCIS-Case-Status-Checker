import { Observable } from "rxjs";

export interface IDataProvider {
  getCaseInfo(caseId: string, callback: Function);
}
