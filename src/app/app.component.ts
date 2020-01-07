import { Component, OnInit } from "@angular/core";
import { ElectronService } from "./services/electron/electron.service";
import { AppConfig } from "../environments/environment";
import { DataCacheService } from "./services/data-cache/data-cache.service";
import { ViewControllerService } from "./services/view-controller/view-controller.service";
import { CaseListService } from "./services/case-list/case-list.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  private DEV = false;

  constructor(
    public electronSvc: ElectronService,
    public dataCacheSvc: DataCacheService,
    public viewControllerSvc: ViewControllerService,
    public caseListSvc: CaseListService
  ) {}

  ngOnInit() {
    // see if we need to show disclaimer
    var uaAgreed = localStorage.getItem("uaAgreed");
    if (uaAgreed !== "true") {
      this.viewControllerSvc.show["userAgreement"] = true;
    }

    this.caseListSvc.loadListFromLocalStorage();

    this.dataCacheSvc.loadCache();
  }
}
