import { Injectable, RendererFactory2 } from '@angular/core';
import { Coordinate } from 'src/app/models/coordinate';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    path: string;
    isDrawing: boolean;
    readonly EMISSION_PERIOD: number = 0;
    sprayIntervalID: NodeJS.Timer;

    // Mouse position
    x: number;
    y: number;

    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.path = '';
        this.isDrawing = false;

        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(event: MouseEvent): void {
        // Update current mouse position
        this.x = event.offsetX;
        this.y = event.offsetY;

        // Styling for SVG
        this.svg = this.renderer.createElement('path', 'svg');
        this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.firstColor.hex());
        this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
        this.renderer.setAttribute(this.svg, 'stroke-width', '1');
        this.renderer.setAttribute(this.svg, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.svg, 'stroke-linejoin', 'round');
        this.path = `M ${this.x} ${this.y} `;
        this.renderer.setAttribute(this.svg, 'd', this.path);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);

        // Function in interval for calling
        this.sprayIntervalID = setInterval(() => this.spray(), this.EMISSION_PERIOD);

        this.isDrawing = true;
    }

    continue(event: MouseEvent): void {
        // Update current mouse position
        this.x = event.offsetX;
        this.y = event.offsetY;
    }

    stop(): void {
        clearInterval(this.sprayIntervalID);

        if (this.isDrawing) {
            this.store.pushSvg(this.svg);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
            this.isDrawing = false;
        }
        this.stopSignal();
    }

    generateRandomPoint(x: number, y: number): Coordinate {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * Math.pow(this.state.globalState.thickness / 2, 2);
        const pointX = x + Math.sqrt(r) * Math.cos(angle);
        const pointY = y + Math.sqrt(r) * Math.sin(angle);
        return new Coordinate(pointX, pointY);
    }

    generateRandomSpray(x: number, y: number): void {
        const density = this.convertEmissionRate();
        for (let i = 0; i < density; i++) {
            const point = this.generateRandomPoint(x, y);
            // Move to new point and show pixel
            this.path = this.path.concat(`M ${point.pointX} ${point.pointY} h 1`);
            this.renderer.setAttribute(this.svg, 'd', this.path);
        }
    }

    convertEmissionRate(): number {
        const emissionCoefficient = 0.05;
        const totalMS = 1000;
        const multiplier = 10000;
        return ((this.state.emissionRate * emissionCoefficient) / totalMS) * multiplier;
    }

    // Wrapper function for callback in setInterval
    spray(): void {
        this.generateRandomSpray(this.x, this.y);
    }
}
