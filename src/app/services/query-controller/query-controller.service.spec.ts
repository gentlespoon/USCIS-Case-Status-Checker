import { TestBed } from '@angular/core/testing';

import { QueryControllerService } from './query-controller.service';

describe('QueryControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryControllerService = TestBed.get(QueryControllerService);
    expect(service).toBeTruthy();
  });
});
