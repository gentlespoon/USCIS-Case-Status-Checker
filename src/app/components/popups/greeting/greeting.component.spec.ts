import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GreetingComponent } from "./greeting.component";

describe("GreetingComponent", () => {
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GreetingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should hide UI", () => {
    var uiName = "greeting";
    component.viewControllerSvc.show[uiName] = true;
    component.close();
    expect(component.viewControllerSvc.show[uiName]).toBeFalsy();
  });

  it("should show listBuilder UI and hide greeting UI", () => {
    component.viewControllerSvc.show["listBuilder"] = false;
    component.viewControllerSvc.show["greeting"] = false;
    component.showListBuilder();
    expect(component.viewControllerSvc.show["listBuilder"]).toBeTruthy();
    expect(component.viewControllerSvc.show["greeting"]).toBeFalsy();
  });
});
