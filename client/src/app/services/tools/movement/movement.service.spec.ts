import { TestBed } from '@angular/core/testing';

import { MovementService } from './movement.service';

import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';

describe('MovementService', () => {
    let service: MovementService;
    let store: DrawStore;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MovementService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        service = TestBed.get(MovementService);

        const svg = service.renderer.createElement('svg', 'svg') as SVGSVGElement;
        store.setDrawSvg(svg);

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });
    it('should be created', () => {
        const service: MovementService = TestBed.get(MovementService);
        expect(service).toBeTruthy();
    });
});
