import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ContinueDrawingService } from './continue-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { MatDialogModule } from '@angular/material';
import { Color } from 'src/app/models/color';
import { DrawingHandler } from '../drawing-handler/drawing-handler.service';

describe('ContinueDrawingService', () => {

  let service: ContinueDrawingService;
  let store: DrawStore;
  let drawingHandler: DrawingHandler
  let drawingJSONString:string | null;
  let drawingJSON:any
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [DrawStore, DrawingHandler],
        imports: [MatDialogModule],
    });
    drawingJSONString = localStorage.getItem('Drawing');
    if(drawingJSONString){
        drawingJSON = JSON.parse(drawingJSONString);
    }
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    service = TestBed.get(ContinueDrawingService);
    drawingHandler = TestBed.get(DrawingHandler);
  });
  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setIsContinueDrawing() should set the value of #isContinueDrawing', () => {
    service.setIsContinueDrawing(true);
    expect(service.getIsContinueDrawing()).toEqual(true);
  });

  it('#loadSavedDrawing() should call #setDrawWidth() of the store', () => {
    spyOn(store, 'setDrawWidth');
    service.loadSavedDrawing();
    expect(store.setDrawWidth).toHaveBeenCalledWith(drawingJSON.width)
  });

  it('#loadSavedDrawing() should call #setDrawHeight() of the store', () => {
    spyOn(store, 'setDrawHeight');
    service.loadSavedDrawing();
    expect(store.setDrawHeight).toHaveBeenCalledWith(drawingJSON.height)
  });

  it('#loadSavedDrawing() should call #setCanvasColor() of the store', () => {
    spyOn(store, 'setCanvasColor');
    let canvasColor = new Color(drawingJSON.canvasColor[0],drawingJSON.canvasColor[1],drawingJSON.canvasColor[2],drawingJSON.canvasColor[3])
    service.loadSavedDrawing();
    expect(store.setCanvasColor).toHaveBeenCalledWith(canvasColor);
  });

  it('#loadSavedDrawing() should call #clearCanvas() of drawingHandler', () => {
    spyOn(drawingHandler, 'clearCanvas');
    service.loadSavedDrawing();
    expect(drawingHandler.clearCanvas).toHaveBeenCalled();
  });

  it('#loadSavedDrawing() should call #convertHtmlToSvgElement() of drawingHandler', () => {
    spyOn(drawingHandler, 'convertHtmlToSvgElement');
    service.loadSavedDrawing();
    expect(drawingHandler.convertHtmlToSvgElement).toHaveBeenCalledWith(drawingJSON.svgsHTML);
  });

  it('#loadSavedDrawing() should call #setSvgArray() of the store', fakeAsync(() => {
    spyOn(store, 'setSvgArray');
    let svgArray: SVGGraphicsElement[] = drawingHandler.convertHtmlToSvgElement(drawingJSON.svgsHTML);
    service.loadSavedDrawing();
    tick(0);
    expect(store.setSvgArray).toHaveBeenCalledWith(svgArray);
  }));
});
