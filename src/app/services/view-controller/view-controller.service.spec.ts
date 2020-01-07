import { TestBed } from "@angular/core/testing";

import { ViewControllerService } from "./view-controller.service";

describe("ViewControllerService", () => {
  var service: ViewControllerService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(ViewControllerService);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return correct hasPopup", () => {
    expect(service.hasPopup).toBeFalsy();
    service.show["userAgreement"] = true;
    expect(service.hasPopup).toBeTruthy();
    service.show["userAgreement"] = false;
    expect(service.hasPopup).toBeFalsy();
  });
});
