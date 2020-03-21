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

    constructor(private store: DrawStore) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
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

    stop(): SVGElement {
        this.state.svgState.drawSvg.removeChild(this.svg);
        return this.svg;
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
            this.draw(this.startX, this.startY, this.lastX, this.lastY);
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

/**import { Injectable } from '@angular/core';
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
 */
