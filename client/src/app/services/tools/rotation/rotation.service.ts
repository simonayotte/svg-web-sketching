import { Injectable, RendererFactory2 } from '@angular/core';
import { SelectionButtons } from 'src/app/models/enums';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { Coordinate } from '../../../models/coordinate';

export const DEFAULT_ROTATION = 15;
export const ALT_ROTATION = 1;
export const MAX_ANGLE = 360;
const PANEL_WIDTH = 252;
const SIDEBAR_WIDTH = 52;
@Injectable({
    providedIn: 'root',
})
export class RotationService extends Tool {
    isShiftDown: boolean;
    angle: number;
    isLastModeShift: boolean;
    lastRotatedSvgs: SVGGraphicsElement[];
    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.angle = DEFAULT_ROTATION;
        this.isLastModeShift = false;
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(): void {
        this.store.saveSvgsState(Tool.cloneSvgs(this.state.svgState.svgs));
        if (this.isLastModeShift !== this.isShiftDown || this.lastRotatedSvgs !== this.state.selectionBox.svgs) {
            // Rotation mode changed
            this.resetRotation();
        }
        this.multipleRotation();
        this.isLastModeShift = this.isShiftDown;
        this.lastRotatedSvgs = this.state.selectionBox.svgs;
    }

    multipleRotation(): void {
        const selectionCenterX: number = parseFloat((this.state.selectionBox.x + this.state.selectionBox.width / 2).toFixed(2));
        const selectionCenterY: number = parseFloat((this.state.selectionBox.y + this.state.selectionBox.height / 2).toFixed(2));

        for (const svg of this.state.selectionBox.svgs) {
            if (this.isShiftDown) {
                const svgCenter = this.findSVGCenter(svg);
                this.rotate(svg, svgCenter.pointX, svgCenter.pointY);
            } else {
                this.rotate(svg, selectionCenterX, selectionCenterY);
            }
        }
        this.store.automaticSave();
    }

    rotate(svg: SVGGraphicsElement, x: number, y: number): void {
        const rotation = Tool.getRotation(svg);
        const translation = Tool.getTranslation(svg);

        this.renderer.setAttribute(
            svg,
            'transform',
            `translate(${translation[0]},${translation[1]}) rotate(${(this.angle + rotation[0]) % MAX_ANGLE} ${x - translation[0]} ${y -
                translation[1]})`,
        );
    }

    findSVGCenter(svg: SVGGraphicsElement): Coordinate {
        const svgBox = svg.getBoundingClientRect();

        const rectLeft = svgBox.left - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
        const rectTop = svgBox.top;
        const rectRight = svgBox.right - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
        const rectBottom = svgBox.bottom;
        const centerX = Math.abs((rectRight - rectLeft) / 2 + rectLeft);
        const centerY = Math.abs((rectBottom - rectTop) / 2 + rectTop);
        return new Coordinate(parseFloat(centerX.toFixed(2)), parseFloat(centerY.toFixed(2)));
    }
    resetRotation(): void {
        for (const svg of this.state.selectionBox.svgs) {
            const rotation = Tool.getRotation(svg);
            const translation = Tool.getTranslation(svg);

            this.renderer.setAttribute(
                svg,
                'transform',
                `translate(${translation[0]},${translation[1]}) rotate(0 ${rotation[1]} ${rotation[2]})`);
        }
    }

    handleKeyDown(key: string): void {
        if (key === SelectionButtons.Shift) {
            this.isShiftDown = true;
        }

        if (key === SelectionButtons.Alt) {
            this.angle = ALT_ROTATION;
        }
    }

    handleKeyUp(key: string): void {
        if (key === SelectionButtons.Shift) {
            this.isShiftDown = false;
        }
        if (key === SelectionButtons.Alt) {
            this.angle = DEFAULT_ROTATION;
        }
    }
}
