import { Component, OnInit } from "@angular/core";
import { CaseListService } from "@app/services/case-list/case-list.service";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";

@Component({
  selector: "app-list-exporter",
  templateUrl: "./list-exporter.component.html",
  styleUrls: ["./list-exporter.component.scss"]
})
export class ListExporterComponent implements OnInit {
  constructor(
    public caseListSvc: CaseListService,
    public viewControllerSvc: ViewControllerService
  ) {}

  ngOnInit() {
    this.dataType = "txt";
  }

  public data: string = "";

  private _dataType: string;
  get dataType() {
    return this._dataType;
  }

  set dataType(value: string) {
    var data = Object.keys(this.caseListSvc.caseIdList);
    switch (value) {
      case "txt":
        this.data = data.join("\n");
        break;
      case "json":
        this.data = JSON.stringify(data, null, 2);
        break;
      case "csv":
        this.data = data.join(",");
        break;
      case "csvq":
        this.data = data.join('","');
        this.data = `"${this.data}"`;
        break;
    }
    this._dataType = value;
  }

  public close() {
    this.viewControllerSvc.show["listExporter"] = false;
  }
}
