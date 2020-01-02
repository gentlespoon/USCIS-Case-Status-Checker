import { Injectable } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import { CaseId } from "@app/classes/case-id/case-id";

@Injectable({
  providedIn: "root"
})
export class CaseListService {
  private DEV = true;

  constructor(private viewControllerSvc: ViewControllerService) {}

  public caseIdList: object = {};

  private tryToAddToList(caseId: string): void {
    var caseIdObj = new CaseId(caseId);
    var targetId = caseIdObj.toString();
    if (null != this.caseIdList[targetId]) {
      throw `${targetId} is already in the list`;
    }
    this.caseIdList[targetId] = false;
  }

  private sortList(): void {
    var ordered = {};
    Object.keys(this.caseIdList)
      .sort()
      .forEach(key => {
        ordered[key] = this.caseIdList[key];
      });
    this.caseIdList = ordered;
  }

  public addCaseId(caseId: string): void {
    if (this.DEV) console.log(`Adding caseId: ${caseId}`);
    this.tryToAddToList(caseId);
    this.sortList();
    this.saveListToLocalStorage();
  }

  public addCaseIds(caseIds: string[]): void {
    var currentCaseId = "";
    try {
      for (var caseId of caseIds) {
        currentCaseId = caseId;
        this.tryToAddToList(caseId);
      }
    } catch (ex) {
      throw `Failed to add case "${currentCaseId}":\n\n${ex}`;
    }
    this.sortList();
    this.saveListToLocalStorage();
  }

  public clearCaseIdList(): void {
    if (this.DEV) console.log("Clearing caseIdList");
    this.caseIdList = {};
    this.saveListToLocalStorage();
  }

  public saveListToLocalStorage(): void {
    if (this.DEV) console.log("Saving cached list");
    localStorage.setItem(
      "cachedCaseIdList",
      JSON.stringify(Object.keys(this.caseIdList))
    );
    if (this.DEV) console.log("Saved cached list");
  }

  public loadListFromLocalStorage(): void {
    if (this.DEV) console.log("Loading cached list");
    var loadedListString = localStorage.getItem("cachedCaseIdList");
    if (loadedListString) {
      var loadedList = JSON.parse(loadedListString);
      this.addCaseIds(loadedList);
      if (!Object.keys(this.caseIdList).length) {
        this.showGreetings();
      }
    } else {
      this.showGreetings();
    }
    if (this.DEV)
      console.log(
        `Finished loading cached list: ${Object.keys(this.caseIdList).length}`
      );
  }

  public showGreetings() {
    this.viewControllerSvc.show["greeting"] = true;
  }
}
