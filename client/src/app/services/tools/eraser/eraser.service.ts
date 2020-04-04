import { Injectable, RendererFactory2 } from '@angular/core';
import { Color } from 'src/app/models/color';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from '../../../store/draw-store';

const DARK_RED = new Color(150, 0, 0, 255);
const RED = new Color(200, 0, 0, 255);

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    oldStrokeColor = '';
    touchedSvgIndex = -1;
    deletedSvgs: SVGGraphicsElement[] = [];
    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });

        this.mouseUpListener = this.stop.bind(this);
        this.mouseMoveListener = this.continue.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start() {
        this.deleteTouchedSvg();

        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
    }

    continue() {
        this.deleteTouchedSvg();
    }

    stop() {
        if (this.deletedSvgs.length > 0) {
            this.store.deleteSvgs(this.deletedSvgs);
            this.deletedSvgs = [];
        }

        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
        this.stopSignal();
    }

    move(x: number, y: number) {
        const svgs = this.state.svgState.svgs;
        this.touchedSvgIndex = this.verifyMouseOver(x, y, svgs);
    }

    deleteTouchedSvg() {
        if (this.touchedSvgIndex >= 0) {
            this.renderer.setAttribute(this.state.svgState.svgs[this.touchedSvgIndex], 'stroke', this.oldStrokeColor);
            this.deletedSvgs.push(this.state.svgState.svgs[this.touchedSvgIndex]);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.state.svgState.svgs[this.touchedSvgIndex]);
            this.touchedSvgIndex = -1;
        }
    }

    verifyMouseOver(x: number, y: number, svgs: SVGGraphicsElement[]): number {
        for (let i = svgs.length - 1; i >= 0; i--) {
            const box = svgs[i].getBBox();
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
        return -1;
    }

    isEraseTouching(x: number, y: number, box: DOMRect, thickness: number): boolean {
        const eraserLeft = x - this.state.eraserThickness / 2;
        const eraserRight = x + this.state.eraserThickness / 2;
        const eraserTop = y + this.state.eraserThickness / 2;
        const eraserBottom = y - this.state.eraserThickness / 2;
        const boxLeft = box.x - thickness / 2;
        const boxBottom = box.y - thickness / 2;
        const boxRight = box.x + box.width + thickness / 2;
        const boxTop = box.y + box.height + thickness / 2;

        let isLeftInside: boolean;
        let isRightInside: boolean;

        if (this.state.eraserThickness < box.width) {
            // If svg box width is bigger than eraser ...
            isLeftInside = eraserLeft >= boxLeft && eraserLeft <= boxRight; // verify if left side of eraser is between horizontal box bounds
            isRightInside = eraserRight >= boxLeft && eraserRight <= boxRight; // verify if right side of eraser is between horizontal box bounds
        } else {
            // If eraser width is bigger than svg box
            isLeftInside = boxLeft >= eraserLeft && boxLeft <= eraserRight;
            isRightInside = boxRight >= eraserLeft && boxRight <= eraserRight;
        }

        let isTopInside: boolean;
        let isBottomInside: boolean;

        if (this.state.eraserThickness < box.height) {
            // If svg box height is bigger than eraser ...
            isTopInside = eraserTop >= boxBottom && eraserTop <= boxTop;
            isBottomInside = eraserBottom >= boxBottom && eraserBottom <= boxTop;
        } else {
            // If eraser height is bigger than svg box ...
            isTopInside = boxTop >= eraserBottom && boxTop <= eraserTop;
            isBottomInside = boxBottom >= eraserBottom && boxBottom <= eraserTop;
        }
        const isXTouching = isLeftInside || isRightInside;

        const isYTouching = isTopInside || isBottomInside;

        return isXTouching && isYTouching;
    }
}
