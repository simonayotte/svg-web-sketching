import { Injectable, RendererFactory2 } from '@angular/core';
import { DrawStore } from '../../../store/draw-store';
import { PencilService } from '../pencil/pencil.service';
@Injectable({
    providedIn: 'root',
})
export class BrushService extends PencilService {
    textureMap: Map<string, string> = new Map();

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super(store, rendererFactory);
    }

    start(event: MouseEvent) {
        let x = event.offsetX;
        let y = event.offsetY;
        let thickness = this.state.globalState.thickness;

        this.drawCircle(x, y, thickness / 2);

        this.svg = this.renderer.createElement('path', 'svg');
        if (this.state.brushTexture === 'normal') {
            this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.firstColor.hex());
        } else {
            this.renderer.setAttribute(this.svg, 'stroke', `url(#${this.state.brushTexture})`);
            this.renderer.setAttribute(this.circle, 'fill', `url(#${this.state.brushTexture})`);
        }
        this.renderer.setAttribute(this.svg, 'fill', 'none');
        this.renderer.setAttribute(this.svg, 'stroke-width', this.state.globalState.thickness.toString());
        this.renderer.setAttribute(this.svg, 'stroke-linecap', 'round');
        this.renderer.setAttribute(this.svg, 'stroke-linejoin', 'round');
        this.path = `M ${x} ${y} `;
        this.renderer.setAttribute(this.svg, 'd', this.path);
        this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.isDrawing = true;
    }
}
