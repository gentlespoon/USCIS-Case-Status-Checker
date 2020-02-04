import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ListExporterComponent } from "./list-exporter.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

describe("ListExporterComponent", () => {
  let component: ListExporterComponent;
  let fixture: ComponentFixture<ListExporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule],
      declarations: [ListExporterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.caseListSvc.caseIdList = {
      ABC0000000001: false,
      ABC0000000002: false
    };
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should hide UI", () => {
    var uiName = "listExporter";
    component.viewControllerSvc.show[uiName] = true;
    component.close();
    expect(component.viewControllerSvc.show[uiName]).toBeFalsy();
  });

  it("should encode TXT", () => {
    component.dataType = "txt";
    expect(component.data).toEqual("ABC0000000001\nABC0000000002");
  });

  it("should encode JSON", () => {
    component.dataType = "json";
    expect(component.data).toEqual(
      '[\n  "ABC0000000001",\n  "ABC0000000002"\n]'
    );
  });

  it("should encode csv", () => {
    component.dataType = "csv";
    expect(component.data).toEqual("ABC0000000001,ABC0000000002");
  });

  it("should encode csvq", () => {
    component.dataType = "csvq";
    expect(component.data).toEqual('"ABC0000000001","ABC0000000002"');
  });
});
