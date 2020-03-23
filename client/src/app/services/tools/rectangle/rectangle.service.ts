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
    currentMouseX: number;
    currentMouseY: number;
    isDrawing: boolean = false;
    rectangleType: string;
    thickness: number;

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
        this.state.svgState.drawSvg.appendChild(this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.isDrawing = true;
    }

    continue(event: MouseEvent): void {
        this.draw(event.offsetX, event.offsetY);
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
            this.draw(this.currentMouseX, this.currentMouseY);
        }
    }
    
    handleKeyUp(key: string) {
        if (key === 'Shift') {
            this.isShiftDown = false;
            this.draw(this.currentMouseX, this.currentMouseY);
        }
    }

    draw (mouseX: number, mouseY: number): void {
        this.currentMouseX = mouseX;
        this.currentMouseY = mouseY;
        this.thickness = this.state.globalState.thickness;
        this.setRectangleDisplay(this.state.rectangleType);
        this.adjustStartPosition(mouseX, mouseY);
        this.drawRect(this.currentStartX, this.currentStartY, this.currentWidth, this.currentHeight);
    }

    drawRect(startX: number, startY: number, width: number, height: number): void {
        this.svg.setAttributeNS(null, 'x', startX.toString());
        this.svg.setAttributeNS(null, 'y', startY.toString());
        this.svg.setAttributeNS(null, 'height', height.toString());
        this.svg.setAttributeNS(null, 'width', width.toString());
    }

    adjustStartPosition(mousePositionX: number, mousePositionY: number): void {
        if (this.thickness >= Math.abs(this.initialX - mousePositionX) || this.thickness >= Math.abs(this.initialY - mousePositionY)) {
            this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
            this.svg.setAttribute('stroke', 'transparent');
            this.thickness = 0;
            this.currentStartX = this.initialX;
            this.currentStartY = this.initialY;
            this.currentWidth = mousePositionX - this.initialX - this.thickness;
            this.currentHeight = mousePositionY - this.initialY - this.thickness;
            if (this.isShiftDown) {
                if (Math.abs(this.currentWidth) < Math.abs(this.currentHeight)) {
                    if ((this.currentWidth <= 0 && this.currentHeight >= 0) || (this.currentWidth >= 0 && this.currentHeight <= 0)) {
                        // XOR for 1st and 3d quadrants
                        this.currentHeight = -this.currentWidth;
                    } else {
                        this.currentHeight = this.currentWidth;
                    }
                } else {
                    if ((this.currentWidth <= 0 && this.currentHeight >= 0) || (this.currentWidth >= 0 && this.currentHeight <= 0)) {
                        // XOR for 2nd and 4th quadrants
                        this.currentWidth = -this.currentHeight;
                    } else {
                        this.currentWidth = this.currentHeight;
                    }
                }
            }
            this.adjustWidthAndHeight();
        } else { 
            this.currentStartX =
                mousePositionX > this.initialX
                    ? this.initialX + this.thickness / 2
                    : this.initialX - this.thickness / 2;
            this.currentStartY =
                mousePositionY > this.initialY
                    ? this.initialY + this.thickness / 2
                    : this.initialY - this.thickness / 2;
            this.currentWidth = mousePositionX - this.initialX;
            this.currentHeight = mousePositionY - this.initialY;
            this.currentWidth += this.thickness < this.currentWidth ? -this.thickness : this.thickness;
            this.currentHeight += this.thickness < this.currentHeight ? -this.thickness : this.thickness;
            if (this.isShiftDown) {
                if (Math.abs(this.currentWidth) < Math.abs(this.currentHeight)) {
                    if ((this.currentWidth <= 0 && this.currentHeight >= 0) || (this.currentWidth >= 0 && this.currentHeight <= 0)) {
                        // XOR for 1st and 3d quadrants
                        this.currentHeight = -this.currentWidth;
                    } else {
                        this.currentHeight = this.currentWidth;
                    }
                } else {
                    if ((this.currentWidth <= 0 && this.currentHeight >= 0) || (this.currentWidth >= 0 && this.currentHeight <= 0)) {
                        // XOR for 2nd and 4th quadrants
                        this.currentWidth = -this.currentHeight;
                    } else {
                        this.currentWidth = this.currentHeight;
                    }
                }
            }
            this.adjustWidthAndHeight();
        }
    }

    adjustWidthAndHeight(): void {
        if (this.currentWidth < 0) {
            this.currentStartX = this.currentStartX + this.currentWidth;
            this.currentWidth = Math.abs(this.currentWidth);
        }
        if (this.currentHeight < 0) {
            this.currentStartY = this.currentStartY + this.currentHeight;
            this.currentHeight = Math.abs(this.currentHeight);
        }
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
                this.thickness = 0;
                this.rectangleType = 'fill only';
                break;
        }
    }
}
