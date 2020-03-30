import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Tool } from 'src/app/models/tool';
import { Color } from 'src/app/models/color';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    state: DrawState;
    ctx: CanvasRenderingContext2D;

    renderer: Renderer2;
    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(event: MouseEvent) {
        this.ctx = this.createCanvasWithSvgs(this.state.svgState.width, this.state.svgState.height);
        this.drawSvgInCanvas(this.state.svgState.drawSvg, event);
    }

    //Create canvas from current draw width and height
    createCanvasWithSvgs(width: number, height: number): CanvasRenderingContext2D {
        let canvas = this.renderer.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        return ctx;
    }

    //Draw all svg in created canvas
    //Source: https://stackoverflow.com/questions/3768565/drawing-an-svg-file-on-a-html5-canvas
    drawSvgInCanvas(svg: SVGSVGElement, event: MouseEvent) {
        let img = new Image();
        var xml = new XMLSerializer().serializeToString(svg);

        var svg64 = btoa(xml);
        var b64Start = 'data:image/svg+xml;base64,';

        var image64 = b64Start + svg64;

        img.onload = () => {
            if (this.ctx) {
                this.ctx.drawImage(img, 0, 0);
                this.setColor(this.ctx, event.offsetX, event.offsetY, event.button);
            }
        };

        img.src = image64;
    }

    setColor(ctx: CanvasRenderingContext2D, x: number, y: number, button: number) {
        const data: Uint8ClampedArray = ctx.getImageData(x, y, 1, 1).data;
        if (button === 0) {
            this.store.setFirstColor(new Color(data[0], data[1], data[2], data[3]));
        } else if (button === 2) {
            this.store.setSecondColor(new Color(data[0], data[1], data[2], data[3]));
        }
    }
}
