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

  it("should provide instructions", () => {
    component.dataType = "txt";
    expect(component.instructions).toBeTruthy();
    component.dataType = "json";
    expect(component.instructions).toBeTruthy();
    component.dataType = "csv";
    expect(component.instructions).toBeTruthy();
    component.dataType = "csvq";
    expect(component.instructions).toBeTruthy();
  });

  it("should not import empty data", () => {
    component.data = "";
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
  });

  it("should import valid TXT data", () => {
    component.dataType = "txt";
    component.data = "ABC0000000001\nABC0000000002";
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(2);
  });

  it("should not import invalid TXT data", () => {
    component.dataType = "txt";
    component.data = "ABC0000000000\nABCD000000002";
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
    component.data = "ABC000000000\nABCD000000002";
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
    component.data = "ABC000000000\n\n\n\n\n\nABCD000000002";
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
  });

  it("should import valid JSON data", () => {
    component.dataType = "json";
    component.data = '["ABC0000000001","","ABC0000000002"]';
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(2);
  });

  it("should not import invalid JSON data", () => {
    component.dataType = "json";
    // invalid case id
    component.data = '["ABC000000000","ABCD00002"]';
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
    // malformed json
    component.data = '{"ABC12345678980","ABC12345678909"]';
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
  });

  it("should import valid CSV data", () => {
    component.dataType = "csv";
    // without quotation mark
    component.data = '"ABC0000000001",,"ABC0000000002"';
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(2);
    // with quotation mark
    component.data = "ABC0000000003,ABC0000000004";
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(4);
  });

  it("should not import invalid CSV data", () => {
    component.dataType = "csv";
    // invalid case id
    component.data = '"ABC00000000","ABCD00002"';
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
    // malformed json
    component.data = "ABC123456789802,ABCD12345789";
    component.import();
    expect(Object.keys(component.caseListSvc.caseIdList).length).toEqual(0);
  });
});
