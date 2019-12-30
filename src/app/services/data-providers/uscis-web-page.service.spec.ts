import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UscisWebPageService } from './uscis-web-page.service';

describe('UscisWebPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UscisWebPageService]
    });
  });

  it('should be created', () => {
    const service: UscisWebPageService = TestBed.get(UscisWebPageService);
    expect(service).toBeTruthy();
  });

  it('should return a webpage when HTTP response is valid',
    inject(
      [HttpClientTestingModule, UscisWebPageService],
      (httpMock: HttpTestingController, uscisWebPageService: UscisWebPageService) => {
        
      }
    )
  );


});
