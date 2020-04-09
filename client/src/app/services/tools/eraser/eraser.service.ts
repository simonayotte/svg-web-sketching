import { Injectable, RendererFactory2 } from '@angular/core';
import { Color } from 'src/app/models/color';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';

const FULL_COLOR = 255;
const ONE_FIFTY = 150;
const TWO_HUNDRED = 200;
const DARK_RED = new Color(ONE_FIFTY, 0, 0, FULL_COLOR);
const RED = new Color(TWO_HUNDRED, 0, 0, FULL_COLOR);
const NO_SVG = -1;

const PANEL_WIDTH = 252;
const SIDEBAR_WIDTH = 52;
@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    oldStrokeColor: string;
    touchedSvgIndex: number;
    deletedSvgs: SVGGraphicsElement[] = [];
    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.oldStrokeColor = '';
        this.touchedSvgIndex = NO_SVG;

        this.mouseUpListener = this.stop.bind(this);
        this.mouseMoveListener = this.continue.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(): void {
        this.deleteTouchedSvg();

        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
    }

    continue(): void {
        this.deleteTouchedSvg();
    }

    stop(): void {
        if (this.deletedSvgs.length > 0) {
            this.store.deleteSvgs(this.deletedSvgs);
            this.deletedSvgs = [];
        }

        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
        this.stopSignal();
    }

    move(x: number, y: number): void {
        const svgs = this.state.svgState.svgs;
        this.touchedSvgIndex = this.verifyMouseOver(x, y, svgs);
    }

    deleteTouchedSvg(): void {
        if (this.touchedSvgIndex >= 0) {
            this.renderer.setAttribute(this.state.svgState.svgs[this.touchedSvgIndex], 'stroke', this.oldStrokeColor);
            this.deletedSvgs.push(this.state.svgState.svgs[this.touchedSvgIndex]);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.state.svgState.svgs[this.touchedSvgIndex]);
            this.touchedSvgIndex = NO_SVG;
        }
    }

    verifyMouseOver(x: number, y: number, svgs: SVGGraphicsElement[]): number {
        for (let i = svgs.length - 1; i >= 0; i--) {
            const box: DOMRect = <DOMRect>svgs[i].getBoundingClientRect();
            const thickness = parseInt(svgs[i].getAttribute('stroke-width') as string);

            if (this.isEraseTouching(x, y, box, thickness)) {
                if (this.touchedSvgIndex === i) {
                    return i;
                }
                if (this.touchedSvgIndex >= 0) {
                    this.renderer.setAttribute(svgs[this.touchedSvgIndex], 'stroke', this.oldStrokeColor);
                }

                this.oldStrokeColor = svgs[i].getAttribute('stroke') as string;

                if (this.oldStrokeColor === RED.hex()) {
                    this.renderer.setAttribute(svgs[i], 'stroke', DARK_RED.hex());
                } else {
                    this.renderer.setAttribute(svgs[i], 'stroke', RED.hex());
                }
                return i;
            } else if (this.touchedSvgIndex === i) {
                this.renderer.setAttribute(svgs[this.touchedSvgIndex], 'stroke', this.oldStrokeColor);
            }
        }
        return NO_SVG;
    }

    isEraseTouching(x: number, y: number, box: DOMRect, thickness: number): boolean {
        const eraserLeft = x - this.state.eraserThickness / 2;
        const eraserRight = x + this.state.eraserThickness / 2;
        const eraserTop = y + this.state.eraserThickness / 2;
        const eraserBottom = y - this.state.eraserThickness / 2;
        const boxLeft = box.left - thickness / 2 - (this.state.globalState.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
        const boxBottom = box.bottom - thickness / 2;
        const boxRight = box.right + thickness / 2 - (this.state.globalState.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
        const boxTop = box.top + thickness / 2;

        if (
            boxTop + box.height > eraserTop &&
            boxLeft + box.width > eraserLeft &&
            boxBottom - box.height < eraserBottom &&
            boxRight - box.width < eraserRight
        ) {
            return true;
        }
        return false;
    }
}
