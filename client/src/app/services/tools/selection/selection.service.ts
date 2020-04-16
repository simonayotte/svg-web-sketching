import { Injectable, RendererFactory2 } from '@angular/core';
import { SelectionButtons, Tools } from 'src/app/models/enums';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { RectangleService } from '../rectangle/rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    rectangle: RectangleService;

    isCtrl: boolean;
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
        this.isCtrl = false;
        this.renderer = rendererFactory.createRenderer(null, null);
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
    }

    start(event: MouseEvent): void {
        const svg = event.target as SVGGraphicsElement;

        if (event.button === 2) {
            this.state.selectionBox.svgs = [];
        } else {
            if (this.state.svgState.svgs.includes(svg)) {
                this.state.selectionBox.svgs = [svg];
            } else if (!this.state.selectionBox.isMoving) {
                // Not clicked on selection svg
                this.state.selectionBox.svgs = [];
            }
        }

        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        if (!this.state.selectionBox.isMoving) {
            this.rectangle.start(event);
        }
    }

    continue(): void {
        if (!this.state.selectionBox.isMoving) {
            for (const svg of this.state.svgState.svgs) {
                const selectRect = this.rectangle.svg.getBoundingClientRect() as DOMRect;
                this.selectSvg(svg, selectRect);
            }
        }
    }

    stop(): void {
        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
        this.stopSignal();
    }

    selectSvg(svg: SVGGraphicsElement, selectRect: DOMRect): void {
        const thickness = parseInt(svg.getAttribute('stroke-width') as string, 10) / 2;
        const svgRect = svg.getBoundingClientRect();
        const selectLeft = selectRect.left;
        const selectRight = selectRect.right;
        const selectTop = selectRect.top;
        const selectBottom = selectRect.bottom;

        const svgLeft = svgRect.left + thickness;
        const svgRight = svgRect.right - thickness;
        const svgTop = svgRect.top + thickness;
        const svgBottom = svgRect.bottom - thickness;

        if (
            svgTop + svgRect.height > selectTop &&
            svgLeft + svgRect.width > selectLeft &&
            svgBottom - svgRect.height < selectBottom &&
            svgRight - svgRect.width < selectRight
        ) {
            if (!this.state.selectionBox.svgs.includes(svg)) {
                this.state.selectionBox.push(svg);
            }
        } else {
            this.state.selectionBox.delete(svg);
        }
    }

    handleKeyDown(key: string): void {
        if (key === SelectionButtons.Control) {
            this.isCtrl = true;
        }
        if (key === SelectionButtons.Delete) {
            this.store.delete();
        }

        if (this.isCtrl) {
            if (key === SelectionButtons.A) {
                this.state.selectionBox.svgs = this.state.svgState.svgs;
            }
            if (key === SelectionButtons.V) {
                this.store.paste();
            }
            if (this.state.selectionBox.display) {
                switch (key) {
                    case SelectionButtons.C:
                        this.store.copy();
                        break;
                    case SelectionButtons.X:
                        this.store.cut();
                        break;

                    case SelectionButtons.D:
                        this.store.duplicate();
                        break;
                }
            }
        }
    }

    handleKeyUp(key: string): void {
        if (key === SelectionButtons.Control) {
            this.isCtrl = false;
        }
    }
}
