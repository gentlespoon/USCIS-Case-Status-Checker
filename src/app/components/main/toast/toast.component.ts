import { Component, OnInit, TemplateRef } from "@angular/core";
import { ToastService } from "@app/services/toast/toast.service";

@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"]
})
export class ToastComponent implements OnInit {
  constructor(public toastSvc: ToastService) {}

  ngOnInit() {}

  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
