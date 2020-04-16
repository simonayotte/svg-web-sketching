import { TestBed } from '@angular/core/testing';
import { Coordinate } from 'src/app/models/coordinate';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { ALT_ROTATION, DEFAULT_ROTATION, RotationService } from './rotation.service';
/* tslint:disable:no-magic-numbers */
describe('RotationService', () => {
  let service: RotationService;
  let store: DrawStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RotationService, DrawStore],
    });
    store = TestBed.get(DrawStore);
    service = TestBed.get(RotationService);

    store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

    store.stateObs.subscribe((value: DrawState) => {
      service.state = value;
    });
  });

  it('should be created', () => {
    const rotation: RotationService = TestBed.get(RotationService);
    expect(rotation).toBeTruthy();
  });

  it('#start() should call #multipleRotation()', (done: DoneFn) => {
    const spy = spyOn(service, 'multipleRotation');
    service.start();
    expect(spy).toHaveBeenCalled();
    done();
  });

  it('#handleKeyDown should change #isShiftDown', () => {
    const eventMock = new KeyboardEvent('keydown', { key: 'Shift'});
    service.handleKeyDown(eventMock.key);
    expect(service.isShiftDown).toBeTruthy();
  });

  it('#handleKeyUp should change #isShiftDown', () => {
    const eventMock = new KeyboardEvent('keyup', { key: 'Shift'});
    service.handleKeyUp(eventMock.key);
    expect(service.isShiftDown).not.toBeTruthy();
  });

  it('#handleKeyDown should change to ALT_ROTATION', () => {
    const eventMock = new KeyboardEvent('keydown', { key: 'Alt'});
    service.handleKeyDown(eventMock.key);
    expect(service.angle).toBe(ALT_ROTATION);
  });

  it('#handleKeyUp should change to DEFAULT_ROTATION', () => {
    const eventMock = new KeyboardEvent('keyup', { key: 'Alt'});
    service.handleKeyUp(eventMock.key);
    expect(service.angle).toEqual(DEFAULT_ROTATION);
  });

  it('#findSVGCenter should return center of SVGElement', () => {
    const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
    service.renderer.setAttribute(svg, 'width', '20');
    service.renderer.setAttribute(svg, 'height', '20');
    const coord = service.findSVGCenter(svg);
    expect(coord).toEqual(new Coordinate(52, 0) );
  });

  it('#rotate() should set the correct attributes on rotation', () => {
    const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
    const spy = spyOn(svg, 'setAttribute');
    service.rotate(svg, 20, 20);
    expect(spy).toHaveBeenCalledWith('transform', 'translate(0,0) rotate(15 20 20)');
  });

  it('#rotate() should call getTranslation', () => {
    const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
    service.renderer.setAttribute(svg, 'width', '20');
    service.renderer.setAttribute(svg, 'height', '20');
    service.renderer.setAttribute(svg, 'transform', 'translate(0,0) rotate(15 20 20)');
    const spy = spyOn(Tool, 'getTranslation').and.callThrough();
    service.rotate(svg, 20, 20);
    expect(spy).toHaveBeenCalled();
  });

  it('#rotate() should call getRotation', () => {
    const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
    service.renderer.setAttribute(svg, 'width', '20');
    service.renderer.setAttribute(svg, 'height', '20');
    service.renderer.setAttribute(svg, 'transform', 'translate(0,0) rotate(15 20 20)');
    const spy = spyOn(Tool, 'getRotation').and.callThrough();
    service.rotate(svg, 20, 20);
    expect(spy).toHaveBeenCalled();
  });

  it('#multipleRotation() should call #rotate()', () => {
    const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
    service.state.selectionBox.svgs.push(svg);
    const spy = spyOn(service, 'rotate');
    service.multipleRotation();
    expect(spy).toHaveBeenCalled();
  });

  it('#multipleRotation() should call #findSVGCenter() if shiftIsDown', () => {
    const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
    service.isShiftDown = true;
    service.state.selectionBox.svgs.push(svg);
    const spy = spyOn(service, 'findSVGCenter');
    service.multipleRotation();
    expect(spy).toHaveBeenCalled();
  });
});
