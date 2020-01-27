import { TestBed } from '@angular/core/testing';

import { DrawStateService } from './draw-state.service';

describe('DrawStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawStateService = TestBed.get(DrawStateService);
    expect(service).toBeTruthy();
  });
});
