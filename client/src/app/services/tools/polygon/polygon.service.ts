import { Injectable, RendererFactory2 } from '@angular/core';
import { Coordinate } from 'src/app/models/coordinate';
import { DrawStore } from 'src/app/store/draw-store';
import { FormService } from '../form/form.service';

const ROUND_DEGREES = 360;
const HALF_DEGREES = 180;
const QUARTER_DEGREES = 90;

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends FormService {
    centerX: number;
    centerY: number;

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super(store, rendererFactory);
        this.centerX = 0;
        this.centerY = 0;
    }

    start(event: MouseEvent): void {
        this.centerX = event.offsetX;
        this.centerY = event.offsetY;
        this.svg = this.renderer.createElement('polygon', 'svg');
        this.renderer.setAttribute(this.svg, 'stroke-width', this.state.globalState.thickness.toString());
        this.setColors(this.state.polygonType);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.isDrawing = true;
    }

    continue(event: MouseEvent): void {
        const size = (Math.abs(this.centerX - event.offsetX) + Math.abs(this.centerY - event.offsetY)) / 2;
        this.draw(this.centerX, this.centerY, this.state.polygonSides, size);
    }

    draw(centerX: number, centerY: number, sides: number, size: number): void {
        const points: Coordinate[] = [];
        // Divide 360 deg by n sides and get points with angle and polygon size
        for (let i = 0; i < sides; i++) {
            const angle = ((ROUND_DEGREES / sides) * (i + 1) + QUARTER_DEGREES) * (Math.PI / HALF_DEGREES);
            const pointX = centerX + size * Math.cos(angle);
            const pointY = centerY - size * Math.sin(angle);
            points.push(new Coordinate(pointX, pointY));
        }
        this.renderer.setAttribute(this.svg, 'points', this.pointsToString(points));
    }
    stop(): void {
        if (this.isDrawing) {
            this.store.pushSvg(this.svg);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
            this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
            this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
            this.isDrawing = false;
        }
        this.stopSignal();
    }

    pointsToString(points: Coordinate[]): string {
        let result = '';
        for (let i = 0; i < points.length; i++) {
            result = result.concat(`${points[i].pointX},${points[i].pointY}`);
            if (i < points.length - 1) {
                result = result.concat(' ');
            }
        }
        return result;
    }
}
