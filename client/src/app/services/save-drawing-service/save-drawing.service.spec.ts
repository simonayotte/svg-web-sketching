import { TestBed } from '@angular/core/testing';

import { SaveDrawingService } from './save-drawing.service';

describe('SaveDrawingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveDrawingService = TestBed.get(SaveDrawingService);
    expect(service).toBeTruthy();
  });
});
