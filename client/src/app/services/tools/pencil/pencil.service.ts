import { Injectable } from '@angular/core';
import { Tool } from 'src/app/classes/tool';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';

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
    }

    stop() {
        this.state.canvasState.canvas.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.canvasState.canvas.removeEventListener('mouseup', this.mouseUpListener);
    }
}
