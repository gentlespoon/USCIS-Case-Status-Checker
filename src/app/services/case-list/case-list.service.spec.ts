import { TestBed } from '@angular/core/testing';

import { CaseListService } from './case-list.service';

describe('CaseListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaseListService = TestBed.get(CaseListService);
    expect(service).toBeTruthy();
  });
});
