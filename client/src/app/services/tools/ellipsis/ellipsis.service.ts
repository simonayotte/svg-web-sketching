import { Injectable } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Tool } from 'src/app/models/tool';

@Injectable({
    providedIn: 'root',
})
export class EllipsisService extends Tool {
    state: DrawState;

    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    isShift = false;
    isDrawing = false;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    start(event: MouseEvent) {
        this.startX = event.offsetX;
        this.startY = event.offsetY;
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        this.svg.setAttribute('cx', this.startX.toString());
        this.svg.setAttribute('cy', this.startY.toString());
        this.svg.setAttribute('stroke-width', this.state.globalState.thickness.toString());
        this.setColors(this.state.ellipsisType);
        this.state.svgState.drawSvg.appendChild(this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);

        this.isDrawing = true;
    }

    continue(event: MouseEvent) {
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.draw(this.startX, this.startY, this.lastX, this.lastY);
    }

    draw(startX: number, startY: number, lastX: number, lastY: number) {
        let dx = lastX - startX;
        let dy = lastY - startY;

        if (this.isShift) {
            if (Math.abs(dx) < Math.abs(dy)) {
                dy = dy * Math.abs(dx / dy);
            } else {
                dx = dx * Math.abs(dy / dx);
            }
        }
        let rx = Math.abs(dx) / 2;
        let ry = Math.abs(dy) / 2;

        let cx = this.startX + dx / 2;
        let cy = this.startY + dy / 2;

        this.svg.setAttribute('cx', cx.toString());
        this.svg.setAttribute('cy', cy.toString());

        this.svg.setAttribute('rx', rx.toString());

        this.svg.setAttribute('ry', ry.toString());
    }

    stop() {
        if (this.isDrawing) {
            this.store.pushSvg(this.svg);
            this.state.svgState.drawSvg.removeChild(this.svg);
            this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
            this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
            this.isDrawing = false;
        }

        this.stopSignal();
    }

    handleKeyDown(key: string) {
        if (key === 'Shift') {
            this.isShift = true;
            this.draw(this.startX, this.startY, this.lastX, this.lastY);
        }
    }
    handleKeyUp(key: string) {
        if (key === 'Shift') {
            this.isShift = false;
            if (this.isDrawing) {
                this.draw(this.startX, this.startY, this.lastX, this.lastY);
            }
        }
    }
    setColors(type: string) {
        switch (type) {
            case 'outline':
                this.svg.setAttribute('fill', 'transparent');
                this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());

                break;
            case 'outlineFill':
                this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
                this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());

                break;
            case 'fill':
                this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
                this.svg.setAttribute('stroke', 'transparent');
                break;
        }
    }
}
