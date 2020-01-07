import { Injectable } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import { CaseId } from "@app/classes/case-id/case-id";

@Injectable({
  providedIn: "root"
})
export class CaseListService {
  constructor(public viewControllerSvc: ViewControllerService) {}

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
    this.tryToAddToList(caseId);
    this.sortList();
    this.saveListToLocalStorage();
  }

  public addCaseIdsStringArray(caseIds: string[]): void {
    var currentCaseId: string = "";
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

  public addCaseIdsObjArray(caseIds: CaseId[]): void {
    var caseIdsStringArray: string[] = [];
    for (var caseIdObj of caseIds) {
      caseIdsStringArray.push(caseIdObj.toString());
    }
    this.addCaseIdsStringArray(caseIdsStringArray);
  }

  public clearCaseIdList(): void {
    this.caseIdList = {};
    this.saveListToLocalStorage();
  }

  public saveListToLocalStorage(): void {
    localStorage.setItem(
      "cachedCaseIdList",
      JSON.stringify(Object.keys(this.caseIdList))
    );
  }

  public loadListFromLocalStorage(): void {
    var loadedListString = localStorage.getItem("cachedCaseIdList");
    if (loadedListString) {
      var loadedList = JSON.parse(loadedListString);
      this.addCaseIdsStringArray(loadedList);
      if (!Object.keys(this.caseIdList).length) {
        this.showGreetings();
      }
    } else {
      this.showGreetings();
    }
  }

  public showGreetings() {
    this.viewControllerSvc.show["greeting"] = true;
  }
}
