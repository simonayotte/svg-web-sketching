import { TestBed } from '@angular/core/testing';
import { FileTypes } from 'src/app/models/enums';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawingHandler } from './drawing-handler.service';

// tslint:disable:no-magic-numbers
// tslint:disable:max-line-length
// tslint:disable:max-file-line-count

describe('DrawingHandler', () => {
  let service: DrawingHandler;
  let store: DrawStore;
  beforeEach(() => {
             TestBed.configureTestingModule({});
             service = TestBed.get(DrawingHandler);
             store = TestBed.get(DrawStore);
             store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
            });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setDataURL(dataURL) should set the #dataURL to the given name', () => {
    service.setDataURL('imageURL');
    expect(service.getDataURL()).toBe('imageURL');
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to the canvas width if the canvas width is smaller than 300 px', () => {
    store.setDrawWidth(150);
    service.setPreviewImgWidth();
    expect(service.getPreviewWidth()).toBe(150);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to the canvas height if the canvas height is smaller than 300 px', () => {
    store.setDrawHeight(200);
    service.setPreviewImgHeight();
    expect(service.getPreviewHeight()).toBe(200);
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to 300px if the canvas width is larger than the canvas height and larger than 300px', () => {
    store.setDrawHeight(500);
    store.setDrawWidth(1000);
    service.setPreviewImgWidth();
    expect(service.getPreviewWidth()).toBe(300);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to 300px if the canvas height is larger than the canvas width and larger than 300px', () => {
    store.setDrawHeight(1000);
    store.setDrawWidth(500);
    service.setPreviewImgHeight();
    expect(service.getPreviewHeight()).toBe(300);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to 150px if the canvas height is half the size of the canvas width and larger than 300px', () => {
    store.setDrawHeight(400);
    store.setDrawWidth(800);
    service.setPreviewImgHeight();
    expect(service.getPreviewHeight()).toBe(150);
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to 150px if the canvas height is half the size of the canvas width and larger than 300px', () => {
    store.setDrawHeight(800);
    store.setDrawWidth(400);
    service.setPreviewImgWidth();
    expect(service.getPreviewWidth()).toBe(150);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to 150px if the canvas height is half the size of the canvas width and larger than 300px', () => {
    store.setDrawHeight(350);
    store.setDrawWidth(700);
    service.setPreviewImgHeight();
    expect(service.getPreviewHeight()).toBe(150);
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to 150px if the canvas height is half the size of the canvas width and larger than 300px', () => {
    store.setDrawHeight(650);
    store.setDrawWidth(325);
    service.setPreviewImgWidth();
    expect(service.getPreviewWidth()).toBe(150);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to 100px if the canvas height is a third of the size of the canvas width and larger than 300px', () => {
    store.setDrawHeight(310);
    store.setDrawWidth(930);
    service.setPreviewImgHeight();
    expect(service.getPreviewHeight()).toBe(100);
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to 100px if the canvas width is a third of the size of the canvas height and larger than 300px', () => {
    store.setDrawHeight(915);
    store.setDrawWidth(305);
    service.setPreviewImgWidth();
    expect(service.getPreviewWidth()).toBe(100);
  });

  it('#prepareDrawingExportation(png) should set #dataURL to be equal to a png data url', async () => {
    await service.prepareDrawingExportation(FileTypes.Png);
    expect(service.getDataURL().includes(FileTypes.Png)).toBeTruthy();
  });

  it('#prepareDrawingExportation(jpeg) should set #dataURL to be equal to a jpeg data url', async () => {
    await service.prepareDrawingExportation(FileTypes.Jpeg);
    expect(service.getDataURL().includes(FileTypes.Jpeg)).toBeTruthy();
  });

  it('#prepareDrawingExportation(svg+xml) should set #dataURL to be equal to a svg+xml data url', async () => {
    await service.prepareDrawingExportation(FileTypes.Svg);
    expect(service.getDataURL().includes(FileTypes.Svg)).toBeTruthy();
  });

  it('#prepareDrawingExportation(png) should call #setDataURL() ', async () => {
    spyOn(service, 'setDataURL');
    await service.prepareDrawingExportation(FileTypes.Png);
    expect(service.setDataURL).toHaveBeenCalled();
  });

  it('#prepareDrawingExportation(svg+xml) should call #setDataURL()', async () => {
    spyOn(service, 'setDataURL');
    await service.prepareDrawingExportation(FileTypes.Svg);
    expect(service.setDataURL).toHaveBeenCalled();
  });

  it('#prepareDrawingExportation() should call #setSvgFilter() of the store if a filter is passed as an argument', async () => {
    spyOn(store, 'setSVGFilter');
    await service.prepareDrawingExportation(FileTypes.Png, '1');
    expect(store.setSVGFilter).toHaveBeenCalledWith('1');
  });

  it('convertHtmlToSvgElement() should take an array of html, convert them into an SVGGraphicsElement an push then in the svg array', () => {
    const svg1: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg2: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svg3: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgHTML = [svg1.outerHTML, svg2.outerHTML, svg3.outerHTML];
    const svgs = [svg1, svg2, svg3];
    const svgArray: SVGGraphicsElement[] =  service.convertHtmlToSvgElement(svgHTML);
    expect(svgs).toEqual(svgArray);
  });

  it('#clearCanvas should call #empySvg() of the store', () => {
    spyOn(store, 'emptySvg');
    service.clearCanvas();
    expect(store.emptySvg).toHaveBeenCalled();
  });

  it('#clearCanvas should call #resetUndoRedo() of the store', () => {
    spyOn(store, 'resetUndoRedo');
    service.clearCanvas();
    expect(store.resetUndoRedo).toHaveBeenCalled();
  });

  it('#clearCanvas should empty the svg array', () => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    store.pushSvg(rect);
    service.clearCanvas();
    expect(service.state.svgState.svgs).toEqual([]);
  });

  it('#clearCanvas should empty redo array', () => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    store.pushSvg(rect);
    service.clearCanvas();
    expect(service.state.undoRedoState.redoState).toEqual([]);
  });

  it('#clearCanvas should empty undo array', () => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    store.pushSvg(rect);
    service.clearCanvas();
    expect(service.state.undoRedoState.undoState).toEqual([]);
  });

});
