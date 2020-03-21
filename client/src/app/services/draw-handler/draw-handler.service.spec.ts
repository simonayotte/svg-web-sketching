import { TestBed } from '@angular/core/testing';

import { DrawHandlerService } from './draw-handler.service';

describe('DrawHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawHandlerService = TestBed.get(DrawHandlerService);
    expect(service).toBeTruthy();
  });
});
