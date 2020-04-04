import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';

import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';

describe('RectangleService', () => {
    let service: RectangleService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RectangleService, DrawStore],
        });
        store = TestBed.get(DrawStore);
        service = TestBed.get(RectangleService);
        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));
        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start() should set #isDrawing to true ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });

        service.start(mouseDown);
        expect(service.isDrawing).toBeTruthy();
    });

    it('#draw() should call #drawSquare() if #isShift is true ', () => {
        service.svg = service.renderer.createElement('rect', 'svg');
        service.isShift = true;

        const spy = spyOn(service, 'drawSquare');
        const testValue1 = 50;
        const testValue2 = 100;
        const testValue3 = 200;
        const testValue4 = 300;
        service.draw(testValue1, testValue2, testValue3, testValue4);

        expect(spy).toHaveBeenCalled();
    });

    it('#draw() should call #drawRect() if #isShift is false ', () => {
        service.svg = service.renderer.createElement('rect', 'svg');
        const spy = spyOn(service, 'drawRect');
        const testValue1 = 50;
        const testValue2 = 100;
        const testValue3 = 200;
        const testValue4 = 300;
        service.draw(testValue1, testValue2, testValue3, testValue4);

        expect(spy).toHaveBeenCalled();
    });
    it('#draw() should be called on mouse move after mouse down ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 0,
            clientY: 0,
        });

        service.start(mouseDown);

        const spy = spyOn(service, 'draw');

        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).toHaveBeenCalled();
    });

    it('#draw() should not be called on mouse move before mouse down ', () => {
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        const spy = spyOn(service, 'draw');
        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#draw() should not be called on mouse move after mouse up ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
        });
        service.start(mouseDown);
        const spy = spyOn(service, 'draw');

        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 75,
            clientY: 400,
        });

        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#stop() should call store #pushSvg() if #isDrawing is true', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });

        service.start(mouseDown);
        const spy = spyOn(store, 'pushSvg');
        service.stop();
        expect(spy).toHaveBeenCalled();
    });

    it('#stop() should not call store #pushSvg() if #isDrawing is false', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });

        service.start(mouseDown);
        service.isDrawing = false;
        const spy = spyOn(store, 'pushSvg');
        service.stop();
        expect(spy).not.toHaveBeenCalled();
    });

    it('#stop() should set #isDrawing to false if #isDrawing is true', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });

        service.start(mouseDown);
        service.stop();
        expect(service.isDrawing).toBeFalsy();
    });
    it('#stop() should be called on mouse up', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
        });
        service.start(mouseDown);
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
});
