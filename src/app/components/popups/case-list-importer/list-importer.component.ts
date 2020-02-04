import { Component, OnInit } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import { CaseListService } from "@app/services/case-list/case-list.service";
import { CaseId } from "@app/classes/case-id/case-id";

@Component({
  selector: "app-list-importer",
  templateUrl: "./list-importer.component.html",
  styleUrls: ["./list-importer.component.scss"]
})
export class ListImporterComponent implements OnInit {
  constructor(
    public viewControllerSvc: ViewControllerService,
    public caseListSvc: CaseListService
  ) {}

  ngOnInit() {
    this.dataType = "txt";
  }

  private _dataType: string = "txt";

  get dataType() {
    return this._dataType;
  }

  set dataType(value: string) {
    switch (value) {
      case "txt":
        this.instructions = `
Each line contains one case ID

ABC1234123412
WAC4312432143
LIN6789678967`;
        break;
      case "json":
        this.instructions = `
JavaScript Object Notation

[
  "ABC1234123412",
  "WAC4321432143",
  "LIN6789678967"
]`;
        break;
      case "csv":
        this.instructions = `
Comma Splitted Values

ABC1234123412,WAC4321432143,LIN6789678967`;
        break;
      case "csvq":
        this.instructions = `
Comma Splitted Values with Quotation Marks

"ABC1234123412","WAC4321432143","LIN6789678967"`;
        break;
    }
    this._dataType = value;
  }

  public data: string;
  public instructions: string;

  public disableImportButton: boolean = false;

  public errorMessage: string = "";

  public import() {
    this.errorMessage = "";
    this.disableImportButton = true;
    try {
      this.data = this.data.trim();
      if (this.data) {
        var parsedData: string[] = this.parseData();
        var caseIdObjectArray: CaseId[] = [];
        for (var caseIdString of parsedData) {
          caseIdString = caseIdString.trim();
          if (caseIdString === "") {
            continue;
          }
          caseIdObjectArray.push(new CaseId(caseIdString));
        }
        this.caseListSvc.addCaseIdsObjArray(caseIdObjectArray);
        this.close();
      } else {
        return;
      }
    } catch (ex) {
      this.errorMessage = `Failed to import case list.<br>${ex}`;
    }
    this.disableImportButton = false;
  }

  private parseData(): string[] {
    switch (this.dataType) {
      case "txt":
        return this.data.split("\n");
      case "json":
        return JSON.parse(this.data);
      case "csv":
        var tmp = this.data
          .split("\n")
          .join()
          .replace(/\"/g, "");
        return tmp.split(",");
    }
  }

  public close() {
    this.viewControllerSvc.show["listImporter"] = false;
  }
}
