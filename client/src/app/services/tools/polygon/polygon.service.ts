import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Polygon } from 'src/app/models/polygon';
import { Coordinate } from 'src/app/models/coordinate';

@Injectable({
    providedIn: 'root',
})
export class PolygonService implements Tool {
    state: DrawState;
    constructor(private store: DrawStore) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
            if (this.state.canvasState.canvas) {
                this.prepare();
            }
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    private firstColor: string;
    private secondColor: string;

    canvasImage: ImageData;

    startX: number;
    startY: number;

    size: number;

    points: Coordinate[] = [];
    prepare() {
        this.firstColor = this.state.colorState.firstColor.hex();
        this.secondColor = this.state.colorState.secondColor.hex();
        this.state.canvasState.ctx.lineWidth = this.state.globalState.thickness;
        this.state.canvasState.ctx.lineJoin = 'miter';
        this.state.canvasState.ctx.lineCap = 'square';

        switch (this.state.polygonType) {
            case 'outline':
                this.state.canvasState.ctx.strokeStyle = this.secondColor;
                break;
            case 'outlineFill':
                this.state.canvasState.ctx.fillStyle = this.firstColor;
                this.state.canvasState.ctx.strokeStyle = this.secondColor;
                break;
            case 'fill':
                this.state.canvasState.ctx.fillStyle = this.firstColor;
                break;
        }
    }
    start(event: MouseEvent) {
        this.prepare();
        this.startX = event.offsetX;
        this.startY = event.offsetY;
        this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);
        this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
    }
    continue(event: MouseEvent) {
        this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
        this.state.canvasState.ctx.putImageData(this.canvasImage, 0, 0);
        this.size = (Math.abs(this.startX - event.offsetX) + Math.abs(this.startY - event.offsetY)) / 2;
        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.moveTo(this.startX, this.startY - this.size);
        this.points.push(new Coordinate(this.startX, this.startY - this.size));

        for (let i: number = 0; i < this.state.polygonSides - 1; i++) {
            let angle = ((360 / this.state.polygonSides) * (i + 1) + 90) * (Math.PI / 180);
            let nextX = this.startX + this.size * Math.cos(angle);
            let nextY = this.startY - this.size * Math.sin(angle);

            this.state.canvasState.ctx.lineTo(nextX, nextY);
            this.points.push(new Coordinate(nextX, nextY));
        }
        this.state.canvasState.ctx.closePath();

        this.addColors(this.state.polygonType);

        this.continueSignal();
    }

    addColors(type: string) {
        switch (type) {
            case 'outline':
                this.state.canvasState.ctx.stroke();
                break;
            case 'outlineFill':
                this.state.canvasState.ctx.fill();
                this.state.canvasState.ctx.stroke();
                break;
            case 'fill':
                this.state.canvasState.ctx.fill();
                break;
        }
    }
    continueSignal() {}

    stop() {
        this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);

        this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.removeEventListener('mouseup', this.mouseUpListener);

        const polygonElement: Polygon = {
            sides: this.state.polygonSides,
            points: this.points,
            type: this.state.polygonType,
            startSelectX: this.startX - this.size,
            startSelectY: this.startY - this.size,
            endSelectX: this.startX + this.size,
            endSelectY: this.startY + this.size,
            primaryColor: this.firstColor,
            secondaryColor: this.secondColor,
            thickness: this.state.globalState.thickness,
        };
        this.store.pushShape(polygonElement);
        this.stopSignal();
    }
    stopSignal() {}
    handleKeyDown(key: string) {}
    handleKeyUp(key: string) {}
}
