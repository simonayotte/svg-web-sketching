// import { TestBed } from '@angular/core/testing';

// import { AerosolService } from './aerosol.service';
// import { DrawStore } from '../../../store/draw-store';
// import { DrawState } from 'src/app/state/draw-state';
// import { Color } from 'src/app/models/color';

// describe('AerosolService', () => {
//   let service: AerosolService;
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [AerosolService, DrawStore],
//         });
//         let store: DrawStore = TestBed.get(DrawStore);

//         store.setCanvasHTML(document.createElement('canvas'));

//         store.stateObs.subscribe((value: DrawState) => {
//             service = TestBed.get(AerosolService);
//             service.element = {
//                 ...service.element,
//                 primaryColor: value.colorState.firstColor.hex(),
//                 secondaryColor: value.colorState.secondColor.hex(),
//                 thickness: 20,
//                 startSelectX: 0,
//                 startSelectY: 0,
//                 endSelectX: 0,
//                 endSelectY: 0,
//                 type: 'outline',
//                 isCircle: false,
//             };
//             service.state = value;
//         });
//     });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('#start should initialize element', () => {
//     const event: MouseEvent = new MouseEvent('mousedown', {
//       clientX: 300,
//       clientY: 400,
//     });

//     service.start(event);
//     expect(service.element).not.toBeUndefined();
//   });
// });
