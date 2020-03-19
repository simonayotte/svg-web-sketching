import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Coordinate } from 'src/app/models/coordinate';
import { Pencil } from 'src/app/models/pencil';
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool<Pencil> {
    state: DrawState;
    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
            if (value.canvasState.canvas) {
                this.setup({
                    ...this.element,
                    primaryColor: value.colorState.firstColor.hex(),
                    thickness: value.globalState.thickness,
                });
            }
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    isDrawing = false;
    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    start(event: MouseEvent) {
        this.element = {
            ...this.element,
            startSelectX: event.offsetX - this.state.globalState.thickness,
            startSelectY: event.offsetY - this.state.globalState.thickness,
            endSelectX: event.offsetX + this.state.globalState.thickness,
            endSelectY: event.offsetY + this.state.globalState.thickness,
            primaryColor: this.state.colorState.firstColor.hex(),
            secondaryColor: this.state.colorState.secondColor.hex(),
            thickness: this.state.globalState.thickness,
            path: [new Coordinate(event.offsetX, event.offsetY)],
        };

        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.arc(event.offsetX, event.offsetY, this.element.thickness / 2, 0, 2 * Math.PI);
        this.state.canvasState.ctx.closePath();
        this.state.canvasState.ctx.fill();

        this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);

        this.isDrawing = true;
    }

    continue(event: MouseEvent): void {
        this.element = {
            ...this.element,
            path: this.element.path.concat(new Coordinate(event.offsetX, event.offsetY)),
            startSelectX: event.offsetX < this.element.startSelectX ? event.offsetX : this.element.startSelectX,
            startSelectY: event.offsetY < this.element.startSelectY ? event.offsetY : this.element.startSelectY,
            endSelectX: event.offsetX > this.element.endSelectX ? event.offsetX : this.element.endSelectX,
            endSelectY: event.offsetY > this.element.endSelectY ? event.offsetY : this.element.endSelectY,
        };
        this.draw(this.element);
    }

    setup(element: Pencil) {
        if (!element) {
            return;
        }
        this.state.canvasState.ctx.lineJoin = 'round';
        this.state.canvasState.ctx.lineCap = 'round';
        this.state.canvasState.ctx.lineWidth = element.thickness;

        this.state.canvasState.ctx.fillStyle = element.primaryColor;
        this.state.canvasState.ctx.strokeStyle = element.primaryColor;
    }

    draw(element: Pencil) {
        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.moveTo(element.path[element.path.length - 2].pointX, element.path[element.path.length - 2].pointY);
        this.state.canvasState.ctx.lineTo(element.path[element.path.length - 1].pointX, element.path[element.path.length - 1].pointY);
        this.state.canvasState.ctx.closePath();
        this.state.canvasState.ctx.stroke();
    }

    stop() {
        this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);

        this.state.canvasState.canvas.removeEventListener('mouseup', this.mouseUpListener);

        if (this.isDrawing) {
            this.store.pushShape(this.element);
            this.isDrawing = false;
        }

        this.stopSignal();
    }

    drawFromPencilElement(pencil: Pencil): void {
        // Stroke style
        this.setup(pencil);
        for (let i = 0; i < pencil.path.length - 1; i++) {
            this.state.canvasState.ctx.beginPath();
            this.state.canvasState.ctx.moveTo(pencil.path[i].pointX, pencil.path[i].pointY);
            this.state.canvasState.ctx.lineTo(pencil.path[i + 1].pointX, pencil.path[i + 1].pointY);
            this.state.canvasState.ctx.closePath();
            this.state.canvasState.ctx.stroke();
        }
    }
}
