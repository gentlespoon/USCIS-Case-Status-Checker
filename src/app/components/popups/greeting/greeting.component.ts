import { Component, OnInit } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";

@Component({
  selector: "app-greeting",
  templateUrl: "./greeting.component.html",
  styleUrls: ["./greeting.component.scss"]
})
export class GreetingComponent implements OnInit {
  constructor(public viewControllerSvc: ViewControllerService) {}

  ngOnInit() {}

  public showListBuilder(): void {
    this.viewControllerSvc.show["listBuilder"] = true;
    this.hideGreeting();
  }

  public close(): void {
    this.hideGreeting();
  }

  private hideGreeting(): void {
    localStorage.setItem("notFirstUse", "1");
    this.viewControllerSvc.show["greeting"] = false;
  }
}
