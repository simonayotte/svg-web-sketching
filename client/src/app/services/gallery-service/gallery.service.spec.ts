import { TestBed } from '@angular/core/testing';

import { Color } from 'src/app/models/color';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawingHandler } from '../drawing-handler/drawing-handler.service';
import { GalleryService } from './gallery.service';

describe('GalleryService', () => {
  let service: GalleryService;
  let store: DrawStore;
  let drawingHandler: DrawingHandler;
  beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.get(GalleryService);
      store = TestBed.get(DrawStore);
      drawingHandler = TestBed.get(DrawingHandler);
      store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('convertHtmlToSvgElement() should take an array of html, convert them into an SVGGraphicsElement an push then in the svg array', () => {
    const svg1: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg2: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg3: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgHTML = [svg1.outerHTML, svg2.outerHTML, svg3.outerHTML];
    const svgs = [svg1, svg2, svg3];
    service.convertHtmlToSvgElement(svgHTML);
    expect(svgs).toEqual(service.state.svgState.svgs);
  });

  it('convertHtmlToSvgElement() should call #pushSvg of store', () => {
    spyOn(store, 'pushSvg');
    const svg1: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg2: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg3: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgHTML = [svg1.innerHTML, svg2.innerHTML, svg3.innerHTML];
    service.convertHtmlToSvgElement(svgHTML);
    expect(store.pushSvg).toHaveBeenCalled();
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

  it('#loadDrawing() should call #convertHtmlToSvgElement()', () => {
    spyOn(service, 'convertHtmlToSvgElement');
    const svg1: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg2: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg3: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgHTML = [svg1.innerHTML, svg2.innerHTML, svg3.innerHTML];
    const drawing: SavedDrawing = new SavedDrawing('testdrawing', [], 'url', svgHTML, 1, 1, [0, 0, 0, 0]);
    service.loadDrawing(drawing);
    expect(service.convertHtmlToSvgElement).toHaveBeenCalledWith(drawing.svgsHTML);
  });

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
