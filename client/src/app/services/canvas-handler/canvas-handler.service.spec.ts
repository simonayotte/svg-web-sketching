import { TestBed } from '@angular/core/testing';

import { CanvasHandlerService } from './canvas-handler.service';

describe('CanvasHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasHandlerService = TestBed.get(CanvasHandlerService);
    expect(service).toBeTruthy();
  });
});
