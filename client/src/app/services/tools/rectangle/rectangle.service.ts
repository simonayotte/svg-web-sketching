import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    state: DrawState;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;

    isShiftDown: boolean = false;

    initialX: number;
    initialY: number;
    currentStartX: number;
    currentStartY: number;
    currentHeight: number;
    currentWidth: number;
    isDrawing: boolean = false;
    rectangleType: string;

    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    start(event: MouseEvent) {
        this.initialX = event.offsetX;
        this.initialY = event.offsetY;
        this.currentStartX = this.initialX;
        this.currentStartY = this.initialY;

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.svg.setAttribute('stroke-width', this.state.globalState.thickness.toString());
        this.setRectangleDisplay(this.state.rectangleType);
        this.state.svgState.drawSvg.appendChild(this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.isDrawing = true;
    }

    continue(event: MouseEvent): void {
        if ( event.offsetX < this.initialX ) {
            this.currentStartX = event.offsetX;
            this.currentWidth = this.initialX - event.offsetX;
        } else {
            this.currentWidth = event.offsetX - this.initialX;
        }
        if ( event.offsetY < this.initialY ) {
            this.currentStartY = event.offsetY;
            this.currentHeight = this.initialY - event.offsetY;
        } else {
            this.currentHeight = event.offsetY - this.initialY;
        }
        // if (this.)
        this.drawRect(this.currentStartX, this.currentStartY, this.currentWidth, this.currentHeight);
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
            this.isShiftDown = true;
            //this.drawRect(this.currentStartX, this.currentStartY, this.currentWidth, this.currentHeight);
        }
    }
    handleKeyUp(key: string) {
        if (key === 'Shift') {
            this.isShiftDown = false;
        }
    }

    drawRect(startX: number, startY: number, width: number, height: number): void {
        this.svg.setAttributeNS(null, 'x', startX.toString());
        this.svg.setAttributeNS(null, 'y', startY.toString());
        this.svg.setAttributeNS(null, 'height', height.toString());
        this.svg.setAttributeNS(null, 'width', width.toString());
    }

    setRectangleDisplay(rectangleType: string): void {
        switch (rectangleType) {
            case 'outline only':
                this.svg.setAttribute('fill', 'transparent');
                this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());
                this.rectangleType = 'outline only';
                break;
            case 'outline and fill':
                this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
                this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());
                this.rectangleType = 'outline and fill';
                break;
            case 'fill only':
                this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
                this.svg.setAttribute('stroke', 'transparent');
                this.rectangleType = 'fill only';
                break;
        }
    }
}
