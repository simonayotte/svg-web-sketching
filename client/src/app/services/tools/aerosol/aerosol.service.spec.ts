import { TestBed } from '@angular/core/testing';
import { Color } from 'src/app/models/color';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';
import { AerosolService } from './aerosol.service';

describe('AerosolService', () => {
    let service: AerosolService;
    let store: DrawStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AerosolService, DrawStore],
        });
        store = TestBed.get(DrawStore);
        service = TestBed.get(AerosolService);
        jasmine.clock().install();
        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));
        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
            service.state.colorState.firstColor = new Color(255, 0, 255, 255);
            service.state.colorState.secondColor = new Color(0, 0, 255, 255);
        });
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start() should #setAttribute of the path to add first point', (done: DoneFn) => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 20,
            clientY: 45,
        });

        service.svg = service.renderer.createElement('path', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');
        service.start(event);
        store.stateObs.subscribe((value: DrawState) => {
          expect(spy).toHaveBeenCalledWith(service.svg, 'd', 'M 20 45 ');
          done();
        });
    });

    it('#continue should set#x and #y to mouse position', (done: DoneFn) => {
        const event: MouseEvent = new MouseEvent('mousemove', {
            clientX: 30,
            clientY: 65,
        });

        service.start(event);
        store.stateObs.subscribe((value: DrawState) => {
          expect(service.x).toBe(30);
          expect(service.y).toBe(65);
          done();
        });
    });

    it('#stop should clearInterval and stop calling #spray', (done: DoneFn) => {
        const event: MouseEvent = new MouseEvent('mouseup', {
            clientX: 20,
            clientY: 45,
        });

        const spy = spyOn(service, 'spray');
        service.start(event);
        store.stateObs.subscribe((value: DrawState) => {
          expect(spy).not.toHaveBeenCalled();
          done();
        });
    });

    it('#stop should not call store #pushSvg() if #isDrawing is false', (done: DoneFn) => {
        const event: MouseEvent = new MouseEvent('mouseup', {
            clientX: 20,
            clientY: 45,
        });

        service.start(event);
        service.isDrawing = false;
        const spy = spyOn(store, 'pushSvg');
        service.stop();
        store.stateObs.subscribe((value: DrawState) => {
          expect(spy).not.toHaveBeenCalled();
          done();
        });
    });

    it('#stop should call store #pushSvg() if #isDrawing is true', (done: DoneFn) => {
        const event: MouseEvent = new MouseEvent('mouseup', {
            clientX: 20,
            clientY: 45,
        });

        service.start(event);
        const spy = spyOn(store, 'pushSvg');
        service.stop();
        store.stateObs.subscribe((value: DrawState) => {
          expect(spy).toHaveBeenCalled();
          done();
        });
    });

    it('#stop() should be called on mouse up', (done: DoneFn) => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
        });
        service.start(mouseDown);
        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        const spy = spyOn(service, 'stopSignal');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        store.stateObs.subscribe((value: DrawState) => {
          expect(spy).toHaveBeenCalled();
          done();
        });
    });

    it('#stop() should not be called on mouse up before mouse down', (done: DoneFn) => {
        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        const spy = spyOn(service, 'stopSignal');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        store.stateObs.subscribe((value: DrawState) => {
          expect(spy).not.toHaveBeenCalled();
          done();
        });
    });

    it('#spray() should not be called on mouse move before mouse down ', (done: DoneFn) => {
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
        });
        const spy = spyOn(service, 'spray');
        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        store.stateObs.subscribe((value: DrawState) => {
          expect(spy).not.toHaveBeenCalled();
          done();
        });
    });

    it('#spray() should not be called on mouse move after mouse up ', (done: DoneFn) => {
        const mouseDown: MouseEvent = new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 10,
        });
        service.start(mouseDown);
        const spy = spyOn(service, 'spray');

        const mouseUp: MouseEvent = new MouseEvent('mouseup');
        service.state.svgState.drawSvg.dispatchEvent(mouseUp);
        const mouseMove: MouseEvent = new MouseEvent('mousemove', {
            clientX: 75,
            clientY: 400,
        });
        service.state.svgState.drawSvg.dispatchEvent(mouseMove);
        store.stateObs.subscribe((value: DrawState) => {
          expect(spy).not.toHaveBeenCalled();
          done();
        });
    });

    it('#generateRandomPoint should return random value', (done: DoneFn) => {
      service.state.globalState.thickness = 20;
      const point = service.generateRandomPoint(0, 0);
      store.stateObs.subscribe((value: DrawState) => {
        expect(point.pointX <= 10 || point.pointX >= -10).toBeTruthy();
        expect(point.pointY <= 10 || point.pointX >= -10).toBeTruthy();
        done();
      });
    });

    it('#spray should call generateRandomSpray ', (done: DoneFn) => {
      const spy = spyOn(service, 'generateRandomSpray');
      service.x = 20;
      service.y = 20;
      service.spray();
      store.stateObs.subscribe((value: DrawState) => {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });

    it('#generateRandomSpray should add point to path', (done: DoneFn) => {
      const mouseDown: MouseEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 10,
      });
      service.start(mouseDown);
      service.state.emissionRate = 20;
      service.path = `M ${3} ${2} h 1`;
      const length = service.path.length;
      service.generateRandomSpray(30, 20);
      store.stateObs.subscribe((value: DrawState) => {
        expect(service.path.length !== length).toBeTruthy();
        done();
      });
    });

    it('#convertEmissionRate should return correct values', (done: DoneFn) => {
      service.state.emissionRate = 20000;
      store.stateObs.subscribe((value: DrawState) => {
        expect(service.convertEmissionRate() === 10000).toBeTruthy();
        done();
      });
    });
});
