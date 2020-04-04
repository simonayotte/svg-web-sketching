import { TestBed } from '@angular/core/testing';

import { ApplicatorService } from './applicator.service';

import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

/* tslint:disable:no-magic-numbers */
describe('ApplicatorService', () => {
    let service: ApplicatorService;
    let store: DrawStore;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ApplicatorService, DrawStore],
        });
        store = TestBed.get(DrawStore);

        service = TestBed.get(ApplicatorService);

        store.setDrawSvg(service.renderer.createElement('svg', 'svg'));

        store.stateObs.subscribe((value: DrawState) => {
            service.state = value;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#start() should call #applyColor() if clicked on svg that is in store', () => {
        const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
        service.state.svgState.svgs = [svg];

        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
            button: 0,
        });

        const spy = spyOn(service, 'applyColor');
        service.start({ ...event, target: svg });
        expect(spy).toHaveBeenCalled();
    });

    it('#start() should not call #applyColor() if clicked on svg that is not in store', () => {
        const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
        service.state.svgState.svgs = [];
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
            button: 0,
            relatedTarget: svg,
        });

        const spy = spyOn(service, 'applyColor');
        service.start({ ...event, target: svg });
        expect(spy).not.toHaveBeenCalled();
    });

    it('#applyColor() should  call #setFillColor() if left click (0)', () => {
        const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;

        const spy = spyOn(service, 'setFillColor');
        service.applyColor(svg, 0);
        expect(spy).toHaveBeenCalledWith(svg, service.state.colorState.firstColor.hex());
    });

    it('#applyColor() should  call #setBorderColor() if right click (2)', () => {
        const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
        const spy = spyOn(service, 'setBorderColor');
        service.applyColor(svg, 2);
        expect(spy).toHaveBeenCalledWith(svg, service.state.colorState.secondColor.hex());
    });

    it('#setFillColor() should call #setAttribute() of svg if fill attribute is valid', () => {
        const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
        service.renderer.setAttribute(svg, 'fill', '#ffffffff');
        const spy = spyOn(service.renderer, 'setAttribute');
        service.setFillColor(svg, '#12345678');
        expect(spy).toHaveBeenCalledWith(svg, 'fill', '#12345678');
    });

    it('#setFillColor() should not call #setAttribute() of svg if fill attribute is not valid', () => {
        const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
        service.renderer.setAttribute(svg, 'fill', 'none');
        const spy = spyOn(service.renderer, 'setAttribute');
        service.setFillColor(svg, '#12345678');
        expect(spy).not.toHaveBeenCalled();
    });

    it('#setBorderColor() should call #setAttribute() of svg if stroke attribute is valid', () => {
        const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
        service.renderer.setAttribute(svg, 'stroke', '#ffffffff');
        const spy = spyOn(service.renderer, 'setAttribute');
        service.setBorderColor(svg, '#12345678');
        expect(spy).toHaveBeenCalledWith(svg, 'stroke', '#12345678');
    });

    it('#setBorderColor() should not call #setAttribute() of svg if stroke attribute is not valid', () => {
        const svg = service.renderer.createElement('rect', 'svg') as SVGGraphicsElement;
        service.renderer.setAttribute(svg, 'stroke', 'none');
        const spy = spyOn(service.renderer, 'setAttribute');
        service.setBorderColor(svg, '#12345678');
        expect(spy).not.toHaveBeenCalled();
    });
});
