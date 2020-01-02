import { TestBed } from "@angular/core/testing";

import { ViewControllerService } from "./view-controller.service";

describe("ViewControllerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ViewControllerService = TestBed.get(ViewControllerService);
    expect(service).toBeTruthy();
  });
});
