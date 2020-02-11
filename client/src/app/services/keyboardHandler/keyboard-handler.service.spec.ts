import { TestBed } from '@angular/core/testing';

import { KeyboardHandlerService } from './keyboard-handler.service';

describe('KeyboardHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeyboardHandlerService = TestBed.get(KeyboardHandlerService);
    expect(service).toBeTruthy();
  });
});
