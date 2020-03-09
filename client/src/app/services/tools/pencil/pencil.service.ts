import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Pencil } from 'src/app/models/pencil';
import { Coordinate } from 'src/app/models/coordinate';

@Injectable({
    providedIn: 'root',
})
export class PencilService implements Tool {
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

    color: string;
    lastX: number;
    lastY: number;

    private path: Coordinate[] = [];

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    prepare() {
        this.color = this.state.colorState.firstColor.hex();

        this.state.canvasState.ctx.lineJoin = 'round';
        this.state.canvasState.ctx.lineCap = 'round';
        this.state.canvasState.ctx.lineWidth = this.state.globalState.thickness;
        this.state.canvasState.ctx.fillStyle = this.color;
        this.state.canvasState.ctx.strokeStyle = this.color;
    }

    handleKeyDown(key: string): void {}

    handleKeyUp(key: string): void {}

    start(event: MouseEvent) {
        this.prepare();
        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.arc(event.offsetX, event.offsetY, this.state.globalState.thickness / 2, 0, 2 * Math.PI);
        this.state.canvasState.ctx.closePath();
        this.state.canvasState.ctx.fill();
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.path.push(new Coordinate(this.lastX, this.lastY));

        this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);
    }

    continue(event: MouseEvent): void {
        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.moveTo(this.lastX, this.lastY);
        this.state.canvasState.ctx.lineTo(event.offsetX, event.offsetY);
        this.state.canvasState.ctx.closePath();
        this.state.canvasState.ctx.stroke();
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.path.push(new Coordinate(this.lastX, this.lastY));
    }

    stop() {
        this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.removeEventListener('mouseup', this.mouseUpListener);
        this.store.pushShape(this.createPencilElement(this.state.globalState.thickness, this.color, this.color, this.path));
    }

    createPencilElement(lineThickness: number, firstColor: string, secondColor: string, pencilPath: Coordinate[]): Pencil {
        let leftMostPoint = pencilPath[0].pointX;
        let rightMostPoint = pencilPath[0].pointX;
        let topMostPoint = pencilPath[0].pointY;
        let bottomMostPoint = pencilPath[0].pointY;

        for (const coordinate of pencilPath) {
            if (coordinate.pointX < leftMostPoint) {leftMostPoint = coordinate.pointX; }
            if (coordinate.pointX > rightMostPoint) {rightMostPoint = coordinate.pointX; }
            if (coordinate.pointY < topMostPoint) {topMostPoint = coordinate.pointY; }
            if (coordinate.pointY > bottomMostPoint) {bottomMostPoint = coordinate.pointY; }
        }

        const pencilElement: Pencil = {
            startSelectX: leftMostPoint,
            startSelectY: topMostPoint,
            endSelectX: rightMostPoint,
            endSelectY: bottomMostPoint,
            primaryColor: firstColor,
            secondaryColor: secondColor,
            thickness: lineThickness,
            path: pencilPath
        }

        return pencilElement;
    }

    drawFromPencilElement(pencil: Pencil): void {
        // Stroke style
        this.state.canvasState.ctx.lineJoin = 'round';
        this.state.canvasState.ctx.lineCap = 'round';
        this.state.globalState.thickness = pencil.thickness;
        this.state.canvasState.ctx.strokeStyle = pencil.primaryColor;
        this.state.canvasState.ctx.fillStyle = pencil.primaryColor;
        this.lastX = pencil.path[0].pointX;
        this.lastY = pencil.path[0].pointY;

        for (const coordinate of pencil.path) {
            this.state.canvasState.ctx.beginPath();
            this.state.canvasState.ctx.moveTo(this.lastX, this.lastY);
            this.state.canvasState.ctx.lineTo(coordinate.pointX, coordinate.pointY);
            this.state.canvasState.ctx.closePath();
            this.state.canvasState.ctx.stroke();
            this.lastX = coordinate.pointX;
            this.lastY = coordinate.pointY;
        }
    }
}
