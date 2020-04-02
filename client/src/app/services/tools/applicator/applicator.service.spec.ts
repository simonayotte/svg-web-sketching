import { TestBed } from '@angular/core/testing';

import { ApplicatorService } from './applicator.service';

describe('ApplicatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicatorService = TestBed.get(ApplicatorService);
    expect(service).toBeTruthy();
  });
});
