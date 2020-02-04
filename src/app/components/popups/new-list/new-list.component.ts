import { Component } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import { CaseListService } from "@app/services/case-list/case-list.service";

@Component({
  selector: "app-new-list",
  templateUrl: "./new-list.component.html",
  styleUrls: ["./new-list.component.scss"]
})
export class NewListComponent {
  constructor(
    public viewControllerSvc: ViewControllerService,
    public caseListSvc: CaseListService
  ) {}

  public clear() {
    this.caseListSvc.clearCaseIdList();
    this.viewControllerSvc.show["greeting"] = true;
    this.close();
  }

  public close() {
    this.viewControllerSvc.show["newList"] = false;
  }
}
