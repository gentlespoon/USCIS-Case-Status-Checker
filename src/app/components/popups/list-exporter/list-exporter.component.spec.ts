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

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
