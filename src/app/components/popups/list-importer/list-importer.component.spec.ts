import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ListImporterComponent } from "./list-importer.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

describe("ListImporterComponent", () => {
  let component: ListImporterComponent;
  let fixture: ComponentFixture<ListImporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule],
      declarations: [ListImporterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should hide UI", () => {
    var uiName = "listImporter";
    component.viewControllerSvc.show[uiName] = true;
    component.close();
    expect(component.viewControllerSvc.show[uiName]).toBeFalsy();
  });
});
