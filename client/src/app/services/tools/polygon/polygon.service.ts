import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
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

    renderer: Renderer2;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
        this.renderer = rendererFactory.createRenderer(null, null);
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
                this.renderer.setAttribute(this.svg, 'fill', 'transparent');
                this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.secondColor.hex());

                break;
            case 'outlineFill':
                this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
                this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.secondColor.hex());

                break;
            case 'fill':
                this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
                this.renderer.setAttribute(this.svg, 'stroke', 'transparent');
                break;
        }
    }
}
