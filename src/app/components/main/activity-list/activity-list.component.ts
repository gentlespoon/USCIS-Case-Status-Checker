import { Component, OnInit } from "@angular/core";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { QueryControllerService } from "@app/services/query-controller/query-controller.service";
import { DataCacheService } from "@app/services/data-cache/data-cache.service";
import { CaseListService } from "@app/services/case-list/case-list.service";

@Component({
  selector: "app-activity-list",
  templateUrl: "./activity-list.component.html",
  styleUrls: ["./activity-list.component.scss"]
})
export class ActivityListComponent implements OnInit {
  constructor(
    public queryControllerSvc: QueryControllerService,
    public dataCacheSvc: DataCacheService,
    public caseListSvc: CaseListService
  ) {}

  public faPlay = faPlay;
  public faPause = faPause;
  public faStop = faStop;
  public Object = Object;

  ngOnInit() {}
}
