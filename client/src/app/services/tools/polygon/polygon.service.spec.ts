import { TestBed } from '@angular/core/testing';

import { PolygonService } from './polygon.service';

import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';

describe('PolygonService', () => {
    let service: PolygonService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PolygonService, DrawStore],
        });
        let store: DrawStore = TestBed.get(DrawStore);

        store.setCanvasHTML(document.createElement('canvas'));

        store.stateObs.subscribe((value: DrawState) => {
            service = TestBed.get(PolygonService);
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
    it('#start should get image data of canvas ', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
        });
        service.start(event);
        expect(service.canvasImage).not.toBeNull();
    });

    it('#prepare should set canvas context stroke style correctly if polygonType is outline ', () => {
        service.state.polygonType = 'outline';
        service.prepare();
        expect(service.state.canvasState.ctx.strokeStyle).toContain(service.state.colorState.secondColor.colorHex());
    });
    it('#prepare should set canvas context stroke style and fill style correctly if polygonType is outlineFill', () => {
        service.state.polygonType = 'outlineFill';
        service.prepare();
        expect(service.state.canvasState.ctx.strokeStyle).toContain(service.state.colorState.secondColor.colorHex());
        expect(service.state.canvasState.ctx.fillStyle).toContain(service.state.colorState.firstColor.colorHex());
    });
    it('#prepare should set canvas context fill style correctly if polygonType is fill ', () => {
        service.state.polygonType = 'fill';
        service.prepare();
        expect(service.state.canvasState.ctx.fillStyle).toContain(service.state.colorState.firstColor.colorHex());
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

    it('#stop should not be called on mouse up before mouse down', () => {
        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        const spy = spyOn(service, 'stopSignal');
        service.state.canvasState.canvas.dispatchEvent(mouseUp);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#addColors should call canvas context stroke only if polygonType is outline', () => {
        const strokeSpy = spyOn(service.state.canvasState.ctx, 'stroke');
        const fillSpy = spyOn(service.state.canvasState.ctx, 'fill');

        service.addColors('outline');
        expect(strokeSpy).toHaveBeenCalled();
        expect(fillSpy).not.toHaveBeenCalled();
    });
    it('#addColors should call canvas context stroke and fill if polygonType is outlineFill', () => {
        const strokeSpy = spyOn(service.state.canvasState.ctx, 'stroke');
        const fillSpy = spyOn(service.state.canvasState.ctx, 'fill');

        service.addColors('outlineFill');
        expect(strokeSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });
    it('#addColors should call canvas context fill only if polygonType is fill', () => {
        const strokeSpy = spyOn(service.state.canvasState.ctx, 'stroke');
        const fillSpy = spyOn(service.state.canvasState.ctx, 'fill');

        service.addColors('fill');
        expect(strokeSpy).not.toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });
});
