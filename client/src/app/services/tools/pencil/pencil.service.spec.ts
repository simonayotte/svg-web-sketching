import { TestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
describe('PencilService', () => {
    let service: PencilService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PencilService, DrawStore],
        });
        let store: DrawStore = TestBed.get(DrawStore);

        store.setCanvasHTML(document.createElement('canvas'));

        store.stateObs.subscribe((value: DrawState) => {
            service = TestBed.get(PencilService);
            service.element = {
                ...service.element,
                primaryColor: '#0f0f33ff',
                secondaryColor: '#0000ff10',
                thickness: 20,
                startSelectX: 0,
                startSelectY: 0,
                endSelectX: 0,
                endSelectY: 0,
                path: [],
            };
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
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
});
