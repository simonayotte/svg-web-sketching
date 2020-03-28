import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Tool } from 'src/app/models/tool';
import { Types } from 'src/app/models/enums';

@Injectable({
    providedIn: 'root',
})
export class EllipsisService extends Tool {
    state: DrawState;
    startX: number = 0;
    startY: number = 0;
    lastX: number = 0;
    lastY: number = 0;
    isShift = false;
    isDrawing = false;

    renderer: Renderer2;

    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(event: MouseEvent) {
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

    continue(event: MouseEvent) {
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.draw(this.startX, this.startY, this.lastX, this.lastY);
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
        }
        let rx = Math.abs(dx) / 2;
        let ry = Math.abs(dy) / 2;

        let cx = this.startX + dx / 2;
        let cy = this.startY + dy / 2;

        this.renderer.setAttribute(this.svg, 'cx', cx.toString());
        this.renderer.setAttribute(this.svg, 'cy', cy.toString());

        this.renderer.setAttribute(this.svg, 'rx', rx.toString());

        this.renderer.setAttribute(this.svg, 'ry', ry.toString());
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
    setColors(type: Types) {
        switch (type) {
            case Types.Outline:
                this.renderer.setAttribute(this.svg, 'fill', 'none');
                this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.secondColor.hex());

                break;
            case Types.OutlineFill:
                this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
                this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.secondColor.hex());

                break;
            case Types.Fill:
                this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
                this.renderer.setAttribute(this.svg, 'stroke', 'none');
                break;
        }
    }
}
