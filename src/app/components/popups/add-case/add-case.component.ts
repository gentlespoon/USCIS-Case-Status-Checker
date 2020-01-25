import { Component, OnInit } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import { CaseListService } from "@app/services/case-list/case-list.service";
import { ToastService } from "@app/services/toast/toast.service";

@Component({
  selector: "app-add-case",
  templateUrl: "./add-case.component.html",
  styleUrls: ["./add-case.component.scss"]
})
export class AddCaseComponent {
  constructor(
    public viewControllerSvc: ViewControllerService,
    public caseListSvc: CaseListService,
    private toastSvc: ToastService
  ) {}

  public data: string = "";
  public disableAddButton: boolean = false;
  public errorMessage = "";

  // unblock the UI in case adding is slow.
  public add() {
    this.disableAddButton = true;
    try {
      if (this.data) {
        this.caseListSvc.addCaseId(this.data);
        this.close();
      } else {
        return;
      }
    } catch (ex) {
      this.errorMessage = `Failed to add case: ${ex}`;
      this.toastSvc.show(this.errorMessage, {
        classname: "bg-danger text-light",
        autohide: true,
        delay: 5000
      });
    }
    this.disableAddButton = false;
  }

  public close() {
    this.viewControllerSvc.show["addCase"] = false;
  }
}
