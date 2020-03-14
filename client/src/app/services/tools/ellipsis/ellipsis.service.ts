import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Ellipsis } from 'src/app/models/ellipsis';

@Injectable({
    providedIn: 'root',
})
export class EllipsisService extends Tool<Ellipsis> {
    state: DrawState;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    canvasImage: ImageData;

    isDrawing = false;

    constructor(private store: DrawStore) {
        super();
        // Bind this to event listeners
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }

    handleKeyDown(key: string) {
        if (key === 'Shift') {
            this.element = { ...this.element, isCircle: true };

            this.draw(this.element);
        }
    }
    handleKeyUp(key: string) {
        if (key === 'Shift') {
            this.element = { ...this.element, isCircle: false };
            if (this.isDrawing) {
                this.draw(this.element);
            }
        }
    }

    setup(element: Ellipsis) {
        this.state.canvasState.ctx.lineJoin = 'round';
        this.state.canvasState.ctx.lineCap = 'round';
        this.state.canvasState.ctx.lineWidth = element.thickness;

        switch (element.type) {
            case 'outline':
                this.state.canvasState.ctx.strokeStyle = element.secondaryColor;
                break;
            case 'outlineFill':
                this.state.canvasState.ctx.fillStyle = element.primaryColor;
                this.state.canvasState.ctx.strokeStyle = element.secondaryColor;
                break;
            case 'fill':
                this.state.canvasState.ctx.fillStyle = element.primaryColor;
                break;
        }
    }

    start(event: MouseEvent) {
        this.element = {
            ...this.element,
            startSelectX: event.offsetX,
            startSelectY: event.offsetY,
            primaryColor: this.state.colorState.firstColor.hex(),
            secondaryColor: this.state.colorState.secondColor.hex(),
            thickness: this.state.globalState.thickness,
            type: this.state.ellipsisType,
        };
        this.setup(this.element);

        this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);
        this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
    }
    continue(event: MouseEvent) {
        this.isDrawing = true;

        this.element = {
            ...this.element,
            endSelectX: event.offsetX,
            endSelectY: event.offsetY,
        };

        this.draw(this.element);
    }
    draw(element: Ellipsis) {
        this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
        this.state.canvasState.ctx.putImageData(this.canvasImage, 0, 0);

        let dX = element.endSelectX - element.startSelectX;
        let dY = element.endSelectY - element.startSelectY;
        if (element.isCircle) {
            if (Math.abs(dX) < Math.abs(dY)) {
                dY = dY * Math.abs(dX / dY);
            } else {
                dX = dX * Math.abs(dY / dX);
            }
        }
        let centerX = element.startSelectX + dX / 2;
        let centerY = element.startSelectY + dY / 2;

        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.ellipse(centerX, centerY, Math.abs(dX / 2), Math.abs(dY / 2), 0, 0, Math.PI * 2);
        this.addColors(element.type);
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

    stop() {
        this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);

        this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.removeEventListener('mouseup', this.mouseUpListener);

        if (this.isDrawing) {
            this.store.pushShape(this.element);
            this.isDrawing = false;
        }
        this.stopSignal();
    }

    drawFromPolygonElement(element: Ellipsis): void {
        this.setup(element);
        this.draw(element);
    }
}
