import { TestBed } from '@angular/core/testing';

import { Color } from 'src/app/models/color';
import { Types } from 'src/app/models/enums';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { FormService } from './form.service';

describe('FormService', () => {
    let service: FormService;
    let store: DrawStore;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FormService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        service = TestBed.get(FormService);
        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
            service.state.colorState.firstColor = new Color(255, 0, 255, 255);
            service.state.colorState.secondColor = new Color(0, 0, 255, 255);
        });
    });

    it('should be created', () => {
        const service: FormService = TestBed.get(FormService);
        expect(service).toBeTruthy();
    });

    it('#setColors() should call #setAttribute 2 times if #type is valid', () => {
        service.svg = service.renderer.createElement('ellipse', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');

        service.setColors(Types.Outline);

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('#setColors() should call #setAttribute with fill as none and stroke as secondColor if ellipsisType is outline', () => {
        service.svg = service.renderer.createElement('ellipse', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');

        service.setColors(Types.Outline);
        expect(spy).toHaveBeenCalledWith(service.svg, 'fill', 'none');
        expect(spy).toHaveBeenCalledWith(service.svg, 'stroke', '#0000ffff');
    });
    it('#setColors() should call #setAttribute with fill as firstColor and stroke as secondColor if ellipsisType is outlineFill', () => {
        service.svg = service.renderer.createElement('ellipse', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');

        service.setColors(Types.OutlineFill);

        expect(spy).toHaveBeenCalledWith(service.svg, 'fill', '#ff00ffff');
        expect(spy).toHaveBeenCalledWith(service.svg, 'stroke', '#0000ffff');
    });
    it('#setColors() should call #setAttribute with fill as firstColor and stroke as none if ellipsisType is fill', () => {
        service.svg = service.renderer.createElement('ellipse', 'svg');
        const spy = spyOn(service.renderer, 'setAttribute');

        service.setColors(Types.Fill);
        expect(spy).toHaveBeenCalledWith(service.svg, 'fill', '#ff00ffff');
        expect(spy).toHaveBeenCalledWith(service.svg, 'stroke', 'none');
    });
});
