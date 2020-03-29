import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Color } from 'src/app/models/color';

const DARK_RED = new Color(150, 0, 0, 255);

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    state: DrawState;
    renderer: Renderer2;
    oldStrokeColor: string = '';
    deletedSvgs: SVGGraphicsElement[] = [];

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });

        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(event: MouseEvent) {
        let svg = <SVGGraphicsElement>event.target;

        if (this.state.svgState.svgs.includes(svg) && !this.deletedSvgs.includes(svg)) {
            this.deletedSvgs.push(svg);
            this.renderer.removeChild(this.state.svgState.drawSvg, svg);
        }

        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
    }

    continue(event: MouseEvent) {
        let svg = <SVGGraphicsElement>event.target;

        if (this.state.svgState.svgs.includes(svg) && !this.deletedSvgs.includes(svg)) {
            this.deletedSvgs.push(svg);
            this.renderer.removeChild(this.state.svgState.drawSvg, svg);
        }
    }

    stop() {
        if (this.deletedSvgs.length > 0) {
            this.store.deleteSvgs(this.deletedSvgs);
            this.deletedSvgs = [];
        }

        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
    }

    onMouseOver(svg: SVGGraphicsElement) {
        this.oldStrokeColor = <string>svg.getAttribute('stroke');

        let strokeColor = new Color(200, 0, 0, 255);
        if (strokeColor.hex() === this.oldStrokeColor) {
            this.renderer.setAttribute(svg, 'stroke', DARK_RED.hex());
        } else {
            this.renderer.setAttribute(svg, 'stroke', strokeColor.hex());
        }
    }

    onMouseOut(svg: SVGGraphicsElement) {
        this.renderer.setAttribute(svg, 'stroke', this.oldStrokeColor);
    }

    onClick(svg: SVGGraphicsElement) {
        this.deletedSvgs.push(svg);
        this.stop();
    }
}
