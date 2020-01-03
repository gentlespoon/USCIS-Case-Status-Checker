import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { AddCaseComponent } from "./add-case.component";

describe("AddCaseComponent", () => {
  let component: AddCaseComponent;
  let fixture: ComponentFixture<AddCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AddCaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add a case when valid case ID is provided", () => {
    var validCaseId = "ABC1234567890";
    component.data = validCaseId;
    component.add();
    expect(Object.keys(component.caseListSvc.caseIdList)).toContain(
      validCaseId
    );
  });

  it("should show error message when invalid case ID is provided", () => {
    var invalidCaseId = "ABCDE";
    component.data = invalidCaseId;
    component.add();
    expect(component.errorMessage).toBeTruthy();
  });

  it("should hide UI", () => {
    var uiName = "addCase";
    component.viewControllerSvc.show[uiName] = true;
    component.close();
    expect(component.viewControllerSvc.show[uiName]).toBeFalsy();
  });
});
