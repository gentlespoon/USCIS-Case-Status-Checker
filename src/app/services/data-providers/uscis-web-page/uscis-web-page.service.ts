import { Injectable } from "@angular/core";
import { IDataProvider } from "../../../interfaces/i-data-provider";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, Observer } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { CaseStatus } from "@app/classes/case-status/case-status";
import { ToastService } from "@app/services/toast/toast.service";
@Injectable({
  providedIn: "root"
})
export class UscisWebPageService implements IDataProvider {
  constructor(private httpClient: HttpClient, private toastSvc: ToastService) {}

  private USCIS_API_URL: string =
    "https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=";

  public getCaseInfo(caseId: string): Observable<CaseStatus> {
    return Observable.create((observer: Observer<CaseStatus>) => {
      this.httpClient
        .get(this.USCIS_API_URL + caseId, { responseType: "text" })
        .subscribe(
          res => {
            observer.next(this.analyzeResult(res));
            observer.complete();
          },
          err => observer.error(err)
        );
    });
  }

  public analyzeResult(html: string): CaseStatus {
    var caseStatus = new CaseStatus();

    // parse DOM tree
    var domParser = new DOMParser();
    var document = domParser.parseFromString(html, "text/html");

    // check for error
    var errorBody = document.querySelector("#formErrorMessages");
    if (errorBody.children.length) {
      caseStatus.title = "Error";
      let errors = errorBody.querySelectorAll("li");
      if (errors.length) {
        caseStatus.text = errors[0].innerText.trim();
      }
      caseStatus.rawText = errorBody.innerHTML.trim();
      return caseStatus;
    }

    // if no error
    var infoBody = document.querySelector(".box3.uscis-seal");

    let rowsTextCenter = infoBody.querySelector(".rows.text-center");
    caseStatus.title = rowsTextCenter.querySelector("h1").innerText.trim();
    caseStatus.text = rowsTextCenter.querySelector("p").innerText.trim();
    caseStatus.rawText = rowsTextCenter.innerHTML.trim();

    return caseStatus;
  }
}
