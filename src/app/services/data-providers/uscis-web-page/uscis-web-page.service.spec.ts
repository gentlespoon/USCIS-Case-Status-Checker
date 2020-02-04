import { TestBed, inject } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { UscisWebPageService } from "./uscis-web-page.service";

describe("UscisWebPageService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UscisWebPageService]
    });
  });

  it("should be created", () => {
    const service: UscisWebPageService = TestBed.get(UscisWebPageService);
    expect(service).toBeTruthy();
  });

  fit("should extract error message", () => {
    const service: UscisWebPageService = TestBed.get(UscisWebPageService);
    var result = service.analyzeResult(
      `asdf<div id="formErrorMessages">abcd<\/div>asdf`
    );
    console.log(result);
    expect(result).toBeTruthy();
  });
});
