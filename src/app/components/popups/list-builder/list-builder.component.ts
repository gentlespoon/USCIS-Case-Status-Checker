import { Component, OnInit } from "@angular/core";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { CaseListService } from "@app/services/case-list/case-list.service";
import { CaseId } from "@app/classes/case-id/case-id";
import { BuilderMode } from "@app/classes/builder-mode/builder-mode";

@Component({
  selector: "app-list-builder",
  templateUrl: "./list-builder.component.html",
  styleUrls: ["./list-builder.component.scss"]
})
export class ListBuilderComponent implements OnInit {
  constructor(
    public viewControllerSvc: ViewControllerService,
    public caseListSvc: CaseListService
  ) {}

  ngOnInit() {
    this.mode = BuilderMode.prevNextRange;
  }

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  _mode: BuilderMode;
  private _stepWidth: number = 100;
  public get stepWidth(): number {
    return this._stepWidth;
  }
  public set stepWidth(n: number) {
    this._stepWidth = n;
    this.previewList();
  }

  private _prevCases: number = 10000;
  public get prevCases(): number {
    return this._prevCases;
  }
  public set prevCases(n: number) {
    this._prevCases = n;
    this.previewList();
  }

  private _nextCases: number = 1000;
  public get nextCases(): number {
    return this._nextCases;
  }
  public set nextCases(n: number) {
    this._nextCases = n;
    this.previewList();
  }

  private _baseCaseId: CaseId;

  get baseCaseId(): string {
    if (!this._baseCaseId) {
      return "";
    }
    return this._baseCaseId.toString();
  }

  set baseCaseId(value: string) {
    if (value === "") {
      this._baseCaseId = null;
      this._minCaseId = null;
      this._maxCaseId = null;
      return;
    }
    try {
      this._baseCaseId = new CaseId(value);
      this.explanation = "";
      this.previewList();
    } catch (ex) {
      this.explanation = ex;
    }
  }

  public explanation: string = "";

  public caseList: CaseId[] = [];

  public previewList(): [number, number, number] {
    if (!this.baseCaseId) {
      this.explanation = "Invalid baseCaseId";
      return;
    }
    if (this.stepWidth <= 0) {
      this.explanation = "Invalid stepWidth";
      return;
    }
    var minNumCaseId: number;
    var maxNumCaseId: number;
    var baseCaseIdObj: CaseId = new CaseId(this.baseCaseId);
    switch (this.mode) {
      case BuilderMode.prevNextRange:
        {
          if (!this.prevCases || this.prevCases < 0) {
            this.explanation = "Invalid prevCases";
            return;
          }
          if (!this.prevCases || this.nextCases < 0) {
            this.explanation = "Invalid nextCases";
            return;
          }
          minNumCaseId = baseCaseIdObj.numCaseId - this.prevCases;
          maxNumCaseId = baseCaseIdObj.numCaseId + this.nextCases;
        }

        break;

      case BuilderMode.absoluteRange:
        {
          if (!this.minCaseId || this.minCaseId >= this.baseCaseId) {
            this.explanation = "Invalid minCaseId";
            return;
          }
          if (!this.maxCaseId || this.maxCaseId <= this.baseCaseId) {
            this.explanation = "Invalid maxCaseId";
            return;
          }
          minNumCaseId = new CaseId(this.minCaseId).numCaseId;
          maxNumCaseId = new CaseId(this.maxCaseId).numCaseId;
        }
        break;
    }

    if (minNumCaseId < 0 || maxNumCaseId > 9999999999) {
      this.explanation = `Invalid case range`;
      return null;
    }

    var totalCases =
      1 + Math.floor((maxNumCaseId - minNumCaseId) / this.stepWidth);

    // generate messages
    this.explanation = `Check every ${
      this.stepWidth > 1 ? this.stepWidth + " " : ""
    }case${this.stepWidth > 1 ? "s" : ""} starting from ${baseCaseIdObj.prefix +
      minNumCaseId} to ${baseCaseIdObj.prefix +
      maxNumCaseId}. (${totalCases} cases)`;

    if (totalCases > 500) {
      this.explanation += `
      <p><strong>You are generating a list with more than 500 cases.</strong></p>`;
    }

    return [minNumCaseId, maxNumCaseId, totalCases];
  }

  public generateList() {
    this.caseList = [];
    this.explanation = "Generating case ID list...";
    if (!this.baseCaseId) {
      this.explanation = "Invalid baseCaseId";
      return;
    }
    if (this.stepWidth <= 0) {
      this.explanation = "Invalid stepWidth";
      return;
    }

    var minNumCaseId: number;
    var maxNumCaseId: number;
    var preview = this.previewList();
    if (!preview) {
      return;
    }
    minNumCaseId = preview[0];
    maxNumCaseId = preview[1];

    var baseCaseIdObj: CaseId = new CaseId(this.baseCaseId);
    var leftPart: CaseId[] = [];
    var rightPart: CaseId[] = [];

    // generate left part
    for (
      var currentNumCaseId = baseCaseIdObj.numCaseId - this.stepWidth;
      currentNumCaseId >= minNumCaseId;
      currentNumCaseId -= this.stepWidth
    ) {
      leftPart.push(new CaseId(baseCaseIdObj.prefix, currentNumCaseId));
    }

    // generate right part
    for (
      var currentNumCaseId = baseCaseIdObj.numCaseId + this.stepWidth;
      currentNumCaseId <= maxNumCaseId;
      currentNumCaseId += this.stepWidth
    ) {
      rightPart.push(new CaseId(baseCaseIdObj.prefix, currentNumCaseId));
    }

    // merge two parts
    this.caseList = leftPart.reverse();
    this.caseList.push(baseCaseIdObj);
    this.caseList = this.caseList.concat(rightPart);

    // import list
    try {
      this.caseListSvc.addCaseIdsObjArray(this.caseList);
      this.close();
    } catch (ex) {
      this.explanation = ex;
    }
  }

  private _minCaseId: CaseId;
  get minCaseId(): string {
    if (!this._minCaseId) {
      return "";
    }
    return this._minCaseId.toString();
  }
  set minCaseId(value: string) {
    if (!this._baseCaseId || value === "") {
      this._minCaseId = null;
      return;
    }
    try {
      var caseId = new CaseId(value);
      if (caseId.prefix !== this._baseCaseId.prefix) {
        throw `case prefix mismatch`;
      }
      if (caseId.numCaseId >= this._baseCaseId.numCaseId) {
        throw `must be smaller than base ID`;
      }
      this._minCaseId = caseId;
      this.explanation = "";
      this.previewList();
    } catch (ex) {
      this.explanation = `Invalid mininum Case ID: ${ex}`;
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
    if (!this._baseCaseId || value === "") {
      this._maxCaseId = null;
      return;
    }
    try {
      var caseId = new CaseId(value);
      if (caseId.prefix !== this._baseCaseId.prefix) {
        throw `case prefix mismatch`;
      }
      if (caseId.numCaseId <= this._baseCaseId.numCaseId) {
        throw `must be greater than base ID`;
      }
      this._maxCaseId = caseId;
      this.explanation = "";
      this.previewList();
    } catch (ex) {
      this.explanation = `Invalid maximum Case ID: ${ex}`;
    }
  }

  public BuilderMode = BuilderMode;

  get mode() {
    return this._mode;
  }
  set mode(value: BuilderMode) {
    this._mode = value;
  }

  public close() {
    this.viewControllerSvc.show["listBuilder"] = false;
  }
}
