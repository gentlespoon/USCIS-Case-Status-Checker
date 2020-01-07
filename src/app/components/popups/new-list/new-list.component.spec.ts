import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NewListComponent } from "./new-list.component";
import { FormsModule } from "@angular/forms";
import { CaseId } from "@app/classes/case-id/case-id";

describe("NewListComponent", () => {
  let component: NewListComponent;
  let fixture: ComponentFixture<NewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewListComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should clear the list", () => {
    component.caseListSvc.caseIdList = {
      ABC0000000001: false,
      ABC0000000002: false
    };
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(2);
    component.clear();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
  });
});
