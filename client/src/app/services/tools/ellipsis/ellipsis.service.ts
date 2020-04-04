import { Injectable, RendererFactory2 } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
import { FormService } from '../form/form.service';

@Injectable({
    providedIn: 'root',
})
export class EllipsisService extends FormService {
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    isShift: boolean = false;

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super(store, rendererFactory);
        this.startX = this.startY = this.lastX = this.lastY = 0;
        this.isShift = false;
    }

    start(event: MouseEvent): void {
        this.startX = event.offsetX;
        this.startY = event.offsetY;
        this.svg = this.renderer.createElement('ellipse', 'svg');
        this.renderer.setAttribute(this.svg, 'cx', this.startX.toString());
        this.renderer.setAttribute(this.svg, 'cy', this.startY.toString());
        this.renderer.setAttribute(this.svg, 'stroke-width', this.state.globalState.thickness.toString());

        this.setColors(this.state.ellipsisType);
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
        }
        const rx = Math.abs(dx) / 2;
        const ry = Math.abs(dy) / 2;

        const cx = this.startX + dx / 2;
        const cy = this.startY + dy / 2;

        this.renderer.setAttribute(this.svg, 'cx', cx.toString());
        this.renderer.setAttribute(this.svg, 'cy', cy.toString());

        this.renderer.setAttribute(this.svg, 'rx', rx.toString());

        this.renderer.setAttribute(this.svg, 'ry', ry.toString());
    }

    stop(): void {
        if (this.isDrawing) {
            this.store.pushSvg(this.svg);
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
