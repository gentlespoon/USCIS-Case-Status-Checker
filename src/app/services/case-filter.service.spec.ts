import { TestBed } from '@angular/core/testing';

import { CaseFilterService } from './case-filter.service';

describe('CaseFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaseFilterService = TestBed.get(CaseFilterService);
    expect(service).toBeTruthy();
  });
});
