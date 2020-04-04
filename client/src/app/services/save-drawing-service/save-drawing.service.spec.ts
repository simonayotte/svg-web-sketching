import { TestBed } from '@angular/core/testing';

import { SaveDrawingService } from './save-drawing.service';

describe('SaveDrawingService', () => {
  let service: SaveDrawingService;
  beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.get(SaveDrawingService);
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setImgName(name) should set the #imgName to the given name', () => {
    service.setImgName('Image');
    expect(service.getImgName()).toBe('Image');
  });

  it('#setTags(tags) should set the #tags to the given name', () => {
    service.setTags(['Sea', 'Beach', 'Waves']);
    expect(service.getTags()).toEqual(['Sea', 'Beach', 'Waves']);
  });
});
