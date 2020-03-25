import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    state: DrawState;
    textureMap: Map<string, string> = new Map();
    isDrawing = false;
    isPath = false;
    circle: SVGCircleElement;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });

        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    start(event: MouseEvent) {
        let x = event.offsetX;
        let y = event.offsetY;
        let thickness = this.state.globalState.thickness;

        this.drawCircle(x, y, thickness / 2);

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        if (this.state.brushTexture === 'normal') {
            this.svg.setAttribute('stroke', this.state.colorState.firstColor.hex());
        } else {
            this.svg.setAttribute('stroke', `url(#${this.state.brushTexture})`);
            this.circle.setAttribute('fill', `url(#${this.state.brushTexture})`);
        }
        this.svg.setAttribute('fill', 'none');
        this.svg.setAttribute('stroke-width', this.state.globalState.thickness.toString());
        this.svg.setAttribute('stroke-linecap', 'round');
        this.svg.setAttribute('stroke-linejoin', 'round');

        this.svg.setAttribute('d', `M ${x} ${y} `);
        this.state.svgState.drawSvg.appendChild(this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.isDrawing = true;
    }

    continue(event: MouseEvent) {
        this.draw(event.offsetX, event.offsetY);
        if (!this.isPath) {
            this.isPath = true;
        }
    }

    draw(x: number, y: number) {
        let path = this.svg.getAttribute('d') as string;
        path = path.concat(`L ${x} ${y} `);
        this.svg.setAttribute('d', path);
    }
    stop() {
        if (this.isDrawing) {
            if (this.isPath) {
                this.store.pushSvg(this.svg);
            } else {
                this.store.pushSvg(this.circle);
            }

            this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
            this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);

            this.state.svgState.drawSvg.removeChild(this.circle);
            this.state.svgState.drawSvg.removeChild(this.svg);
            this.isDrawing = false;
            this.isPath = false;
        }
        this.stopSignal();
    }

    drawCircle(x: number, y: number, r: number) {
        this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.circle.setAttribute('cx', x.toString());
        this.circle.setAttribute('cy', y.toString());
        this.circle.setAttribute('r', r.toString());
        this.circle.setAttribute('fill', this.state.colorState.firstColor.hex());
        this.state.svgState.drawSvg.appendChild(this.circle);
    }
}
