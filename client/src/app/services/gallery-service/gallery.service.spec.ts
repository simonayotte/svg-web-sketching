import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Color } from 'src/app/models/color';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawingHandler } from '../drawing-handler/drawing-handler.service';
import { GalleryService } from './gallery.service';
import { ContinueDrawingService } from '../continue-drawing/continue-drawing.service';

describe('GalleryService', () => {
  let service: GalleryService;
  let store: DrawStore;
  let drawingHandler: DrawingHandler;
  let continueDrawingService: ContinueDrawingService;
  beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.get(GalleryService);
      store = TestBed.get(DrawStore);
      drawingHandler = TestBed.get(DrawingHandler);
      continueDrawingService = TestBed.get(ContinueDrawingService);
      store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#loadDrawing() should call #setDrawHeight() of the store', () => {
    spyOn(store, 'setDrawHeight');
    const drawing: SavedDrawing = new SavedDrawing('testdrawing', [], 'url', [], 1, 1, []);
    service.loadDrawing(drawing);
    expect(store.setDrawHeight).toHaveBeenCalledWith(drawing.height);
  });

  it('#loadDrawing() should call #setDrawWidth() of the store', () => {
    spyOn(store, 'setDrawWidth');
    const drawing: SavedDrawing = new SavedDrawing('testdrawing', [], 'url', [], 1, 1, []);
    service.loadDrawing(drawing);
    expect(store.setDrawWidth).toHaveBeenCalledWith(drawing.width);
  });

  it('#loadDrawing() should call #setCanvasColor() of the store', () => {
    spyOn(store, 'setCanvasColor');
    const drawing: SavedDrawing = new SavedDrawing('testdrawing', [], 'url', [], 1, 1, [0, 0, 0, 0]);
    const color: Color = new Color(drawing.RGBA[0], drawing.RGBA[1], drawing.RGBA[2], drawing.RGBA[3]);
    service.loadDrawing(drawing);
    expect(store.setCanvasColor).toHaveBeenCalledWith(color);
  });

  it('#loadDrawing() should call #setCanvasColor() of the store', () => {
    spyOn(store, 'setCanvasColor');
    const drawing: SavedDrawing = new SavedDrawing('testdrawing', [], 'url', [], 1, 1, [0, 0, 0, 0]);
    const color: Color = new Color(drawing.RGBA[0], drawing.RGBA[1], drawing.RGBA[2], drawing.RGBA[3]);
    service.loadDrawing(drawing);
    expect(store.setCanvasColor).toHaveBeenCalledWith(color);
  });

  it('#loadDrawing() should call #clearCanvas() drawingHandler', () => {
    spyOn(drawingHandler, 'clearCanvas');
    const drawing: SavedDrawing = new SavedDrawing('testdrawing', [], 'url', [], 1, 1, [0, 0, 0, 0]);
    service.loadDrawing(drawing);
    expect(drawingHandler.clearCanvas).toHaveBeenCalled();
  });

  it('#loadDrawing() should call #setIsContinueDrawing() of continueDrawingService', () => {
    spyOn(continueDrawingService, 'setIsContinueDrawing');
    const drawing: SavedDrawing = new SavedDrawing('testdrawing', [], 'url', [], 1, 1, [0, 0, 0, 0]);
    service.loadDrawing(drawing);
    expect(continueDrawingService.setIsContinueDrawing).toHaveBeenCalledWith(false);
  });

  it('#loadSavedDrawing() should call #setSvgArray() of the store', fakeAsync(() => {
    spyOn(store, 'setSvgArray');
    const drawing: SavedDrawing = new SavedDrawing('testdrawing', [], 'url', [], 1, 1, [0, 0, 0, 0]);
    service.loadDrawing(drawing);
    tick(0);
    expect(store.setSvgArray).toHaveBeenCalled();
  }));

  it('#filterDrawings(tags, drawings) should return all the drawings that contains at least one of the tags passed as a parameter', () => {
    const drawing1: SavedDrawing = new SavedDrawing('testdrawing', ['blue', 'sea', 'beach'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawing2: SavedDrawing = new SavedDrawing('testdrawing', ['green', 'forest'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawing3: SavedDrawing = new SavedDrawing('testdrawing', ['yellow', 'sand', 'beach'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawingArray: SavedDrawing[] = [drawing1, drawing2, drawing3];
    const tags = ['beach', 'forest'];
    const filteredDrawings: SavedDrawing[] = service.filterDrawings(tags, drawingArray);
    expect(filteredDrawings.includes(drawing1) && filteredDrawings.includes(drawing2) && filteredDrawings.includes(drawing3)).toBeTruthy();
  });

  it('#filterDrawings(tags, drawings) should return the drawing that contains the tag passed as a parameter', () => {
    const drawing1: SavedDrawing = new SavedDrawing('testdrawing', ['blue', 'sea', 'beach'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawing2: SavedDrawing = new SavedDrawing('testdrawing', ['green', 'forest'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawing3: SavedDrawing = new SavedDrawing('testdrawing', ['yellow', 'sand', 'beach'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawingArray: SavedDrawing[] = [drawing1, drawing2, drawing3];
    const tags = ['forest'];
    const filteredDrawings: SavedDrawing[] = service.filterDrawings(tags, drawingArray);
    expect(filteredDrawings.includes(drawing2)).toBeTruthy();
  });

  it('#filterDrawings(tags, drawings) should return the drawing that contains the tag passed as a parameter', () => {
    const drawing1: SavedDrawing = new SavedDrawing('testdrawing', ['blue', 'sea', 'beach'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawing2: SavedDrawing = new SavedDrawing('testdrawing', ['green', 'forest'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawing3: SavedDrawing = new SavedDrawing('testdrawing', ['yellow', 'sand', 'beach'], 'url', [], 1, 1, [0, 0, 0, 0]);
    const drawingArray: SavedDrawing[] = [drawing1, drawing2, drawing3];
    const tags = ['beach'];
    const filteredDrawings: SavedDrawing[] = service.filterDrawings(tags, drawingArray);
    expect(filteredDrawings.includes(drawing1) && filteredDrawings.includes(drawing3)).toBeTruthy();
  });

});
