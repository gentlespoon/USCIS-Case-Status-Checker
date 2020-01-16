import { Observable } from "rxjs";

export interface IDataProvider {
  getCaseInfo(caseId: string): Observable<string>;
}
