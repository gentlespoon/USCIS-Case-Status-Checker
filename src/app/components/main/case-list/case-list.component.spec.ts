import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CaseListComponent } from "./case-list.component";

describe("CaseListComponent", () => {
  let component: CaseListComponent;
  let fixture: ComponentFixture<CaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
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
