import { Component, OnInit } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { CaseListService } from "@app/services/case-list/case-list.service";
import { CaseId } from "@app/classes/case-id/case-id";

@Component({
  selector: "app-list-builder",
  templateUrl: "./list-builder.component.html",
  styleUrls: ["./list-builder.component.scss"]
})
export class ListBuilderComponent implements OnInit {
  constructor(
    private viewControllerSvc: ViewControllerService,
    private caseListSvc: CaseListService
  ) {}

  ngOnInit() {
    this.mode = "prevNextRange";
  }

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  _mode: string;
  public stepWidth: number = 100;

  private _baseCaseId: CaseId = new CaseId("YSC1890044628");

  get baseCaseId(): string {
    if (!this._baseCaseId) {
      return "";
    }
    return this._baseCaseId.toString();
  }

  set baseCaseId(value: string) {
    try {
      this._baseCaseId = new CaseId(value);
    } catch (ex) {
      this.errorMessage = ex;
    }
  }

  private errorMessage: string = "";

  get explanation(): string {
    if (this.errorMessage) return this.errorMessage;
    return `Check every ${
      this.stepWidth ? (this.stepWidth > 1 ? this.stepWidth : "") : "_"
    } case${this.stepWidth > 1 ? "s" : ""} starting from ${
      this.firstCaseId
    } to ${this.lastCaseId}.`;
  }

  public firstCaseId: string = "";
  public lastCaseId: string = "";
  public calculateRange() {
    throw "Not implemented";
  }

  public prevCases: number = 10000;
  public nextCases: number = 1000;

  private _minCaseId: CaseId;
  get minCaseId(): string {
    if (!this._minCaseId) {
      return "";
    }
    return this._minCaseId.toString();
  }
  set minCaseId(value: string) {
    if (!this._baseCaseId) return;
    try {
      var caseId = new CaseId(value);
      if (caseId.prefix !== this._baseCaseId.prefix) {
        throw `case prefix mismatch`;
      }
      if (caseId.numCaseId >= this._baseCaseId.numCaseId) {
        throw `must be smaller than base ID`;
      }
      this._minCaseId = caseId;
    } catch (ex) {
      this.errorMessage = `Invalid mininum Case ID: ${ex}`;
    }
  }

  private _maxCaseId: CaseId;
  get maxCaseId(): string {
    if (!this._maxCaseId) {
      return "";
    }
    return this._maxCaseId.toString();
  }
  set maxCaseId(value: string) {
    if (!this._baseCaseId) return;
    try {
      var caseId = new CaseId(value);
      if (caseId.prefix !== this._baseCaseId.prefix) {
        throw `case prefix mismatch`;
      }
      if (caseId.numCaseId >= this._baseCaseId.numCaseId) {
        throw `must be greater than base ID`;
      }
      this._maxCaseId = caseId;
    } catch (ex) {
      this.errorMessage = `Invalid maximum Case ID: ${ex}`;
    }
  }

  get mode() {
    return this._mode;
  }
  set mode(value: string) {
    switch (value) {
      case "prevNextRange":
        break;
      case "absoluteRange":
        break;
      default:
        return;
    }
    this._mode = value;
  }

  public close() {
    this.viewControllerSvc.show["listBuilder"] = false;
  }
}
