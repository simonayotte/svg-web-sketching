import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Coordinate } from 'src/app/models/coordinate';
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    state: DrawState;
    points: Coordinate[] = [];
    circle: SVGCircleElement;
    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }

    start(event: MouseEvent) {
        let x = event.offsetX;
        let y = event.offsetY;
        let thickness = this.state.globalState.thickness;

        this.drawCircle(x, y, thickness / 2);

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.svg.setAttribute('stroke', this.state.colorState.firstColor.hex());
        this.svg.setAttribute('fill', 'none');
        this.svg.setAttribute('stroke-width', this.state.globalState.thickness.toString());
        this.svg.setAttribute('stroke-linecap', 'round');
        this.svg.setAttribute('stroke-linejoin', 'round');

        this.svg.setAttribute('d', `M ${x} ${y} `);
        this.state.svgState.drawSvg.appendChild(this.svg);
        this.points.push(new Coordinate(x, y));
    }

    continue(event: MouseEvent) {
        let path = this.svg.getAttribute('d') as string;
        path = path.concat(`L ${event.offsetX} ${event.offsetY} `);
        this.svg.setAttribute('d', path);
        this.points.push(new Coordinate(event.offsetX, event.offsetY));
    }
    stop() {
        if (this.points.length > 1) {
            this.store.pushSvg(this.svg);
        } else {
            this.store.pushSvg(this.circle);
        }

        this.points = [];
        this.state.svgState.drawSvg.removeChild(this.circle);
        this.state.svgState.drawSvg.removeChild(this.svg);
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
