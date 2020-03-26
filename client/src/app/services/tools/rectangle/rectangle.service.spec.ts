import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';

import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Color } from 'src/app/models/color';

describe('RectangleService', () => {
    let service: RectangleService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RectangleService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));

        store.stateObs.subscribe((value: DrawState) => {
            service = TestBed.get(RectangleService);

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

    it('#draw() should call #setRectangleDisplay(), #adjustStartPosition(), #drawRect() ', () => {
        service.svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const spy1 = spyOn(service, 'setRectangleDisplay');
        const spy2 = spyOn(service, 'adjustStartPosition');
        const spy3 = spyOn(service, 'drawRect');
        const spy4 = spyOn(service, 'adjustWidthAndHeight');
        service.draw(10, 20);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
        expect(spy4).toHaveBeenCalled();
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

    it('#setRectangleDisplay() should call #setAttribute 2 times if #type is valid', () => {
        service.svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        const spy = spyOn(service.svg, 'setAttribute');

        service.setRectangleDisplay('fill');

        expect(spy).toHaveBeenCalledTimes(2);
    });
    it('#setRectangleDisplay() should call #setAttribute with fill as none and stroke as secondColor if rectangleType is outline', () => {
        service.svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        const spy = spyOn(service.svg, 'setAttribute');

        service.setRectangleDisplay('outline');
        expect(spy).toHaveBeenCalledWith('fill', 'none');
        expect(spy).toHaveBeenCalledWith('stroke', '#0000ffff');
    });
    it('#setRectangleDisplay() should call #setAttribute with fill as firstColor and stroke as secondColor if rectangleType is outlineFill', () => {
        service.svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        const spy = spyOn(service.svg, 'setAttribute');

        service.setRectangleDisplay('outlineFill');

        expect(spy).toHaveBeenCalledWith('fill', '#ff00ffff');
        expect(spy).toHaveBeenCalledWith('stroke', '#0000ffff');
    });
    it('#setRectangleDisplay() should call #setAttribute with fill as firstColor and stroke as none if rectangleType is fill', () => {
        service.svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        const spy = spyOn(service.svg, 'setAttribute');

        service.setRectangleDisplay('fill');
        expect(spy).toHaveBeenCalledWith('fill', '#ff00ffff');
        expect(spy).toHaveBeenCalledWith('stroke', 'none');
    });
});
