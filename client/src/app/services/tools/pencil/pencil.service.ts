import { Injectable, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    isDrawing: boolean;
    isPath: boolean;
    circle: SVGCircleElement;

    protected path: string;

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.isDrawing = false;
        this.isPath = false;
        this.path = '';
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(event: MouseEvent): void {
        const x = event.offsetX;
        const y = event.offsetY;
        const thickness = this.state.globalState.thickness;

        this.drawCircle(x, y, thickness / 2);

        this.svg = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.firstColor.hex());
        this.renderer.setAttribute(this.svg, 'fill', 'none');
        this.renderer.setAttribute(this.svg, 'stroke-width', this.state.globalState.thickness.toString());
        this.renderer.setAttribute(this.svg, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.svg, 'stroke-linejoin', 'round');
        this.path = `M ${x} ${y} `;
        this.renderer.setAttribute(this.svg, 'd', this.path);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.isDrawing = true;
    }

    continue(event: MouseEvent): void {
        this.draw(event.offsetX, event.offsetY);
        if (!this.isPath) {
            this.isPath = true;
        }
    }

    draw(x: number, y: number): void {
        this.path = this.path.concat(`L ${x} ${y} `);
        this.renderer.setAttribute(this.svg, 'd', this.path);
    }
    stop(): void {
        if (this.isDrawing) {
            if (this.isPath) {
                this.store.pushSvg(this.svg);
            } else {
                this.store.pushSvg(this.circle);
            }

            this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
            this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);

            this.renderer.removeChild(this.state.svgState.drawSvg, this.circle);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
            this.isDrawing = false;
            this.isPath = false;
        }
        this.stopSignal();
    }

    drawCircle(x: number, y: number, r: number): void {
        this.circle = this.renderer.createElement('circle', 'svg');
        this.renderer.setAttribute(this.circle, 'cx', x.toString());

        this.renderer.setAttribute(this.circle, 'cy', y.toString());
        this.renderer.setAttribute(this.circle, 'r', r.toString());
        this.renderer.setAttribute(this.circle, 'fill', this.state.colorState.firstColor.hex());

        this.renderer.appendChild(this.state.svgState.drawSvg, this.circle);
    }
}
