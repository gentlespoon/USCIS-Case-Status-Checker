import { TestBed } from '@angular/core/testing';

import { GsapiService } from './gsapi.service';

describe('GsapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GsapiService = TestBed.get(GsapiService);
    expect(service).toBeTruthy();
  });
});
