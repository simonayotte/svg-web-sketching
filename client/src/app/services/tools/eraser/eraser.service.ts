import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Color } from 'src/app/models/color';

const DARK_RED = new Color(150, 0, 0, 255);
const RED = new Color(200, 0, 0, 255);

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    state: DrawState;
    renderer: Renderer2;
    oldStrokeColor: string = '';
    touchedSvgIndex: number = -1;
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
        let svgs = this.state.svgState.svgs;
        if (this.touchedSvgIndex === -1) {
            //if eraser is not touching any svg
            this.touchedSvgIndex = this.verifyMouseOver(x, y, svgs);
        } else {
            this.verifyMouseOut(x, y, svgs[this.touchedSvgIndex]);
        }
    }

    deleteTouchedSvg() {
        if (this.touchedSvgIndex >= 0 && this.renderer) {
            this.renderer.setAttribute(this.state.svgState.svgs[this.touchedSvgIndex], 'stroke', this.oldStrokeColor);
            this.deletedSvgs.push(this.state.svgState.svgs[this.touchedSvgIndex]);
            this.renderer.removeChild(this.state.svgState.drawSvg, this.state.svgState.svgs[this.touchedSvgIndex]);
            this.touchedSvgIndex = -1;
        }
    }

    verifyMouseOver(x: number, y: number, svgs: SVGGraphicsElement[]): number {
        for (let i = svgs.length - 1; i >= 0; i--) {
            let box = svgs[i].getBBox();
            let thickness = parseInt(<string>svgs[i].getAttribute('stroke-width'));

            if (this.isEraseTouching(x, y, box, thickness)) {
                this.oldStrokeColor = <string>svgs[i].getAttribute('stroke');
                if (this.oldStrokeColor === RED.hex()) {
                    this.renderer.setAttribute(svgs[i], 'stroke', DARK_RED.hex());
                } else {
                    this.renderer.setAttribute(svgs[i], 'stroke', RED.hex());
                }
                return i;
            }
        }
        return -1;
    }

    verifyMouseOut(x: number, y: number, svg: SVGGraphicsElement) {
        let box = svg.getBBox();
        let thickness = parseInt(<string>svg.getAttribute('stroke-width'));

        if (!this.isEraseTouching(x, y, box, thickness)) {
            this.renderer.setAttribute(svg, 'stroke', this.oldStrokeColor);
            this.touchedSvgIndex = -1;
        }
    }

    isEraseTouching(x: number, y: number, box: DOMRect, thickness: number): boolean {
        let eraserLeft = x - this.state.eraserThickness / 2;
        let eraserRight = x + this.state.eraserThickness / 2;
        let eraserTop = y + this.state.eraserThickness / 2;
        let eraserBottom = y - this.state.eraserThickness / 2;
        let boxLeft = box.x - thickness / 2;
        let boxBottom = box.y - thickness / 2;
        let boxRight = box.x + box.width + thickness / 2;
        let boxTop = box.y + box.height + thickness / 2;

        let isLeftInside: boolean;
        let isRightInside: boolean;

        if (this.state.eraserThickness < box.width) {
            //If svg box width is bigger than eraser ...
            isLeftInside = eraserLeft >= boxLeft && eraserLeft <= boxRight; //verify if left side of eraser is between horizontal box bounds
            isRightInside = eraserRight >= boxLeft && eraserRight <= boxRight; //verify if right side of eraser is between horizontal box bounds
        } else {
            //If eraser width is bigger than svg box
            isLeftInside = boxLeft >= eraserLeft && boxLeft <= eraserRight;
            isRightInside = boxRight >= eraserLeft && boxRight <= eraserRight;
        }

        let isTopInside: boolean;
        let isBottomInside: boolean;

        if (this.state.eraserThickness < box.height) {
            //If svg box height is bigger than eraser ...
            isTopInside = eraserTop >= boxBottom && eraserTop <= boxTop;
            isBottomInside = eraserBottom >= boxBottom && eraserBottom <= boxTop;
        } else {
            //If eraser height is bigger than svg box ...
            isTopInside = boxTop >= eraserBottom && boxTop <= eraserTop;
            isBottomInside = boxBottom >= eraserBottom && boxBottom <= eraserTop;
        }
        let isXTouching = isLeftInside || isRightInside;

        let isYTouching = isTopInside || isBottomInside;

        return isXTouching && isYTouching;
    }
}
