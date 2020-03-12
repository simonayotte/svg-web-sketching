import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';

@Injectable({
    providedIn: 'root',
})
export class EllipsisService implements Tool {
    state: DrawState;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    isShiftDown: boolean = false;

    private firstColor: string;
    private secondColor: string;

    private canvasImage: ImageData;

    startX: number;
    startY: number;

    endX: number;
    endY: number;
    constructor(private store: DrawStore) {
        // Bind this to event listeners
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;

            if (this.state.canvasState.canvas) {
                this.prepare();
            }
        });
    }

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

    stop() {
        this.canvasImage = this.state.canvasState.ctx.getImageData(0, 0, this.state.canvasState.width, this.state.canvasState.height);

        this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.removeEventListener('mouseup', this.mouseUpListener);
    }

    continueSignal() {}
    stopSignal() {}
    handleKeyDown(key: string) {}
    handleKeyUp(key: string) {}
}
