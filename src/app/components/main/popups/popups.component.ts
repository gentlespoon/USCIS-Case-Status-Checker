import { Component, OnInit } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";

@Component({
  selector: "app-popups",
  templateUrl: "./popups.component.html",
  styleUrls: ["./popups.component.scss"]
})
export class PopupsComponent {
  constructor(public viewControllerSvc: ViewControllerService) {}
}
