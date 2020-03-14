import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Polygon } from 'src/app/models/Polygon';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends Tool<Polygon> {
    state: DrawState;
    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    canvasImage: ImageData;
    isDrawing = false;

    setup(element: Polygon) {
        this.state.canvasState.ctx.lineWidth = element.thickness;
        this.state.canvasState.ctx.lineJoin = 'miter';
        this.state.canvasState.ctx.lineCap = 'square';

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
            centerX: event.offsetX,
            centerY: event.offsetY,
            primaryColor: this.state.colorState.firstColor.hex(),
            secondaryColor: this.state.colorState.secondColor.hex(),
            thickness: this.state.globalState.thickness,
            type: this.state.polygonType,
            sides: this.state.polygonSides,
        };
        this.setup(this.element);

        this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);
        this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);
    }

    draw(element: Polygon) {
        this.state.canvasState.ctx.clearRect(0, 0, this.state.canvasState.width, this.state.canvasState.height);
        this.state.canvasState.ctx.putImageData(this.canvasImage, 0, 0);

        this.state.canvasState.ctx.beginPath();
        this.state.canvasState.ctx.moveTo(element.centerX, element.centerY - element.size);

        for (let i: number = 0; i < element.sides - 1; i++) {
            let angle = ((360 / element.sides) * (i + 1) + 90) * (Math.PI / 180);
            let nextX = element.centerX + element.size * Math.cos(angle);
            let nextY = element.centerY - element.size * Math.sin(angle);

            this.state.canvasState.ctx.lineTo(nextX, nextY);
        }
        this.state.canvasState.ctx.closePath();

        this.addColors(element.type);
    }
    continue(event: MouseEvent) {
        this.element = {
            ...this.element,
            size: (Math.abs(this.element.centerX - event.offsetX) + Math.abs(this.element.centerY - event.offsetY)) / 2,
        };

        this.isDrawing = true;

        this.draw(this.element);
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
            this.element = {
                ...this.element,
                startSelectX: this.element.centerX - this.element.size,
                startSelectY: this.element.centerY - this.element.size,
                endSelectX: this.element.centerX + this.element.size,
                endSelectY: this.element.centerY + this.element.size,
            };
            this.store.pushShape(this.element);
            this.isDrawing = false;
        }
        this.stopSignal();
    }

    drawFromPolygonElement(element: Polygon): void {
        this.setup(element);
        this.draw(element);
    }
}
