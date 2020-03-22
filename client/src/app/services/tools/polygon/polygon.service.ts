import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Coordinate } from 'src/app/models/coordinate';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends Tool {
    state: DrawState;
    centerX: number;
    centerY: number;
    isDrawing = false;
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

        this.centerX = event.offsetX;
        this.centerY = event.offsetY;
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        this.svg.setAttribute('stroke-width', this.state.globalState.thickness.toString());
        this.setColors(this.state.polygonType);
        this.state.svgState.drawSvg.appendChild(this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.isDrawing = true;
    }

    continue(event: MouseEvent) {
        let size = (Math.abs(this.centerX - event.offsetX) + Math.abs(this.centerY - event.offsetY)) / 2;
        this.draw(this.centerX, this.centerY, this.state.polygonSides, size);
    }

    draw(centerX: number, centerY: number, sides: number, size: number) {
        let points: Coordinate[] = [];

        for (let i: number = 0; i < sides; i++) {
            let angle = ((360 / sides) * (i + 1) + 90) * (Math.PI / 180);
            let pointX = centerX + size * Math.cos(angle);
            let pointY = centerY - size * Math.sin(angle);
            points.push(new Coordinate(pointX, pointY));
        }
        this.svg.setAttribute('points', this.pointsToString(points));
    }
    stop() {
        if (this.isDrawing) {
            this.store.pushSvg(this.svg);
            this.state.svgState.drawSvg.removeChild(this.svg);
            this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
            this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
            this.isDrawing = false;
        }
        this.stopSignal();
    }

    pointsToString(points: Coordinate[]): string {
        let result: string = '';
        for (let i = 0; i < points.length; i++) {
            result = result.concat(`${points[i].pointX},${points[i].pointY}`);
            if (i < points.length - 1) {
                result = result.concat(' ');
            }
        }
        return result;
    }

    setColors(type: string) {
        switch (type) {
            case 'outline':
                this.svg.setAttribute('fill', 'transparent');
                this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());

                break;
            case 'outlineFill':
                this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
                this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());

                break;
            case 'fill':
                this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
                this.svg.setAttribute('stroke', 'transparent');
                break;
        }
    }
}
