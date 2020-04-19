import { TestBed } from '@angular/core/testing';

import { Color } from 'src/app/models/color';
import { BucketService } from './bucket.service';

import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';
/* tslint:disable:no-magic-numbers */
describe('BucketService', () => {
    let service: BucketService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BucketService, DrawStore],
        });
        store = TestBed.get(DrawStore);
        service = TestBed.get(BucketService);
        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));
        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start() should call #createHTMLCanvas() and #fillCanvas()', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });
        const spy = spyOn(service, 'createHTMLCanvas');
        const spy1 = spyOn(service, 'fillCanvas');
        service.start(mouseDown);
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
    });

    it('#stop() should call pushSvg when isFilling is true', () => {

        service.createPath();
        service.isFilling = true;
        const spy = spyOn(store, 'pushSvg');
        service.stop();
        expect(spy).toHaveBeenCalled();
      });

    it('#colorArea() should call #fillEntireSVG() when the tolerance is 100', () => {
        service.state.tolerance = 100;
        const spy = spyOn(service, 'fillEntireSVG');
        service.colorArea(0, 0, 1, 1);
        expect(spy).toHaveBeenCalled();
      });

    it('#createHTMLCanvas() should create and return the canvas element', () => {
        const ctx = service.createHTMLCanvas(500, 500);
        expect(ctx).toBeTruthy();
        expect(ctx.canvas.width).toEqual(500);
        expect(ctx.canvas.height).toEqual(500);
      });

    it('#fillCanvas() should call #colorArea() after loading the SVGs as canvas', () => {
        // TODO
      });

    it('#getPixelColor() should return the color of a pixel at given position', () => {
        const ctx = service.createHTMLCanvas(5, 5);
        const imageData = ctx.getImageData(0, 0, 4, 4);
        expect(service.getPixelColor(0, 0, imageData).rgbHex).toEqual('000000');
      });

    it('#checkColor() should check if the given color is within tolerance', () => {
        const blue = new Color(0, 0, 255, 0);
        const testTrueColor = new Color(0, 0, 250, 0);
        const testFalseColor = new Color(0, 40, 0, 0);

        expect(service.checkColor(blue, testTrueColor, 10)).toBeTruthy();
        expect(service.checkColor(blue, testFalseColor, 10)).toBeFalsy();
      });

    it('#fillEntireSVG() should create a rectangle element the size of drawSVG', () => {
        service.fillEntireSVG();
        expect(service.svg.getAttribute('width')).toEqual(service.state.svgState.width.toString());
        expect(service.svg.getAttribute('height')).toEqual(service.state.svgState.height.toString());
      });

    it('#createPath() should create a path element', () => {
        service.createPath();
        expect(service.svg.tagName).toEqual('path');
      });

    it('#pointsToString() should return a string defining the corresponding SVG element', () => {
      const testPoints = new Uint8Array(2 * 1);
      testPoints[0] = 1;
      testPoints[1] = 1;
      expect(service.pointsToString(testPoints, 2, 1)).toEqual('M 0 0L 2 0');
      });

    it('#nextPixel() should check if the next pixel is connected', () => {
        const testPoints = new Uint8Array(2 * 1);
        testPoints[0] = 1;
        expect(service.nextPixel(testPoints, 0, 0, 2)).toEqual(0);
        testPoints[1] = 1;
        expect(service.nextPixel(testPoints, 0, 0, 2)).toEqual(1);
      });
});
