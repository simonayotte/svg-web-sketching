import { TestBed } from '@angular/core/testing';

import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { PipetteService } from './pipette.service';

describe('PipetteService', () => {
    let service: PipetteService;
    let store: DrawStore;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PipetteService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        service = TestBed.get(PipetteService);

        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });

    it('should be created', () => {
        const service: PipetteService = TestBed.get(PipetteService);
        expect(service).toBeTruthy();
    });

    it('#start() should call #createCanvasWithSvgs()', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
            button: 0,
        });

        const spy = spyOn(service, 'createCanvasWithSvgs');
        service.start(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#start() should call #drawSvgInCanvas()', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
            button: 0,
        });

        const spy = spyOn(service, 'drawSvgInCanvas');
        service.start(event);
        expect(spy).toHaveBeenCalled();
    });

    it('#createCanvasWithSvgs() should return canvas context with correct height and width', () => {
        const ctx = service.createCanvasWithSvgs(500, 500);
        expect(ctx).toBeTruthy();
        expect(ctx.canvas.width).toEqual(500);
        expect(ctx.canvas.height).toEqual(500);
    });

    it('#setColor() should call #setFirstColor() store function if left click', () => {
        service.ctx = service.renderer.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

        const spy = spyOn(store, 'setFirstColor');
        service.setColor(service.ctx, 100, 100, 0);
        expect(spy).toHaveBeenCalled();
    });

    it('#setColor() should call #setSecondColor() store function if right click', () => {
        service.ctx = service.renderer.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;

        const spy = spyOn(store, 'setSecondColor');
        service.setColor(service.ctx, 100, 100, 2);
        expect(spy).toHaveBeenCalled();
    });
});
