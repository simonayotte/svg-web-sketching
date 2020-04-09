import { TestBed } from '@angular/core/testing';

import { MovementService } from './movement.service';

import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';
import { SelectionButtons } from 'src/app/models/enums';

describe('MovementService', () => {
    let service: MovementService;
    let store: DrawStore;
    let rect: SVGGraphicsElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MovementService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        service = TestBed.get(MovementService);

        const svg = service.renderer.createElement('svg', 'svg') as SVGSVGElement;
        store.setDrawSvg(svg);

        rect = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;

        service.renderer.setAttribute(rect, 'stroke-width', '5');
        service.renderer.setAttribute(rect, 'stroke', '#000000ff');
        service.renderer.setAttribute(rect, 'transform', 'translate(125,150)');
        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });
    it('should be created', () => {
        const service: MovementService = TestBed.get(MovementService);
        expect(service).toBeTruthy();
    });

    it('#start() should set selectionBox #isMoving to true', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });

        service.start(mouseDown);
        expect(service.state.selectionBox.isMoving).toBeTruthy();
    });

    it('#continue() should call #moveSvgs', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
        });
        const spy = spyOn(service, 'moveSvgs');
        service.continue(mouseDown);
        expect(spy).toHaveBeenCalled();
    });

    it('#moveSvgs() should call renderer #setAttribute with old translation and current move', () => {
        let dX = 75;
        let dY = 50;
        service.state.selectionBox.svgs = [rect];
        const spy = spyOn(service.renderer, 'setAttribute');
        service.moveSvgs(dX, dY);
        expect(spy).toHaveBeenCalledWith(rect, 'transform', 'translate(200,200)');
    });

    it('#handleKeyDown() should call renderer #moveSvgs with correct params if ArrowLeft pressed ', () => {
        const spy = spyOn(service, 'moveSvgs');
        service.handleKeyDown(SelectionButtons.ArrowLeft);
        expect(spy).toHaveBeenCalledWith(-3, 0);
    });

    it('#handleKeyDown() should call renderer #moveSvgs with correct params if ArrowRight pressed ', () => {
        const spy = spyOn(service, 'moveSvgs');
        service.handleKeyDown(SelectionButtons.ArrowRight);
        expect(spy).toHaveBeenCalledWith(3, 0);
    });
    it('#handleKeyDown() should call renderer #moveSvgs with correct params if ArrowDown pressed ', () => {
        const spy = spyOn(service, 'moveSvgs');
        service.handleKeyDown(SelectionButtons.ArrowDown);
        expect(spy).toHaveBeenCalledWith(0, 3);
    });
    it('#handleKeyDown() should call renderer #moveSvgs with correct params if ArrowUp pressed ', () => {
        const spy = spyOn(service, 'moveSvgs');
        service.handleKeyDown(SelectionButtons.ArrowUp);
        expect(spy).toHaveBeenCalledWith(0, -3);
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
