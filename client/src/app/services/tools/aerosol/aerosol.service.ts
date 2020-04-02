import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Coordinate } from 'src/app/models/coordinate';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    state: DrawState;
    renderer: Renderer2;
    path = '';
    isDrawing = false;
    //Emission
    //Constant emissionPeriod for getting rid of lag
    emissionPeriod = 0;
    sprayIntervalID: any; //Pour acceder au setInterval du spray pattern

    //Mouse position
    x: number;
    y: number;

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
        //Update current mouse position
        this.x = event.offsetX;
        this.y = event.offsetY;

        //Styling for SVG
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

        //Function in interval for calling
        //Interval se fait a chaque 50 pour eviter le lag
        this.sprayIntervalID = setInterval(() => this.spray(), this.emissionPeriod);

        this.isDrawing = true;
    }

    continue(event: MouseEvent) {
        //Update current mouse position
        this.x = event.offsetX;
        this.y = event.offsetY;
    }

    stop() {
        clearInterval(this.sprayIntervalID);

        if (this.isDrawing) {
            this.store.pushSvg(this.svg);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
            this.isDrawing = false;
        }
        this.stopSignal();
    }

    //Returns random point inside the circle
    generateRandomPoint(x: number, y: number): Coordinate {
        let angle = Math.random() * Math.PI * 2;
        let r = Math.random() * Math.pow(this.state.globalState.thickness / 2, 2);
        let pointX = x + Math.sqrt(r) * Math.cos(angle);
        let pointY = y + Math.sqrt(r) * Math.sin(angle);
        return new Coordinate(pointX, pointY);
    }

    //Adds a random point inside the SVG path, genere une emission
    generateRandomSprayPoint(x: number, y: number) {
        let density = this.convertEmissionRate();
        for (var i = 0; i < density; i++) {
            let point = this.generateRandomPoint(x, y);
            //Move to new point and show pixel
            this.path = this.path.concat(`M ${point.pointX} ${point.pointY} h 1`);
            this.renderer.setAttribute(this.svg, 'd', this.path);
        }
    }

    //Conversion of emissionRate/sec in emissionRate per 50ms
    convertEmissionRate(): number {
        return ((this.state.emissionRate * 0.05) / 1000) * 10000;
    }

    //Function for calling in setInterval, sprays with correct emissionRate
    spray() {
        this.generateRandomSprayPoint(this.x, this.y);
    }
}
