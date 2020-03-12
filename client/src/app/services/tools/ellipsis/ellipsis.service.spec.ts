import { TestBed } from '@angular/core/testing';

import { EllipsisService } from './ellipsis.service';

describe('EllipsisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EllipsisService = TestBed.get(EllipsisService);
    expect(service).toBeTruthy();
  });
});
