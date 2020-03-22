import { TestBed } from '@angular/core/testing';

import { FileHandler } from './file-handler.service';

describe('FileHandler', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileHandler = TestBed.get(FileHandler);
    expect(service).toBeTruthy();
  });
});
