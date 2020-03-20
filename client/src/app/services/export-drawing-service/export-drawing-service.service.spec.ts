import { TestBed } from '@angular/core/testing';
import { ExportDrawingService } from './export-drawing.service';


describe('ExportDrawingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportDrawingService = TestBed.get(ExportDrawingService);
    expect(service).toBeTruthy();
  });
});
