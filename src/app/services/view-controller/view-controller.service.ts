import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ViewControllerService {
  public show: object = {
    userAgreement: false,
    greeting: false,
    listBuilder: false,
    listImporter: false,
    addCaseId: false,
    newList: false
  };

  get hasPopup(): boolean {
    // console.log(this.show);
    for (var key of Object.keys(this.show)) {
      if (this.show[key]) {
        return true;
      }
    }
    return false;
  }
}
