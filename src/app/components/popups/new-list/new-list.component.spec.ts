import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NewListComponent } from "./new-list.component";
import { FormsModule } from "@angular/forms";

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
});
