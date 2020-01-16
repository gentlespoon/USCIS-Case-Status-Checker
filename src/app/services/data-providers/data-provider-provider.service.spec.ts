import { TestBed } from "@angular/core/testing";

import { DataProviderProviderService } from "./data-provider-provider.service";

describe("DataProviderProviderService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: DataProviderProviderService = TestBed.get(
      DataProviderProviderService
    );
    expect(service).toBeTruthy();
  });
});
