import { TestBed } from '@angular/core/testing';

import { UscisService } from './uscis.service';

describe('UscisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UscisService = TestBed.get(UscisService);
    expect(service).toBeTruthy();
  });
});
