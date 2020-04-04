import { Injectable, RendererFactory2 } from '@angular/core';
import { Coordinate } from 'src/app/models/coordinate';
import { DrawStore } from 'src/app/store/draw-store';
import { FormService } from '../form/form.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends FormService {
    centerX = 0;
    centerY = 0;

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super(store, rendererFactory);
    }

    start(event: MouseEvent) {
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

    continue(event: MouseEvent) {
        const size = (Math.abs(this.centerX - event.offsetX) + Math.abs(this.centerY - event.offsetY)) / 2;
        this.draw(this.centerX, this.centerY, this.state.polygonSides, size);
    }

    draw(centerX: number, centerY: number, sides: number, size: number) {
        const points: Coordinate[] = [];
        // Divide 360 deg by n sides and get points with angle and polygon size
        for (let i = 0; i < sides; i++) {
            const angle = ((360 / sides) * (i + 1) + 90) * (Math.PI / 180);
            const pointX = centerX + size * Math.cos(angle);
            const pointY = centerY - size * Math.sin(angle);
            points.push(new Coordinate(pointX, pointY));
        }
        this.renderer.setAttribute(this.svg, 'points', this.pointsToString(points));
    }
    stop() {
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
