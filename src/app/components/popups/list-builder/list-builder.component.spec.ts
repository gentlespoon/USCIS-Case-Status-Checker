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

  it("should set baseCaseId", () => {
    var validCaseId = "ABC1234567890";
    component.baseCaseId = validCaseId;
    expect(component.baseCaseId).toEqual(validCaseId);
  });

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
});
