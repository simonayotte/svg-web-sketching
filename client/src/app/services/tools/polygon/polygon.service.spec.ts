import { TestBed } from '@angular/core/testing';

import { PolygonService } from './polygon.service';

import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Color } from 'src/app/models/color';
import { Coordinate } from 'src/app/models/coordinate';

describe('PolygonService', () => {
    let service: PolygonService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PolygonService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        service = TestBed.get(PolygonService);
        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
            service.state.colorState.firstColor = new Color(255, 0, 255, 255);
            service.state.colorState.secondColor = new Color(0, 0, 255, 255);
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

    it('#draw() should call #pointToString() ', () => {
        service.svg = service.renderer.createElement('polygon', 'svg');
        const spy = spyOn(service, 'pointsToString');
        service.draw(10, 20, 5, 60);
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

    it('#setColors() should call #setAttribute 2 times if #type is valid', () => {
        service.svg = service.renderer.createElement('polygon', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');

        service.setColors('outline');

        expect(spy).toHaveBeenCalledTimes(2);
    });
    it('#setColors() should call #setAttribute with fill as transparent and stroke as secondColor if polygonType is outline', () => {
        service.svg = service.renderer.createElement('polygon', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');

        service.setColors('outline');
        expect(spy).toHaveBeenCalledWith(service.svg, 'fill', 'transparent');
        expect(spy).toHaveBeenCalledWith(service.svg, 'stroke', '#0000ffff');
    });
    it('#setColors() should call #setAttribute with fill as firstColor and stroke as secondColor if polygonType is outlineFill', () => {
        service.svg = service.renderer.createElement('polygon', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');

        service.setColors('outlineFill');

        expect(spy).toHaveBeenCalledWith(service.svg, 'fill', '#ff00ffff');
        expect(spy).toHaveBeenCalledWith(service.svg, 'stroke', '#0000ffff');
    });
    it('#setColors() should call #setAttribute with fill as firstColor and stroke as transparent if polygonType is fill', () => {
        service.svg = service.renderer.createElement('polygon', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');

        service.setColors('fill');
        expect(spy).toHaveBeenCalledWith(service.svg, 'fill', '#ff00ffff');
        expect(spy).toHaveBeenCalledWith(service.svg, 'stroke', 'transparent');
    });

    it('#pointsToString() should return correct string if #points parameter length > 0', () => {
        let value = service.pointsToString([new Coordinate(10, 50), new Coordinate(13, 8), new Coordinate(60, 97)]);
        expect(value).toEqual('10,50 13,8 60,97');
    });

    it('#pointsToString() should return empty string if #points parameter length = 0', () => {
        let value = service.pointsToString([]);
        expect(value).toEqual('');
    });
});
