import { TestBed } from '@angular/core/testing';

import { SvgHandlerService } from './svg-handler.service';

describe('SvgHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SvgHandlerService = TestBed.get(SvgHandlerService);
    expect(service).toBeTruthy();
  });
});
