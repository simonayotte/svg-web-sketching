import { TestBed } from '@angular/core/testing';
import { ExportDrawingService } from './export-drawing.service';

describe('ExportDrawingServiceService', () => {
  let service: ExportDrawingService;
  beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.get(ExportDrawingService);
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setExportName(name) should set the #imgName to the given name', () => {
    service.setExportName('Image');
    expect(service.getExportName()).toBe('Image');
  });

  it('#setType(tags) should set the #tags to the given name', () => {
    service.setType('png');
    expect(service.getType()).toEqual('png');
  });
});
