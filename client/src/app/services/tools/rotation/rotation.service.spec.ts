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
    let svg: SVGGraphicsElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RotationService, DrawStore],
        });
        store = TestBed.get(DrawStore);
        service = TestBed.get(RotationService);
        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

        svg = service.renderer.createElement('rect', 'svg');
        service.renderer.setAttribute(svg, 'width', '20');
        service.renderer.setAttribute(svg, 'height', '20');
        service.renderer.setAttribute(svg, 'transform', 'translate(0,0) rotate(15 20 20)');

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

    it('#handleKeyDown() should change #isShiftDown', () => {
        const eventMock = new KeyboardEvent('keydown', { key: 'Shift' });
        service.handleKeyDown(eventMock.key);
        expect(service.isShiftDown).toBeTruthy();
    });

    it('#handleKeyUp() should change #isShiftDown', () => {
        const eventMock = new KeyboardEvent('keyup', { key: 'Shift' });
        service.handleKeyUp(eventMock.key);
        expect(service.isShiftDown).not.toBeTruthy();
    });

    it('#handleKeyDown() should change to ALT_ROTATION', () => {
        const eventMock = new KeyboardEvent('keydown', { key: 'Alt' });
        service.handleKeyDown(eventMock.key);
        expect(service.angle).toBe(ALT_ROTATION);
    });

    it('#handleKeyUp() should change to DEFAULT_ROTATION', () => {
        const eventMock = new KeyboardEvent('keyup', { key: 'Alt' });
        service.handleKeyUp(eventMock.key);
        expect(service.angle).toEqual(DEFAULT_ROTATION);
    });

    it('#findSVGCenter() should return center of SVGElement', () => {
        const coord = service.findSVGCenter(svg);
        expect(coord).toEqual(new Coordinate(52, 0));
    });

    it('#rotate() should increment svg rotation by 15 if alt is not pressed', () => {
        service.angle = 15;
        const spy = spyOn(svg, 'setAttribute');
        service.rotate(svg, 20, 20);
        expect(spy).toHaveBeenCalledWith('transform', 'translate(0,0) rotate(30 20 20)');
    });

    it('#rotate() should increment svg rotation by 1 if alt is pressed ', () => {
        service.angle = 1;
        const spy = spyOn(svg, 'setAttribute');
        service.rotate(svg, 20, 20);
        expect(spy).toHaveBeenCalledWith('transform', 'translate(0,0) rotate(16 20 20)');
    });

    it('#rotate() should call #getTranslation() and #getRotation()', () => {
        const translateSpy = spyOn(Tool, 'getTranslation').and.callThrough();
        const rotateSpy = spyOn(Tool, 'getRotation').and.callThrough();
        service.rotate(svg, 20, 20);
        expect(translateSpy).toHaveBeenCalled();
        expect(rotateSpy).toHaveBeenCalled();
    });

    it('#resetRotation() should call #getTranslation() and #getRotation()', () => {
        const translateSpy = spyOn(Tool, 'getTranslation').and.callThrough();
        const rotateSpy = spyOn(Tool, 'getRotation').and.callThrough();
        service.state.selectionBox.svgs = [svg];
        service.resetRotation();
        expect(translateSpy).toHaveBeenCalled();
        expect(rotateSpy).toHaveBeenCalled();
    });

    it('#resetRotation() should set selectionBox #svgs rotation to 0', () => {
        const spy = spyOn(svg, 'setAttribute');
        service.state.selectionBox.svgs = [svg];
        service.resetRotation();
        expect(spy).toHaveBeenCalledWith('transform', 'translate(0,0) rotate(0 20 20)');
    });

    it('#multipleRotation() should call #rotate()', () => {
        service.state.selectionBox.svgs.push(svg);
        const spy = spyOn(service, 'rotate');

        service.multipleRotation();
        expect(spy).toHaveBeenCalled();
    });

    it('#multipleRotation() should call #findSVGCenter() if shiftIsDown', () => {
        service.isShiftDown = true;
        service.state.selectionBox.svgs.push(svg);
        const spy = spyOn(service, 'findSVGCenter').and.returnValue(new Coordinate(10, 50));
        service.multipleRotation();
        expect(spy).toHaveBeenCalled();
    });
});
