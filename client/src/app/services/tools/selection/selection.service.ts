import { Injectable, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { RectangleService } from '../rectangle/rectangle.service';
import { Tools } from 'src/app/models/enums';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    rectangle: RectangleService;
    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            if (this.state.globalState.tool === Tools.Selection && value.globalState.tool !== Tools.Selection) {
                this.state.selectionBox.svgs = [];
            }
            this.state = value;
        });
        this.rectangle = new RectangleService(store, rendererFactory);
        this.rectangle.isSelection = true;
        this.renderer = rendererFactory.createRenderer(null, null);
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    start(event: MouseEvent): void {
        let svg = <SVGGraphicsElement>event.target;

        if (event.button === 0 && this.state.svgState.svgs.includes(svg)) {
            this.store.selectSvg(svg);
        } else {
            this.store.clearSelection();
        }

        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.rectangle.start(event);
    }

    continue(): void {
        for (let svg of this.state.svgState.svgs) {
            this.selectSvg(svg);
        }
    }

    stop(): void {
        if (this.rectangle.isDrawing) {
            this.renderer.removeChild(this.state.svgState.drawSvg, this.rectangle.svg);
        }
        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
    }

    selectSvg(svg: SVGGraphicsElement): void {
        let thickness = parseInt(<string>svg.getAttribute('stroke-width')) / 2;
        let svgRect = svg.getBBox();
        let selectRect = this.rectangle.svg.getBBox();

        const selectLeft = selectRect.x;
        const selectRight = selectRect.x + selectRect.width;
        const selectTop = selectRect.y;
        const selectBottom = selectRect.y + selectRect.height;

        const svgLeft = svgRect.x + thickness;
        const svgRight = svgRect.x + svgRect.width - thickness;
        const svgTop = svgRect.y + thickness;
        const svgBottom = svgRect.y + svgRect.height - thickness;

        if (
            svgTop + svgRect.height > selectTop &&
            svgLeft + svgRect.width > selectLeft &&
            svgBottom - svgRect.height < selectBottom &&
            svgRight - svgRect.width < selectRight
        ) {
            if (!this.state.selectionBox.svgs.includes(svg)) {
                this.store.pushSelectedSvg(svg);
            }
        } else {
            this.store.deselectSvg(svg);
        }
    }
}
