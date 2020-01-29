import { Observable } from "rxjs";
import { CaseStatus } from "@app/classes/case-status/case-status";

export interface IDataProvider {
  getCaseInfo(caseId: string): Observable<CaseStatus>;
}
