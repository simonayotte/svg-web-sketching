import { Injectable, RendererFactory2 } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
import { FormService } from '../form/form.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends FormService {
    startX: number = 0;
    startY: number = 0;
    lastX: number = 0;
    lastY: number = 0;
    isShift = false;

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super(store, rendererFactory);
    }

    start(event: MouseEvent) {
        this.startX = event.offsetX;
        this.startY = event.offsetY;
        this.svg = this.renderer.createElement('rect', 'svg');
        this.renderer.setAttribute(this.svg, 'x', this.startX.toString());
        this.renderer.setAttribute(this.svg, 'y', this.startY.toString());
        this.renderer.setAttribute(this.svg, 'stroke-width', this.state.globalState.thickness.toString());

        this.setColors(this.state.rectangleType);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);

        this.isDrawing = true;
    }

    continue(event: MouseEvent) {
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.draw(this.startX, this.startY, this.lastX, this.lastY);
    }

    drawSquare(dx: number, dy: number) {
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

    drawRect(dx: number, dy: number) {
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
    draw(startX: number, startY: number, lastX: number, lastY: number) {
        let dx = lastX - startX;
        let dy = lastY - startY;
        //Length of square is equal to the smallest size (without changing sign)
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

    stop() {
        if (this.isDrawing) {
            this.store.pushSvg(this.svg);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
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
}
