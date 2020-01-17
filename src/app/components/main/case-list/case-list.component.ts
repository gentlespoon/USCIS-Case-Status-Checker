import { Component, OnInit } from "@angular/core";
import { CaseListService } from "@app/services/case-list/case-list.service";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import {
  faTimesCircle,
  faFileImport,
  faFileExport,
  faPlus,
  faPlusSquare,
  faTools
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-case-list",
  templateUrl: "./case-list.component.html",
  styleUrls: ["./case-list.component.scss"]
})
export class CaseListComponent {
  constructor(
    public caseListSvc: CaseListService,
    public viewControllerSvc: ViewControllerService
  ) {}

  public Object = Object;

  public fa = {
    times: faTimesCircle,
    fileImport: faFileImport,
    fileExport: faFileExport,
    plus: faPlus,
    plusSquare: faPlusSquare,
    tools: faTools
  };

  newList() {
    this.viewControllerSvc.show["newList"] = true;
  }

  buildList() {
    this.viewControllerSvc.show["listBuilder"] = true;
  }

  importList() {
    this.viewControllerSvc.show["listImporter"] = true;
  }

  exportList() {
    this.viewControllerSvc.show["listExporter"] = true;
  }

  addCase() {
    this.viewControllerSvc.show["addCase"] = true;
  }

  removeCase(caseId: string) {
    this.caseListSvc.removeCaseId(caseId);
  }
}
