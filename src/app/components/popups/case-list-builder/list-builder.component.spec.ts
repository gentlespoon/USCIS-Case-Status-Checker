import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ListBuilderComponent } from "./list-builder.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CaseId } from "@app/classes/case-id/case-id";
import { BuilderMode } from "@app/classes/builder-mode/builder-mode";

describe("ListBuilderComponent", () => {
  let component: ListBuilderComponent;
  let fixture: ComponentFixture<ListBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule, FontAwesomeModule],
      declarations: [ListBuilderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should hide UI", () => {
    var uiName = "listBuilder";
    component.viewControllerSvc.show[uiName] = true;
    component.close();
    expect(component.viewControllerSvc.show[uiName]).toBeFalsy();
  });

  it("should initialize with prevNextRange mode", () => {
    component.ngOnInit();
    expect(component.mode).toEqual(BuilderMode.prevNextRange);
  });

  // base case id

  it("should set baseCaseId for valid baseCaseId", () => {
    var validCaseId = "ABC1234567890";
    component.baseCaseId = validCaseId;
    expect(component.baseCaseId).toEqual(validCaseId);
  });

  it("should not set baseCaseId for invalid baseCaseId", () => {
    var invalidCaseId = "ABC12345";
    component.baseCaseId = invalidCaseId;
    expect(component.baseCaseId).toEqual("");
  });

  it("should remove baseCaseId for empty baseCaseId", () => {
    var validCaseId = "ABC1234567890";
    component.baseCaseId = validCaseId;
    expect(component.baseCaseId).toEqual(validCaseId);
    var emptyCaseId = "";
    component.baseCaseId = emptyCaseId;
    expect(component.baseCaseId).toEqual("");
    expect(component.minCaseId).toEqual("");
    expect(component.maxCaseId).toEqual("");
  });

  // min case id

  it("should set minCaseId for valid minCaseId", () => {
    component.baseCaseId = "ABC1000000010";
    var validCaseId = "ABC1000000000";
    component.minCaseId = validCaseId;
    expect(component.minCaseId).toEqual(validCaseId);
  });

  it("should not set minCaseId for invalid minCaseId", () => {
    component.baseCaseId = "ABC1000000010";
    // greater case id
    var invalidCaseId = "ABC1000000011";
    component.minCaseId = invalidCaseId;
    expect(component.minCaseId).toEqual("");
    // mismatch prefix
    invalidCaseId = "AAA1000000011";
    component.minCaseId = invalidCaseId;
    expect(component.minCaseId).toEqual("");
  });

  it("should remove minCaseId for empty minCaseId", () => {
    component.baseCaseId = "ABC1000000010";
    var validCaseId = "ABC1000000009";
    component.minCaseId = validCaseId;
    expect(component.minCaseId).toEqual(validCaseId);
    component.minCaseId = "";
    expect(component.minCaseId).toEqual("");
  });

  // max case id

  it("should set maxCaseId for valid maxCaseId", () => {
    component.baseCaseId = "ABC1000000010";
    var validCaseId = "ABC1000000011";
    component.maxCaseId = validCaseId;
    expect(component.maxCaseId).toEqual(validCaseId);
  });

  it("should not set maxCaseId for invalid maxCaseId", () => {
    component.baseCaseId = "ABC1000000010";
    // smaller case id
    var invalidCaseId = "ABC1000000009";
    component.maxCaseId = invalidCaseId;
    expect(component.maxCaseId).toEqual("");
    // mismatch prefix
    invalidCaseId = "AAA1000000009";
    component.maxCaseId = invalidCaseId;
    expect(component.maxCaseId).toEqual("");
  });

  it("should remove maxCaseId for empty maxCaseId", () => {
    component.baseCaseId = "ABC1000000010";
    var validCaseId = "ABC1000000011";
    component.maxCaseId = validCaseId;
    expect(component.maxCaseId).toEqual(validCaseId);
    component.maxCaseId = "";
    expect(component.maxCaseId).toEqual("");
  });

  // generate list

  it("should show error message with invalid params", () => {
    // invalid baseCaseID
    component.generateList();
    expect(component.explanation).toEqual("Invalid baseCaseId");
    component.baseCaseId = "ABC5000000000";

    // invalid stepWidth
    component.stepWidth = 0;
    component.generateList();
    expect(component.explanation).toEqual("Invalid stepWidth");
    component.stepWidth = 1000;

    // prevNextRange mode
    {
      component.mode = BuilderMode.prevNextRange;

      // invalid prevCases
      component.prevCases = 0;
      component.generateList();
      expect(component.explanation).toEqual("Invalid prevCases");
      component.prevCases = 10000;

      // invalid nextCases
      component.nextCases = 0;
      component.generateList();
      expect(component.explanation).toEqual("Invalid nextCases");
    }

    // absoluteRange mode
    {
      component.mode = BuilderMode.absoluteRange;

      // invalid minCaseId
      component.generateList();
      expect(component.explanation).toEqual("Invalid minCaseId");
      component.minCaseId = "ABC4999950000";

      // invalid maxCaseId
      component.generateList();
      expect(component.explanation).toEqual("Invalid maxCaseId");
    }
  });

  it("should generate a valid list in prevNextRange mode with valid params", () => {
    // setup
    var validCaseIdString = "ABC5000000000";
    component.baseCaseId = validCaseIdString;
    component.mode = BuilderMode.prevNextRange;
    component.prevCases = 50000;
    component.nextCases = 50000;
    component.stepWidth = 1000;

    // execute
    component.generateList();

    // validate
    var validBaseCaseIdObj = new CaseId(validCaseIdString);
    // generated a list.
    expect(component.caseList.length).toBeGreaterThanOrEqual(1);
    // first
    expect(component.caseList[0].prefix).toEqual(validBaseCaseIdObj.prefix);
    expect(component.caseList[0].numCaseId).toBeLessThan(
      validBaseCaseIdObj.numCaseId
    );
    // last
    expect(component.caseList[component.caseList.length - 1].prefix).toEqual(
      validBaseCaseIdObj.prefix
    );
    expect(
      component.caseList[component.caseList.length - 1].numCaseId
    ).toBeGreaterThan(validBaseCaseIdObj.numCaseId);
  });

  it("should generate a valid list in absoluteRange mode with valid params", () => {
    // setup
    var validCaseIdString = "ABC5000000000";
    component.baseCaseId = validCaseIdString;
    component.mode = BuilderMode.absoluteRange;
    component.minCaseId = "ABC4999950000";
    component.maxCaseId = "ABC5000050000";
    component.stepWidth = 1000;

    // execute
    component.generateList();

    // validate
    var validBaseCaseIdObj = new CaseId(validCaseIdString);
    // generated a list.
    expect(component.caseList.length).toBeGreaterThanOrEqual(1);
    // first
    expect(component.caseList[0].prefix).toEqual(validBaseCaseIdObj.prefix);
    expect(component.caseList[0].numCaseId).toBeLessThan(
      validBaseCaseIdObj.numCaseId
    );
    // last
    expect(component.caseList[component.caseList.length - 1].prefix).toEqual(
      validBaseCaseIdObj.prefix
    );
    expect(
      component.caseList[component.caseList.length - 1].numCaseId
    ).toBeGreaterThan(validBaseCaseIdObj.numCaseId);
  });

  it("should not import list when caseList cannot be built", () => {
    var validCaseIdString = "ABC5000000000";
    component.baseCaseId = validCaseIdString;
    component.mode = BuilderMode.absoluteRange;
    component.minCaseId = "ABC5999950000";
    component.maxCaseId = "ABC4000050000";
    component.stepWidth = 1000;
    component.generateList();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
  });

  it("should import list when caseList can be built", () => {
    var validCaseIdString = "ABC5000000000";
    component.baseCaseId = validCaseIdString;
    component.mode = BuilderMode.absoluteRange;
    component.minCaseId = "ABC4999950000";
    component.maxCaseId = "ABC5000050000";
    component.stepWidth = 1000;
    component.generateList();
    expect(
      Object.keys(component.caseListSvc.caseIdList).length
    ).toBeGreaterThan(1);
  });

  it("should show error message when caseList contains case that is already imported", () => {
    component.caseListSvc.addCaseId("ABC5000000000");
    var validCaseIdString = "ABC5000000000";
    component.baseCaseId = validCaseIdString;
    component.mode = BuilderMode.absoluteRange;
    component.minCaseId = "ABC4999950000";
    component.maxCaseId = "ABC5000050000";
    component.stepWidth = 1000;
    component.generateList();
    expect(component.explanation.indexOf("Failed")).toEqual(0);
  });

  it("should not have '1 cases' for stepWidth=1", () => {
    var validCaseIdString = "ABC5000000000";
    component.baseCaseId = validCaseIdString;
    component.mode = BuilderMode.absoluteRange;
    component.minCaseId = "ABC4999999995";
    component.maxCaseId = "ABC5000000005";
    component.stepWidth = 1;
    component.generateList();
    expect(component.explanation.indexOf(" 1 ")).toEqual(-1);
    expect(component.explanation.indexOf(" cases ")).toEqual(-1);
  });
});
