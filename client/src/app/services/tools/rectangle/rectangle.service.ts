import { Injectable, RendererFactory2 } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
import { FormService } from '../form/form.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends FormService {
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    isShift: boolean;
    isSelection: boolean;

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super(store, rendererFactory);
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.isShift = false;
        this.isSelection = false;
    }

    start(event: MouseEvent): void {
        this.startX = event.offsetX;
        this.startY = event.offsetY;
        this.svg = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svg, 'x', this.startX.toString());
        this.renderer.setAttribute(this.svg, 'y', this.startY.toString());
        this.renderer.setAttribute(this.svg, 'stroke-width', this.state.globalState.thickness.toString());

        this.setColors(this.state.rectangleType);

        if (this.isSelection) {
            this.renderer.setAttribute(this.svg, 'stroke', `#${this.state.colorState.gridColor.colorHex()}`);
            this.renderer.setAttribute(this.svg, 'stroke-dasharray', '10');
            this.renderer.setAttribute(this.svg, 'stroke-width', '3');
            this.renderer.setAttribute(this.svg, 'fill', `#${this.state.colorState.firstColor.colorHex()}`);
            this.renderer.setAttribute(this.svg, 'fill-opacity', '0.2');
        }
        this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);

        this.isDrawing = true;
    }

    continue(event: MouseEvent): void {
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.draw(this.startX, this.startY, this.lastX, this.lastY);
    }

    drawSquare(dx: number, dy: number): void {
        if (dx < 0 && dy < 0) {
            this.renderer.setAttribute(this.svg, 'x', (this.startX + dx).toString());
            this.renderer.setAttribute(this.svg, 'y', (this.startY + dy).toString());
        } else if (dx > 0 && dy < 0) {
            this.renderer.setAttribute(this.svg, 'x', this.startX.toString());
            this.renderer.setAttribute(this.svg, 'y', (this.startY + dy).toString());
        } else if (dx < 0 && dy > 0) {
            this.renderer.setAttribute(this.svg, 'x', (this.startX + dx).toString());
            this.renderer.setAttribute(this.svg, 'y', this.startY.toString());
        } else {
            this.renderer.setAttribute(this.svg, 'x', this.startX.toString());
            this.renderer.setAttribute(this.svg, 'y', this.startY.toString());
        }
    }

    drawRect(dx: number, dy: number): void {
        if (dx < 0 && dy < 0) {
            this.renderer.setAttribute(this.svg, 'x', this.lastX.toString());
            this.renderer.setAttribute(this.svg, 'y', this.lastY.toString());
        } else if (dx > 0 && dy < 0) {
            this.renderer.setAttribute(this.svg, 'x', this.startX.toString());
            this.renderer.setAttribute(this.svg, 'y', this.lastY.toString());
        } else if (dx < 0 && dy > 0) {
            this.renderer.setAttribute(this.svg, 'x', this.lastX.toString());
            this.renderer.setAttribute(this.svg, 'y', this.startY.toString());
        } else {
            this.renderer.setAttribute(this.svg, 'x', this.startX.toString());
            this.renderer.setAttribute(this.svg, 'y', this.startY.toString());
        }
    }
    draw(startX: number, startY: number, lastX: number, lastY: number): void {
        let dx = lastX - startX;
        let dy = lastY - startY;
        // Length of square is equal to the smallest size (without changing sign)
        if (this.isShift) {
            if (Math.abs(dx) < Math.abs(dy)) {
                dy = dy * Math.abs(dx / dy);
            } else {
                dx = dx * Math.abs(dy / dx);
            }
            this.drawSquare(dx, dy);
        } else {
            this.drawRect(dx, dy);
        }

        this.renderer.setAttribute(this.svg, 'width', Math.abs(dx).toString());
        this.renderer.setAttribute(this.svg, 'height', Math.abs(dy).toString());
    }

    stop(): void {
        if (this.isDrawing) {
            if (!this.isSelection) {
                this.store.pushSvg(this.svg);
            }
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
            this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
            this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
            this.isDrawing = false;
        }

        this.stopSignal();
    }

    handleKeyDown(key: string): void {
        if (key === 'Shift') {
            this.isShift = true;
            this.draw(this.startX, this.startY, this.lastX, this.lastY);
        }
    }
    handleKeyUp(key: string): void {
        if (key === 'Shift') {
            this.isShift = false;
            if (this.isDrawing) {
                this.draw(this.startX, this.startY, this.lastX, this.lastY);
            }
        }
    }
}
