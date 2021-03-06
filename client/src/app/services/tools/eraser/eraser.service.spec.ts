import { TestBed } from '@angular/core/testing';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { EraserService } from './eraser.service';

/* tslint:disable:no-magic-numbers */
describe('EraserService', () => {
    let service: EraserService;
    let store: DrawStore;
    let rect: SVGGraphicsElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EraserService, DrawStore],
        });
        store = TestBed.get(DrawStore);
        service = TestBed.get(EraserService);

        const svg = service.renderer.createElement('svg', 'svg') as SVGSVGElement;
        store.setDrawSvg(svg);

        rect = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;

        service.renderer.setAttribute(rect, 'stroke-width', '5');
        service.renderer.setAttribute(rect, 'stroke', '#000000ff');

        spyOn(rect, 'getBoundingClientRect').and.returnValue(new DOMRect(200, 200, 100, 100));

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;

            // service.state.svgState.svgs = [rect];
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#touchedSvgIndex should be equal to -1', () => {
        expect(service.touchedSvgIndex).toEqual(-1);
    });

    it('#start() should call #deleteTouchedSvg()  ', () => {
        const spy = spyOn(service, 'deleteTouchedSvg');
        service.start();
        expect(spy).toHaveBeenCalled();
    });

    it('#continue() should call #deleteTouchedSvg()  ', () => {
        const spy = spyOn(service, 'deleteTouchedSvg');
        service.continue();
        expect(spy).toHaveBeenCalled();
    });

    it('#stop() should call store #deleteSvgs() if #deletedSvgs is not empty', () => {
        service.deletedSvgs = [rect];
        const spy = spyOn(store, 'deleteSvgs');
        service.stop();
        expect(spy).toHaveBeenCalled();
    });

    it('#stop() should not call store #deleteSvgs() if #deletedSvgs is empty', () => {
        service.deletedSvgs = [];
        const spy = spyOn(store, 'deleteSvgs');
        service.stop();
        expect(spy).not.toHaveBeenCalled();
    });

    it('#stop() should be called on mouse up', () => {
        service.start();
        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        const spy = spyOn(service, 'stopSignal');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        expect(spy).toHaveBeenCalled();
    });

    it('#stop() should not be called on mouse up before mouse down', () => {
        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        const spy = spyOn(service, 'stopSignal');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#move() should call #verifyMouseOver() if #touchedSvgIndex is equal to -1', () => {
        service.touchedSvgIndex = -1;
        const spy = spyOn(service, 'verifyMouseOver');
        service.move(100, 200);
        expect(spy).toHaveBeenCalled();
    });

    it('#verifyMouseOver() should return index of rectangle svg if eraser is touching it ', () => {
        expect(service.verifyMouseOver(250, 250, [rect])).toEqual(0);
    });

    it('#verifyMouseOver() should return -1 if eraser is not touching any svg', () => {
        expect(service.verifyMouseOver(100, 100, [rect])).toEqual(-1);
    });

    it('#verifyMouseOver() should call #setAttribute()  of stroke of svg with red color if eraser is touching it ', () => {
        const spy = spyOn(service.renderer, 'setAttribute');
        service.verifyMouseOver(250, 250, [rect]);
        expect(spy).toHaveBeenCalledWith(rect, 'stroke', '#c80000ff');
    });

    it('#verifyMouseOver() should return index of most recent svg if two svg are one over another', () => {
        expect(service.verifyMouseOver(250, 250, [rect, rect])).toEqual(1);
    });

    it('#deleteTouchedSvg() should call renderer #removeChild() and #setAttribute() if #touchedSvgIndex is bigger than -1', () => {
        service.touchedSvgIndex = 0;
        const spy1 = spyOn(service.renderer, 'removeChild');
        const spy2 = spyOn(service.renderer, 'setAttribute');
        service.deleteTouchedSvg();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('#deleteTouchedSvg() should not call renderer #removeChild() and #setAttribute() if #touchedSvgIndex is equal to -1', () => {
        service.touchedSvgIndex = -1;
        const spy1 = spyOn(service.renderer, 'removeChild');
        const spy2 = spyOn(service.renderer, 'setAttribute');

        service.deleteTouchedSvg();
        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    });

    it('#deleteTouchedSvg() should be called on mouse move after mouse down ', () => {
        service.start();

        const spy = spyOn(service, 'deleteTouchedSvg');

        const mouseMove: MouseEvent = new MouseEvent('mousemove');
        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).toHaveBeenCalled();
    });

    it('#deleteTouchedSvg() should not be called on mouse move before mouse down ', () => {
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        const spy = spyOn(service, 'deleteTouchedSvg');
        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#deleteTouchedSvg() should not be called on mouse move after mouse up ', () => {
        service.start();
        const spy = spyOn(service, 'deleteTouchedSvg');

        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 75,
            clientY: 400,
        });

        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#isEraseTouching() should return true if eraser is touching touching svg', () => {
        const domRect = new DOMRect(50, 50, 200, 200);

        expect(service.isEraseTouching(100, 100, domRect, 10)).toBeTruthy();
    });

    it('#isEraseTouching() should return false if eraser is not touching svg', () => {
        const domRect = new DOMRect(50, 50, 200, 200);

        expect(service.isEraseTouching(400, 400, domRect, 10)).toBeFalsy();
    });

    it('#isEraseTouching() should return false if eraser is not touching svg ', () => {
        const domRect = new DOMRect(50, 50, 10, 10);

        expect(service.isEraseTouching(10, 10, domRect, 10)).toBeFalsy();
    });
});
