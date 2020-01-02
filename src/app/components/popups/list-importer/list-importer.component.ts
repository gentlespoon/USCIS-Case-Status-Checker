import { Component, OnInit } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import { CaseListService } from "@app/services/case-list/case-list.service";

@Component({
  selector: "app-list-importer",
  templateUrl: "./list-importer.component.html",
  styleUrls: ["./list-importer.component.scss"]
})
export class ListImporterComponent implements OnInit {
  constructor(
    public viewControllerSvc: ViewControllerService,
    private caseListSvc: CaseListService
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
      case "xml":
        this.instructions = "Extensible Markup Language";
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
      default:
        this.instructions = `
Unsupported data type`;
        return;
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
    setTimeout(() => this.runImport(), 100);
  }

  public runImport() {
    try {
      this.data = this.data.trim();
      if (this.data) {
        var parsedData: string[] = this.parseData();
        // console.log(parsedData);
        this.caseListSvc.addCaseIds(parsedData);
        this.close();
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
        break;
      case "json":
        return JSON.parse(this.data);
        break;
      case "xml":
        throw "Not Implemented";
        break;
      case "csv":
        var tmp = this.data.split("\n").join();
        return tmp.split(",");
        break;
      case "csvq":
        var tmp = this.data.split("\n").join();
        return tmp.replace(/\"/g, "").split(",");
        break;
    }
  }

  public close() {
    this.viewControllerSvc.show["listImporter"] = false;
  }
}
