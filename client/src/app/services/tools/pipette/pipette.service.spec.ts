import { TestBed } from '@angular/core/testing';

import { PipetteService } from './pipette.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Color } from 'src/app/models/color';

describe('PipetteService', () => {
    let service: PipetteService;
    let store: DrawStore;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PipetteService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        store.setCanvasHTML(document.createElement('canvas'));

        store.stateObs.subscribe((value: DrawState) => {
            service = TestBed.get(PipetteService);
            service.state = value;
        });
    });

    it('should be created', () => {
        const service: PipetteService = TestBed.get(PipetteService);
        expect(service).toBeTruthy();
    });

    it('#start should call getCanvasWithBackground', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
            button: 0,
        });

        const spy = spyOn(service, 'getCanvasWithBackground');
        service.start(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#start should call setFirstColor store function if left click', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
            button: 0,
        });

        const spy = spyOn(store, 'setFirstColor');
        service.start(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#start should call setSecondColor store function if left click', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 300,
            clientY: 400,
            button: 2,
        });
        const spy = spyOn(store, 'setSecondColor');
        service.start(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#getCanvasWithBackground should return canvas context with changed background color', () => {
        let ctx = service.getCanvasWithBackground(service.state.canvasState.canvas, '#ff00ffff');

        //pick random pixel in canvas context with background color
        const data: Uint8ClampedArray = ctx.getImageData(200, 100, 1, 1).data;
        const color = new Color(data[0], data[1], data[2], data[3]);

        expect(color.hex()).toEqual('#ff00ffff');
    });

    it('#getCanvasWithBackground should return canvas context with original canvas content', () => {
        //Draw content in original canvas
        service.state.canvasState.ctx.fillStyle = '#012345ff';
        service.state.canvasState.ctx.fillRect(0, 0, service.state.canvasState.width, service.state.canvasState.height);
        let ctx = service.getCanvasWithBackground(service.state.canvasState.canvas, '#ff00ffff');

        //pick random pixel in canvas context with background color
        const data: Uint8ClampedArray = ctx.getImageData(200, 100, 1, 1).data;
        const color = new Color(data[0], data[1], data[2], data[3]);

        expect(color.hex()).toEqual('#012345ff');
    });
});
