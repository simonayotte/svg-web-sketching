// import { TestBed } from '@angular/core/testing';
// import { AerosolService } from './aerosol.service';
// import { DrawStore } from '../../../store/draw-store';
// import { DrawState } from 'src/app/state/draw-state';
// import { Color } from 'src/app/models/color';

// describe('AerosolService', () => {
//     let service: AerosolService;
//     let store: DrawStore;

//     beforeEach(() => {
//         jasmine.clock().install();
//         TestBed.configureTestingModule({
//             providers: [AerosolService, DrawStore],
//         });
//         store = TestBed.get(DrawStore);
//         service = TestBed.get(AerosolService);
//         store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

//         store.stateObs.subscribe((value: DrawState) => {
//             service.state = value;
//             service.state.colorState.firstColor = new Color(255, 0, 255, 255);
//             service.state.colorState.secondColor = new Color(0, 0, 255, 255);
//         });
//     });

//     //SetInterval testing clock
//     afterEach(function() {
//         jasmine.clock().uninstall();
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('#start should setInterval on spray with emissionPeriod', () => {
//         const event: MouseEvent = new MouseEvent('mousedown', {
//             clientX: 20,
//             clientY: 45,
//         });
//         const spy = spyOn(service, 'spray');
//         service.start(event);

//         expect(spy).not.toHaveBeenCalled();

//         jasmine.clock().tick(51);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('#start() should #setAttribute of the path to add first point', () => {
//         const event: MouseEvent = new MouseEvent('mousedown', {
//             clientX: 20,
//             clientY: 45,
//         });

//         service.svg = service.renderer.createElement('path', 'svg');
//         const spy = spyOn(service.renderer, 'setAttribute');
//         service.start(event);
//         expect(spy).toHaveBeenCalledWith(service.svg, 'd', 'M 20 45 ');
//     });

//     it('#continue should set#x and #y to mouse position', () => {
//         const event: MouseEvent = new MouseEvent('mousemove', {
//             clientX: 30,
//             clientY: 65,
//         });

//         service.start(event);
//         expect(service.x).toBe(30);
//         expect(service.y).toBe(65);
//     });

//     it('#stop should clearInterval and stop calling #spray', () => {
//         const event: MouseEvent = new MouseEvent('mouseup', {
//             clientX: 20,
//             clientY: 45,
//         });

//         const spy = spyOn(service, 'spray');
//         service.start(event);
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('#stop should not call store #pushSvg() if #isDrawing is false', () => {
//         const event: MouseEvent = new MouseEvent('mouseup', {
//             clientX: 20,
//             clientY: 45,
//         });

//         service.start(event);
//         service.isDrawing = false;
//         const spy = spyOn(store, 'pushSvg');
//         service.stop();
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('#stop should call store #pushSvg() if #isDrawing is true', () => {
//         const event: MouseEvent = new MouseEvent('mouseup', {
//             clientX: 20,
//             clientY: 45,
//         });

//         service.start(event);
//         const spy = spyOn(store, 'pushSvg');
//         service.stop();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('#stop() should be called on mouse up', () => {
//         const mouseDown: MouseEvent = new MouseEvent('mousedown', {
//             clientX: 100,
//             clientY: 10,
//         });
//         service.start(mouseDown);
//         const mouseUp: MouseEvent = new MouseEvent('mouseup');
//         const spy = spyOn(service, 'stopSignal');
//         service.state.svgState.drawSvg.dispatchEvent(mouseUp);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('#stop() should not be called on mouse up before mouse down', () => {
//         const mouseUp: MouseEvent = new MouseEvent('mouseup');
//         const spy = spyOn(service, 'stopSignal');
//         service.state.svgState.drawSvg.dispatchEvent(mouseUp);
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('#spray() should not be called on mouse move before mouse down ', () => {
//         const mouseMove: MouseEvent = new MouseEvent('mousemove', {
//             clientX: 100,
//             clientY: 50,
//         });
//         const spy = spyOn(service, 'spray');
//         service.state.svgState.drawSvg.dispatchEvent(mouseMove);
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('#spray() should not be called on mouse move after mouse up ', () => {
//         const mouseDown: MouseEvent = new MouseEvent('mousedown', {
//             clientX: 100,
//             clientY: 10,
//         });
//         service.start(mouseDown);
//         const spy = spyOn(service, 'spray');

//         const mouseUp: MouseEvent = new MouseEvent('mouseup');
//         service.state.svgState.drawSvg.dispatchEvent(mouseUp);
//         const mouseMove: MouseEvent = new MouseEvent('mousemove', {
//             clientX: 75,
//             clientY: 400,
//         });
//         service.state.svgState.drawSvg.dispatchEvent(mouseMove);
//         expect(spy).not.toHaveBeenCalled();
//     });
// });
