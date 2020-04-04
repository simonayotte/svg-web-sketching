import { Injectable, RendererFactory2 } from '@angular/core';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { Tool } from '../../../models/tool';

@Injectable({
    providedIn: 'root',
})
export class ApplicatorService extends Tool {
    state: DrawState;

    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(event: MouseEvent) {
        const svg = event.target as SVGGraphicsElement;
        if (this.state.svgState.svgs.includes(svg)) {
            this.applyColor(svg, event.button);
        }
    }

    applyColor(svg: SVGGraphicsElement, button: number) {
        if (button === 0) {
            this.setFillColor(svg, this.state.colorState.firstColor.hex());
        } else if (button === 2) {
            this.setBorderColor(svg, this.state.colorState.secondColor.hex());
        }
    }

    setFillColor(svg: SVGGraphicsElement, color: string) {
        if (svg.getAttribute('fill') && svg.getAttribute('fill') !== 'none') {
            this.store.saveSvgsState(this.copyState(this.state.svgState.svgs));
            this.renderer.setAttribute(svg, 'fill', color);
        }
    }

    setBorderColor(svg: SVGGraphicsElement, color: string) {
        if (svg.getAttribute('stroke') && svg.getAttribute('stroke') !== 'none') {
            this.store.saveSvgsState(this.copyState(this.state.svgState.svgs));
            this.renderer.setAttribute(svg, 'stroke', color);
        }
    }
}
