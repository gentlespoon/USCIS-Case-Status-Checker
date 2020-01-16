import { Component, OnInit } from "@angular/core";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { QueryControllerService } from "@app/services/query-controller/query-controller.service";

@Component({
  selector: "app-activity-list",
  templateUrl: "./activity-list.component.html",
  styleUrls: ["./activity-list.component.scss"]
})
export class ActivityListComponent implements OnInit {
  constructor(public queryControllerSvc: QueryControllerService) {}

  public faPlay = faPlay;
  public faPause = faPause;
  public faStop = faStop;

  ngOnInit() {}
}
