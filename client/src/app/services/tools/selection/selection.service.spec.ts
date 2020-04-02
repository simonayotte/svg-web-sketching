import { TestBed } from '@angular/core/testing';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';

import { SelectionService } from './selection.service';

describe('SelectionService', () => {
    let service: SelectionService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SelectionService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        service = TestBed.get(SelectionService);
        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start() should set #selectionState.singleSelect to true ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
            button: 0,
        });

        service.start(mouseDown);
        expect(service.selectionState.singleSelect).toBeTruthy();
    });

    it('#start() should set #selectionState.isSelecting to true on leftclick ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
            button: 0,
        });

        service.start(mouseDown);
        expect(service.selectionState.isSelecting).toBeTruthy();
    });

    it('#start() should set #selectionState.isDeselecting to true on rightclick ', () => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 75,
            button: 2,
        });

        service.start(mouseDown);
        expect(service.selectionState.isDeselecting).toBeTruthy();
    });

    it('#determineMovingState() should set #selectionState.isMoving to true when clicking and gragging an object', () => {
        let testElement = <Element>service.renderer.createElement('rect', 'svg');
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 50,
            clientY: 75,
            button: 1,
        });
        service.shapes = [testElement];
        service.selectedShapes = [testElement];

        service.determineMovingState(mouseMove, testElement);
        expect(service.selectionState.isMoving).toBeTruthy();
    });

    it('#determineMovingState() should select the element when clicking and dragging an non selected object', () => {
        let testElement = <Element>service.renderer.createElement('rect', 'svg');
        service.createEncompassingBox();
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 50,
            clientY: 75,
            button: 1,
        });
        service.shapes = [testElement];
        service.determineMovingState(mouseMove, testElement);
        expect(service.selectedShapes[0]).toBe(testElement);
    });

    it('#determineMovingState() should set #selectionState.isMoving to true when clicking and dragging in an encompassing box', () => {
        let testElement = <Element>service.renderer.createElement('rect', 'svg');
        service.createEncompassingBox();
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 50,
            clientY: 75,
            button: 1,
        });
        service.encompassingBox.startX = 0;
        service.encompassingBox.endX = 100;
        service.encompassingBox.startY = 0;
        service.encompassingBox.endY = 100;

        service.determineMovingState(mouseMove, testElement);
        expect(service.selectionState.isMoving).toBeTruthy();
    });

    it('#applySelection() should call the right methods', () => {
        const spy = spyOn(service, 'drawSelectionRectangle');

        service.selectionState.initialX = 0;
        service.selectionState.initialY = 0;
        service.applySelection(10, 10);
        expect(spy).toHaveBeenCalled();
    });

    it('#applyTranslation() should call #moveShapes()', () => {
        const spy = spyOn(service, 'moveShapes');

        service.movementState.lastPosX = 0;
        service.movementState.lastPosY = 0;
        service.applyTranslation(10, 10);
        expect(spy).toHaveBeenCalled();
    });

    it('#stopSelect() should call #drawEncompassingBox() and #stop()', () => {
        const mouseUp: MouseEvent = new MouseEvent('mouseup', {
            clientX: 50,
            clientY: 75,
            button: 1,
        });

        const spy1 = spyOn(service, 'drawEncompassingBox');
        const spy2 = spyOn(service, 'stop');

        service.stopSelect(mouseUp);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('#stop() should set selectionState attributes to false', () => {
        service.stop();
        expect(service.selectionState.isSelecting).toBeFalsy();
        expect(service.selectionState.isDeselecting).toBeFalsy();
        expect(service.selectionState.isMoving).toBeFalsy();
        expect(service.selectionState.selectionRectangle).toBeFalsy();
    });

    it('#findSingleShape() should add the shape to selectedShapes', () => {
        let testElement = <Element>service.renderer.createElement('rect', 'svg');

        service.shapes = [testElement];
        service.selectionState.isSelecting = true;
        service.findSingleShape(testElement);
        expect(service.selectedShapes).toEqual([testElement]);
    });

    it('#findSingleShape() should reset selectedShapes', () => {
        let testElement = <Element>service.renderer.createElement('rect', 'svg');
        service.shapes = [];
        service.selectionState.isSelecting = true;
        service.findSingleShape(testElement);
        expect(service.selectedShapes).toEqual([]);
    });

    it('#findSingleShape() should element from remove from selectedShapes', () => {
        let testElement = <Element>service.renderer.createElement('rect', 'svg');
        service.shapes = [testElement];
        service.selectedShapes = [testElement];
        service.selectionState.isDeselecting = true;
        service.findSingleShape(testElement);
        expect(service.selectedShapes).toEqual([]);
    });

    it('#findMultipleShapes() should return the selected shapes', () => {
        let testElement = <Element>service.renderer.createElement('rect', 'svg');
        testElement.setAttribute('stroke-width', (1).toString());
        testElement.setAttribute('x', (1).toString());
        testElement.setAttribute('y', (1).toString());
        testElement.setAttribute('height', (1).toString());
        testElement.setAttribute('width', (1).toString());

        service.shapes = [testElement];
        service.selectedShapes = [];
        expect(service.findMultipleShapes([testElement], 0, 0, 2, 2)).toEqual([testElement]);
    });

    it('#findMultipleShapes() should return the selected shapes', () => {
        let testElement = <Element>service.renderer.createElement('rect', 'svg');
        testElement.setAttribute('stroke-width', (1).toString());
        testElement.setAttribute('x', (1).toString());
        testElement.setAttribute('y', (1).toString());
        testElement.setAttribute('height', (1).toString());
        testElement.setAttribute('width', (1).toString());

        service.shapes = [testElement];
        service.selectedShapes = [testElement];
        service.selectionState.initialX = 1;
        service.selectionState.initialY = 1;
        service.reverseSelection(2, 2);
        expect(service.selectedShapes).toEqual([]);
    });

    it('#createSelectionRectangle() should create the selection rectangle element', () => {
        service.createSelectionRectangle();
        expect(service.svg).toBeTruthy();
    });

    it('#drawSelectionRectangle() should call #setAttribute()', () => {
        service.svg = service.renderer.createElement('rect', 'svg');

        const spy = spyOn(service.svg, 'setAttribute');

        service.drawSelectionRectangle(10, 10, 50, 80);
        expect(spy).toHaveBeenCalledWith('x', '10');
        expect(spy).toHaveBeenCalledWith('y', '10');
    });

    it('#createEncompassingBox() should create the encompassingBox element', () => {
        service.createEncompassingBox();
        expect(service.encompassingBox).toBeTruthy();
    });

    it('#drawEncompassingBox() should draw the encompassingBox element', () => {
        let testElement = [<Element>service.renderer.createElement('rect', 'svg')];
        testElement[0].setAttribute('x', '0');
        testElement[0].setAttribute('y', '0');
        testElement[0].setAttribute('height', '0');
        testElement[0].setAttribute('width', '0');

        service.createEncompassingBox();
        const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
        service.drawEncompassingBox(testElement);
        expect(spy).toHaveBeenCalledWith('x', '0');
        expect(spy).toHaveBeenCalledWith('y', '0');
        expect(spy).toHaveBeenCalledWith('height', '0');
        expect(spy).toHaveBeenCalledWith('width', '0');
        expect(spy).toHaveBeenCalledWith('opacity', '0.4');
    });

    it('#drawControlpoints() should set the position of controlpoint elements', () => {
        service.createEncompassingBox();

        const spy = spyOn(service, 'setPosition');
        service.drawControlPoints();
        expect(spy).toHaveBeenCalledTimes(4);
    });

    it('#setPosition() should set the attribute of given element', () => {
        let testElement = service.renderer.createElement('rect', 'svg');

        const spy = spyOn(testElement, 'setAttribute');
        service.setPosition(testElement, 1, 2, 3, 4);
        expect(spy).toHaveBeenCalledWith('x', '1');
        expect(spy).toHaveBeenCalledWith('y', '2');
        expect(spy).toHaveBeenCalledWith('height', '3');
        expect(spy).toHaveBeenCalledWith('width', '4');
    });

    it('#hideEncompassingBox() should set the opacity of encompassing box to 0', () => {
        service.createEncompassingBox();

        const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
        const spy1 = spyOn(service.encompassingBox.controlPoint1, 'setAttribute');
        const spy2 = spyOn(service.encompassingBox.controlPoint2, 'setAttribute');
        const spy3 = spyOn(service.encompassingBox.controlPoint3, 'setAttribute');
        const spy4 = spyOn(service.encompassingBox.controlPoint4, 'setAttribute');

        service.hideEncompassingBox();
        expect(spy).toHaveBeenCalledWith('opacity', '0');
        expect(spy1).toHaveBeenCalledWith('opacity', '0');
        expect(spy2).toHaveBeenCalledWith('opacity', '0');
        expect(spy3).toHaveBeenCalledWith('opacity', '0');
        expect(spy4).toHaveBeenCalledWith('opacity', '0');
    });

    it('#moveShapes() should apply movement to given shapes', () => {
        let testElement = [service.renderer.createElement('rect', 'svg')];
        service.createEncompassingBox();

        const spy = spyOn(testElement[0], 'setAttribute');
        service.moveShapes(testElement, 1, 1);
        expect(spy).toHaveBeenCalledWith('transform', 'translate(1,1)');
    });

    it('#handleKeyDown() should call checkKeyTimePressed()', () => {
        const spy = spyOn(service, 'checkKeyTimePressed');
        service.handleKeyDown('');
        expect(spy).toHaveBeenCalled();
    });

    it('#handleKeyUp() should call checkKeyTimePressed()', () => {
        const spy = spyOn(service, 'checkKeyTimePressed');
        service.handleKeyUp('');
        expect(spy).toHaveBeenCalled();
    });

    it('#checkKeyTimePressed() should start the timer when a movement key is pressed', () => {
        service.keys.arrowDownKey = true;
        service.keys.keepLooping = false;
        service.checkKeyTimePressed();
        expect(service.timer).toBeTruthy();
    });

    it('#checkKeyTimePressed() should stop the timer when no movement key is pressed', () => {
        service.keys.arrowDownKey = true;
        service.keys.keepLooping = false;
        service.checkKeyTimePressed();
        service.keys.arrowDownKey = false;
        service.checkKeyTimePressed();
        expect(service.keys.keepLooping).toBeFalsy();
    });

    it('#repeatKeyMovement() should call #moveShspes() when a movement key is pressed', () => {
        service.keys.repeat = true;
        service.keys.arrowRightKey = true;
        service.selectedShapes = [];
        const spy = spyOn(service, 'moveShapes');
        service.repeatKeyMovement();
        expect(spy).toHaveBeenCalled();
    });
});
