import { TestBed } from '@angular/core/testing';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';
import { RectangleService } from '../rectangle/rectangle.service';
import { SelectionService } from './selection.service';
import { SelectionButtons } from 'src/app/models/enums';
import { FormService } from '../form/form.service';

describe('SelectionService', () => {
    let service: SelectionService;
    let store: DrawStore;
    let rect: SVGGraphicsElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SelectionService, RectangleService, DrawStore, FormService],
        });
        store = TestBed.get(DrawStore);
        service = TestBed.get(SelectionService);

        const svg = service.renderer.createElement('svg', 'svg') as SVGSVGElement;
        store.setDrawSvg(svg);

        rect = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;

        service.renderer.setAttribute(rect, 'stroke-width', '5');
        service.renderer.setAttribute(rect, 'stroke', '#000000ff');
        spyOn(rect, 'getBoundingClientRect').and.returnValue(new DOMRect(200, 200, 100, 100));

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start() should clear #selectionBox on right click', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
            button: 2,
        });
        service.state.selectionBox.svgs = [rect];
        service.start(mouseDown);
        expect(service.state.selectionBox.svgs).toEqual([]);
    });

    it('#start() should add svg to #selectionBox on left click if svg is in the draw', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
            button: 0,
        });
        service.state.svgState.svgs = [rect];
        service.start({ ...mouseDown, offsetX: 100, offsetY: 10, target: rect });
        expect(service.state.selectionBox.svgs).toEqual([rect]);
    });
    it('#start() should not add svg to #selectionBox on left click if svg is not in the draw', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
            button: 0,
        });
        service.state.svgState.svgs = [];
        service.start({ ...mouseDown, offsetX: 100, offsetY: 10, target: rect });
        expect(service.state.selectionBox.svgs).toEqual([]);
    });

    it('#start() should call #start() function of rectangle if selectionBox #isMoving is false', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
            button: 0,
        });
        service.state.selectionBox.isMoving = false;
        const spy = spyOn(service.rectangle, 'start');
        service.start(mouseDown);
        expect(spy).toHaveBeenCalled();
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

    it('#selectSvg() should add svg to #selectionBox if selection is colliding', () => {
        let selectRect = new DOMRect(250, 250, 45, 20);
        service.selectSvg(rect, selectRect);
        expect(service.state.selectionBox.svgs).toEqual([rect]);
    });
    it('#selectSvg() should not add svg to #selectionBox if selection is not colliding', () => {
        let selectRect = new DOMRect(400, 400, 45, 20);
        service.selectSvg(rect, selectRect);
        expect(service.state.selectionBox.svgs).toEqual([]);
    });
    it('#selectSvg() should not add svg to #selectionBox if selection is colliding but svg is already selected', () => {
        let selectRect = new DOMRect(250, 250, 45, 20);
        service.state.selectionBox.svgs = [rect];
        service.selectSvg(rect, selectRect);
        expect(service.state.selectionBox.svgs).toEqual([rect]);
    });

    it('#selectSvg() should delete svg from #selectionBox if selection is not colliding', () => {
        let selectRect = new DOMRect(400, 400, 45, 20);
        service.state.selectionBox.svgs = [rect];
        service.selectSvg(rect, selectRect);
        expect(service.state.selectionBox.svgs).toEqual([]);
    });
    it('#handleKeyDown() should set #isCtrl to true if key pressed is Control ', () => {
        service.handleKeyDown(SelectionButtons.Control);
        expect(service.isCtrl).toBeTruthy();
    });
    it('#handleKeyUp() should set #isCtrl to false if key released is Control ', () => {
        service.handleKeyUp(SelectionButtons.Control);
        expect(service.isCtrl).toBeFalsy();
    });
    it('#handleKeyDown() should call store #paste if key pressed is V and #isCtrl is true ', () => {
        service.isCtrl = true;
        const spy = spyOn(store, 'paste');
        service.handleKeyDown(SelectionButtons.V);
        expect(spy).toHaveBeenCalled();
    });

    it('#handleKeyDown() should not call store #paste if key pressed is V and #isCtrl is false ', () => {
        service.isCtrl = false;
        const spy = spyOn(store, 'paste');
        service.handleKeyDown(SelectionButtons.V);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#handleKeyDown() should call store #copy if key pressed is C ,selectionBox #display #isCtrl are true ', () => {
        service.isCtrl = true;
        service.state.selectionBox.display = true;
        const spy = spyOn(store, 'copy');
        service.handleKeyDown(SelectionButtons.C);
        expect(spy).toHaveBeenCalled();
    });

    it('#handleKeyDown() should call store #copy if key pressed is C ,selectionBox #display is false', () => {
        service.isCtrl = true;
        service.state.selectionBox.display = false;
        const spy = spyOn(store, 'copy');
        service.handleKeyDown(SelectionButtons.C);
        expect(spy).not.toHaveBeenCalled();
    });
});
