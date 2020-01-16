import { Injectable } from "@angular/core";
import { IDataProvider } from "../../../interfaces/i-data-provider";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UscisWebPageService implements IDataProvider {
  constructor(private httpClient: HttpClient) {}

  private USCIS_API_URL: string =
    "https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=";

  public getCaseInfo(caseId: string): Observable<string> {
    return this.httpClient.get(this.USCIS_API_URL + caseId, {
      responseType: "text"
    });
  }
}
