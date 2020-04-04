import { TestBed } from '@angular/core/testing';

import { LineService } from './line.service';

import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';

describe('LineService', () => {
    let service: LineService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LineService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        service = TestBed.get(LineService);
        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start() should set create the svg element', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });

        service.start(mouseDown);
        expect(service.svg).toBeTruthy();
    });

    it('#previewLine() should be called on mouse move after mouse down ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 0,
            clientY: 0,
        });

        service.start(mouseDown);

        const spy = spyOn(service, 'previewLine');

        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).toHaveBeenCalled();
    });

    it('#previewLine() should not be called on mouse move before mouse down ', () => {
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        const spy = spyOn(service, 'previewLine');
        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#previewLine() should be called on mouse move after mouse up ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
        });
        service.start(mouseDown);
        const spy = spyOn(service, 'previewLine');

        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 75,
            clientY: 400,
        });

        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        expect(spy).toHaveBeenCalled();
    });

    it('#stop() should call store #pushSvg() if svg exists', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });

        service.start(mouseDown);
        const spy = spyOn(store, 'pushSvg');
        service.stop();
        expect(spy).toHaveBeenCalled();
    });

    it('#stop() should not call store #pushSvg() when not drawing', () => {
        const spy = spyOn(store, 'pushSvg');
        service.stop();
        expect(spy).not.toHaveBeenCalled();
    });

    it('#stop() should not be called on mouse up before mouse down', () => {
        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        const spy = spyOn(service, 'stopSignal');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        expect(spy).not.toHaveBeenCalled();
    });
});
