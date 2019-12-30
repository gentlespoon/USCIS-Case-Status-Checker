import { TestBed } from '@angular/core/testing';

import { DataCacheService } from './data-cache.service';

describe('DataCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataCacheService = TestBed.get(DataCacheService);
    expect(service).toBeTruthy();
  });
});
