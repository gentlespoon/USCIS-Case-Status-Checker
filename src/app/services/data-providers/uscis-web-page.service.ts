import { Injectable } from "@angular/core";
import { IDataProvider } from "../../interfaces/i-data-provider";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UscisWebPageService implements IDataProvider {
  constructor(private httpClient: HttpClient) {}

  private USCIS_API_URL: "https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=";

  public getCaseInfo(caseId: string, callback: Function): void {
    this.httpClient
      .get(this.USCIS_API_URL + caseId, { responseType: "text" })
      .subscribe(
        response => callback(true, response),
        error => callback(false, error)
      );
  }
}
