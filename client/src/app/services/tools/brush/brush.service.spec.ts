import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
fdescribe('BrushService', () => {
    let service: BrushService;
    //let state: DrawState;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BrushService, DrawStore],
        });
        let store: DrawStore = TestBed.get(DrawStore);

        store.setCanvasHTML(document.createElement('canvas'));

        store.stateObs.subscribe((value: DrawState) => {
            service = TestBed.get(BrushService);
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start should call prepare function', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
        });
        const spy = spyOn(service, 'prepare');
        service.start(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#start should set lastX and lastY with the last position of the mouse', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
        });
        service.start(event);
        expect(service.lastX).toEqual(300);
        expect(service.lastY).toEqual(400);
    });

    it('#prepare should call #prepareTexture if texture is different from normal', () => {
        const spy = spyOn(service, 'prepareTexture');
        service.state.brushTexture = 'wave';
        service.prepare();
        expect(spy).toHaveBeenCalled();
    });

    it('#prepare should set correctly canvas context settings', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
        });
        service.start(event);
        expect(service.lastX).toEqual(300);
        expect(service.lastY).toEqual(400);
    });

    it('#continue should be called on mouse move after mouse down ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 0,
            clientY: 0,
        });

        service.start(mouseDown);

        const spy = spyOn(service, 'continueSignal');

        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        service.state.canvasState.canvas.dispatchEvent(mouseMove);
        expect(spy).toHaveBeenCalled();
    });

    it('#continue should not be called on mouse move before mouse down ', () => {
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        const spy = spyOn(service, 'continueSignal');
        service.state.canvasState.canvas.dispatchEvent(mouseMove);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#continue should not be called on mouse move after mouse up ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
        });
        service.start(mouseDown);
        const spy = spyOn(service, 'continueSignal');

        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        service.state.canvasState.canvas.dispatchEvent(mouseUp);
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 75,
            clientY: 400,
        });

        service.state.canvasState.canvas.dispatchEvent(mouseMove);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#stop should be called on mouse up', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
        });
        service.start(mouseDown);
        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        const spy = spyOn(service, 'stopSignal');
        service.state.canvasState.canvas.dispatchEvent(mouseUp);
        expect(spy).toHaveBeenCalled();
    });

    it('#stopDraw() should not be called on mouse up before mouse down', () => {
        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        const spy = spyOn(service, 'stopSignal');
        service.state.canvasState.canvas.dispatchEvent(mouseUp);
        expect(spy).not.toHaveBeenCalled();
    });
});
