import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CaseListComponent } from "./case-list.component";
import { CaseListService } from "@app/services/case-list/case-list.service";
import { ViewControllerService } from "@app/services/view-controller/view-controller.service";

describe("CaseListComponent", () => {
  let component: CaseListComponent;
  let fixture: ComponentFixture<CaseListComponent>;

  beforeEach(async(() => {
    const spyCaseListService = jasmine.createSpyObj("CaseListService", {
      caseIdList: { ABC0000000001: false, ABC0000000002: false }
    });
    const spyViewControllerService = jasmine.createSpyObj(
      "ViewControllerService",
      {
        show: {
          greeting: false,
          listBuilder: false,
          listImporter: false,
          addCaseId: false,
          newList: false,
          addCase: false
        },
        hasPopup: (): boolean => {
          for (var key of Object.keys(this.show)) {
            if (this.show[key]) {
              return true;
            }
          }
          return false;
        }
      }
    );

    TestBed.configureTestingModule({
      declarations: [CaseListComponent],
      providers: [
        { provide: CaseListService, useValue: spyCaseListService },
        { provide: ViewControllerService, useValue: spyViewControllerService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    console.log(Object.keys(component.caseListSvc.caseIdList));
  });

  it("should show newList UI", () => {
    component.viewControllerSvc.show["newList"] = false;
    component.newList();
    expect(component.viewControllerSvc.show["newList"]).toBeTruthy();
  });

  it("should show listBuilder UI", () => {
    component.viewControllerSvc.show["listBuilder"] = false;
    component.buildList();
    expect(component.viewControllerSvc.show["listBuilder"]).toBeTruthy();
  });

  it("should show listImporter UI", () => {
    component.viewControllerSvc.show["listImporter"] = false;
    component.importList();
    expect(component.viewControllerSvc.show["listImporter"]).toBeTruthy();
  });

  it("should show listExporter UI", () => {
    component.viewControllerSvc.show["listExporter"] = false;
    component.exportList();
    expect(component.viewControllerSvc.show["listExporter"]).toBeTruthy();
  });

  it("should show addCase UI", () => {
    component.viewControllerSvc.show["addCase"] = false;
    component.addCase();
    expect(component.viewControllerSvc.show["addCase"]).toBeTruthy();
  });
});
