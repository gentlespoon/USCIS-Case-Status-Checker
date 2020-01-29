import { Component, OnInit } from "@angular/core";
import { QueryControllerService } from "@app/services/query-controller/query-controller.service";
import { DataCacheService } from "@app/services/data-cache/data-cache.service";
import { CaseListService } from "@app/services/case-list/case-list.service";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";
import { CaseStatus } from "@app/classes/case-status/case-status";

@Component({
  selector: "app-status-list",
  templateUrl: "./status-list.component.html",
  styleUrls: ["./status-list.component.scss"]
})
export class StatusListComponent implements OnInit {
  constructor(
    public queryControllerSvc: QueryControllerService,
    public dataCacheSvc: DataCacheService,
    public caseListSvc: CaseListService
  ) {}

  public faPlay = faPlay;
  public faPause = faPause;
  public faStop = faStop;
  public Object = Object;
  public moment = moment;

  ngOnInit() {}

  public get visibleActivities() {
    var va = [];
    for (var activity of Object.keys(this.dataCacheSvc.activities)) {
      if (this.dataCacheSvc.activities[activity]) {
        va.push(activity);
      }
    }
    return va;
  }

  public get caseIdList() {
    return Object.keys(this.caseListSvc.caseIdList);
  }

  public getCaseStatus(caseId: string, activity: string): CaseStatus {
    var a = this.dataCacheSvc.cache.filter(
      x => x.activity === activity && x.caseId === caseId
    );
    if (a.length) {
      return a[0];
    } else {
      return new CaseStatus();
    }
  }
}
