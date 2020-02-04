import { Component, OnInit, Query } from "@angular/core";
import { QueryControllerService } from "@app/services/query-controller/query-controller.service";
import { DataCacheService } from "@app/services/data-cache/data-cache.service";
import { CaseListService } from "@app/services/case-list/case-list.service";
import * as moment from "moment";
import {
  faTimesCircle,
  faEye,
  faEyeSlash as faEyeSlashSolid
} from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash as faEyeSlashRegular } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: "app-activity-list",
  templateUrl: "./activity-list.component.html",
  styleUrls: ["./activity-list.component.scss"]
})
export class ActivityListComponent implements OnInit {
  constructor(
    public dataCacheSvc: DataCacheService,
    public queryControllerSvc: QueryControllerService
  ) {}

  ngOnInit() {}

  moment = moment;
  Object = Object;

  public fa = {
    times: faTimesCircle,
    eye: faEye,
    eyeSlashSolid: faEyeSlashSolid,
    eyeSlashRegular: faEyeSlashRegular
  };

  public removeActivity(activity) {
    this.dataCacheSvc.removeActivity(activity);
  }

  public newList() {
    this.dataCacheSvc.removeAllActivities();
  }
}
