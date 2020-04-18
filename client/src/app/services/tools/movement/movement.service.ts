import { Injectable, RendererFactory2 } from '@angular/core';
import { SelectionButtons } from 'src/app/models/enums';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

export const MINIMUM_MOVEMENT = 3;
@Injectable({
    providedIn: 'root',
})
export class MovementService extends Tool {
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    startSelectX: number;
    startSelectY: number;
    svgsBeforeMovement: SVGGraphicsElement[] = [];
    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.startX = this.startY = this.lastX = this.lastY = this.startSelectX = this.startSelectY = 0;
        this.mouseUpListener = this.stop.bind(this);
        this.mouseMoveListener = this.continue.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
    }

    start(event: MouseEvent): void {
        this.startX = this.lastX = event.offsetX;
        this.startY = this.lastY = event.offsetY;
        this.startSelectX = this.state.selectionBox.x;
        this.startSelectY = this.state.selectionBox.y;
        this.state.selectionBox.isMoving = true;

        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.state.svgState.drawSvg.addEventListener('mouseleave', this.mouseUpListener);
    }

    continue(event: MouseEvent): void {
        if (this.svgsBeforeMovement.length === 0) {
            this.svgsBeforeMovement = Tool.cloneSvgs(this.state.svgState.svgs);
        }
        const dX = event.offsetX - this.lastX;
        const dY = event.offsetY - this.lastY;
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
        this.moveSvgs(dX, dY);
    }
    moveSvgs(dX: number, dY: number): void {
        for (const svg of this.state.selectionBox.svgs) {
            const translation = Tool.getTranslation(svg);
            const rotation = Tool.getRotation(svg);
            this.renderer.setAttribute(
                svg,
                'transform',
                `translate(${dX + translation[0]},${dY + translation[1]}) rotate(${rotation[0]} ${rotation[1]} ${rotation[2]})`,
            );
        }
        this.state.selectionBox.move(dX, dY);
    }

    stop(): void {
        this.state.selectionBox.isMoving = false;
        this.store.saveSvgsState(this.svgsBeforeMovement); // for undo redo
        this.svgsBeforeMovement = [];
        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
        this.state.svgState.drawSvg.removeEventListener('mouseleave', this.mouseUpListener);
        this.store.automaticSave();
        this.stopSignal();
    }

    handleKeyDown(key: string): void {
        this.startSelectX = this.state.selectionBox.x;
        this.startSelectY = this.state.selectionBox.y;

        if (key === SelectionButtons.ArrowLeft) {
            this.moveSvgs(-MINIMUM_MOVEMENT, 0);
        }
        if (key === SelectionButtons.ArrowRight) {
            this.moveSvgs(MINIMUM_MOVEMENT, 0);
        }
        if (key === SelectionButtons.ArrowUp) {
            this.moveSvgs(0, -MINIMUM_MOVEMENT);
        }
        if (key === SelectionButtons.ArrowDown) {
            this.moveSvgs(0, MINIMUM_MOVEMENT);
        }
    }
}
