import { TestBed } from '@angular/core/testing';

import { PolygonService } from './polygon.service';

import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Color } from 'src/app/models/color';

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
            service.element = {
                ...service.element,
                primaryColor: '#0f0f33ff',
                secondaryColor: '#0000ff10',
                thickness: 20,
                startSelectX: 0,
                startSelectY: 0,
                endSelectX: 0,
                endSelectY: 0,
                type: 'outline',
                size: 20,
                sides: 3,
            };
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start should call setup function', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
        });
        const spy = spyOn(service, 'setup');
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

    it('#setup should set canvas context stroke style correctly if polygonType is outline ', () => {
        let color = new Color(255, 10, 20, 255);
        service.element = { ...service.element, type: 'outline', secondaryColor: color.hex() };
        service.setup(service.element);
        expect(service.state.canvasState.ctx.strokeStyle).toContain(color.colorHex());
    });
    it('#setup should set canvas context stroke style and fill style correctly if polygonType is outlineFill', () => {
        let firstColor = new Color(255, 10, 20, 255);
        let secondColor = new Color(0, 70, 20, 255);
        service.element = { ...service.element, type: 'outlineFill', primaryColor: firstColor.hex(), secondaryColor: secondColor.hex() };
        service.setup(service.element);
        expect(service.state.canvasState.ctx.strokeStyle).toContain(secondColor.colorHex());
        expect(service.state.canvasState.ctx.fillStyle).toContain(firstColor.colorHex());
    });
    it('#setup should set canvas context fill style correctly if polygonType is fill ', () => {
        let color = new Color(255, 10, 20, 255);
        service.element = { ...service.element, type: 'fill', primaryColor: color.hex() };
        service.setup(service.element);
        expect(service.state.canvasState.ctx.fillStyle).toContain(color.colorHex());
    });

    it('#draw should be called on mouse move after mouse down ', () => {
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
        service.state.canvasState.canvas.dispatchEvent(mouseMove);
        expect(spy).toHaveBeenCalled();
    });

    it('#draw should not be called on mouse move before mouse down ', () => {
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        const spy = spyOn(service, 'draw');
        service.state.canvasState.canvas.dispatchEvent(mouseMove);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#draw should not be called on mouse move after mouse up ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
        });
        service.start(mouseDown);
        const spy = spyOn(service, 'draw');

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
