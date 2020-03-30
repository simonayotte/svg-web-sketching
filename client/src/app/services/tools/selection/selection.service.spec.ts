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
          button: 0
      });

      service.start(mouseDown);
      expect(service.selectionState.singleSelect).toBeTruthy();
  });

  it('#start() should set #selectionState.isSelecting to true on leftclick ', () => {
    const mouseDown: MouseEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 75,
        button: 0
    });

    service.start(mouseDown);
    expect(service.selectionState.isSelecting).toBeTruthy();
  });

  it('#start() should set #selectionState.isDeselecting to true on rightclick ', () => {
    const mouseDown: MouseEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 75,
        button: 2
    });

    service.start(mouseDown);
    expect(service.selectionState.isDeselecting).toBeTruthy();
    });

  it('#determineMovingState() should set #selectionState.isMoving to true when clicking and gragging an object', () => {
    let testElement = new Element();
    const mouseMove: MouseEvent = new MouseEvent('mousemove', {
        clientX: 50,
        clientY: 75,
        button: 1
    });
    service.shapes = [testElement];
    service.selectedShapes = [testElement];

    service.determineMovingState(mouseMove, testElement);
    expect(service.selectionState.isMoving).toBeTruthy();
    });

  it('#determineMovingState() should select the element when clicking and dragging an non selected object', () => {
    let testElement = new Element();
    const mouseMove: MouseEvent = new MouseEvent('mousemove', {
        clientX: 50,
        clientY: 75,
        button: 1
    });
    service.shapes = [testElement];
    service.determineMovingState(mouseMove, testElement);
    expect(service.selectedShapes[0]).toBe(testElement);
  });

  it('#determineMovingState() should set #selectionState.isMoving to true when clicking and dragging in an encompassing box', () => {
    let testElement = new Element();
    const mouseMove: MouseEvent = new MouseEvent('mousemove', {
        clientX: 50,
        clientY: 75,
        button: 1
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
        button: 1
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
      let testElement = new Element();
      service.shapes = [testElement];
      service.selectionState.isSelecting = true;
      service.findSingleShape(testElement);
      expect(service.selectedShapes).toBe([testElement]);
    });

    it('#findSingleShape() should reset selectedShapes', () => {
      let testElement = new Element();
      service.shapes = [];
      service.selectionState.isSelecting = true;
      service.findSingleShape(testElement);
      expect(service.selectedShapes).toBe([]);
    });

    it('#findSingleShape() should element from remove from selectedShapes', () => {
      let testElement = new Element();
      service.shapes = [testElement];
      service.selectedShapes = [testElement];
      service.selectionState.isDeselecting = true;
      service.findSingleShape(testElement);
      expect(service.selectedShapes).toBe([]);
    });

    // TODO
    it('#findMultipleShapes() should return the selected shapes', () => {
      let testElement = new Element();
      testElement.setAttribute('stroke-width', (1).toString());
      testElement.setAttribute('x', (1).toString());
      testElement.setAttribute('y', (1).toString());
      testElement.setAttribute('height', (1).toString());
      testElement.setAttribute('width', (1).toString());


      service.shapes = [testElement];
      service.selectedShapes = [];
      expect(service.findMultipleShapes([testElement],1,1,2,2)).toBe([testElement]);
    });

    it('#findMultipleShapes() should return the selected shapes', () => {
      let testElement = new Element();
      testElement.setAttribute('stroke-width', (1).toString());
      testElement.setAttribute('x', (1).toString());
      testElement.setAttribute('y', (1).toString());
      testElement.setAttribute('height', (1).toString());
      testElement.setAttribute('width', (1).toString());


      service.shapes = [testElement];
      service.selectedShapes = [testElement];
      service.selectionState.initialX = 1;
      service.selectionState.initialY = 1;
      service.reverseSelection(2,2);
      expect(service.selectedShapes).toBe([]);
    });

    it('#createSelectionRectangle() should create the selection rectangle element', () => {
      const spy = spyOn(service.svg, 'setAttribute');
      service.createSelectionRectangle();
      expect(spy).toHaveBeenCalledWith('stroke-width', '1');
  });

  it('#drawSelectionRectangle() should call #setAttribute()', () => {
    service.svg = service.renderer.createElement('rect', 'svg');

    const spy = spyOn(service.svg, 'setAttribute');

    service.drawSelectionRectangle(10, 10, 50, 80);
    expect(spy).toHaveBeenCalledWith('x', '10');
    expect(spy).toHaveBeenCalledWith('y', '10');
});

// TODO
it('#createEncompassingBox() should create the encompassingBox element', () => {
  const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
  service.createEncompassingBox();
  expect(spy).toHaveBeenCalledWith('stroke-width', '1');
});

// TODO
it('#drawEncompassingBox() should create the encompassingBox element', () => {
  const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
  service.createEncompassingBox();
  expect(spy).toHaveBeenCalledWith('stroke-width', '1');
});

// TODO
it('#drawControlpoints() should set the position of controlpoint elements', () => {
  const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
  service.createEncompassingBox();
  expect(spy).toHaveBeenCalledWith('stroke-width', '1');
});

// TODO
it('#setPosition()t', () => {
  const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
  service.createEncompassingBox();
  expect(spy).toHaveBeenCalledWith('stroke-width', '1');
});

// TODO
it('#hideEncompassingBox()', () => {
  const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
  service.createEncompassingBox();
  expect(spy).toHaveBeenCalledWith('stroke-width', '1');
});

// TODO
it('#moveShapes()', () => {
  const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
  service.createEncompassingBox();
  expect(spy).toHaveBeenCalledWith('stroke-width', '1');
});

  it('#handleKeyDown() should call checkKeyTimePressed()', () => {
      service.handleKeyDown('');
      const spy = spyOn(service, 'checkKeyTimePressed');
      expect(spy).toHaveBeenCalled();
  });

  it('#handleKeyUp() should call checkKeyTimePressed()', () => {
      service.handleKeyUp('');
      const spy = spyOn(service, 'checkKeyTimePressed');
      expect(spy).toHaveBeenCalled();;
  });

// TODO
it('#checkKeyTimePressed()', () => {
  const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
  service.createEncompassingBox();
  expect(spy).toHaveBeenCalledWith('stroke-width', '1');
});

// TODO
it('#repeatKeyMovement()', () => {
  const spy = spyOn(service.encompassingBox.encompassingBox, 'setAttribute');
  service.createEncompassingBox();
  expect(spy).toHaveBeenCalledWith('stroke-width', '1');
});
});


