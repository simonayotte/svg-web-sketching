import { TestBed } from '@angular/core/testing';

import { ContinueDrawingService } from './continue-drawing.service';

describe('ContinueDrawingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContinueDrawingService = TestBed.get(ContinueDrawingService);
    expect(service).toBeTruthy();
  });
});
