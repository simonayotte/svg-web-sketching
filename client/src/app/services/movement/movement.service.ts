import { Injectable, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { SelectionButtons } from 'src/app/models/enums';

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

        this.store.setIsSelectionMoving(true);
        this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
        this.state.svgState.drawSvg.addEventListener('mouseleave', this.mouseUpListener);
    }

    continue(event: MouseEvent): void {
        this.moveSvgs(event.offsetX, event.offsetY);
        this.moveSelection(event.offsetX, event.offsetY);
    }
    moveSvgs(x: number, y: number) {
        let dX = x - this.lastX;
        let dY = y - this.lastY;
        this.lastX = x;
        this.lastY = y;
        for (const svg of this.state.selectionBox.svgs) {
            let translation = this.state.selectionBox.getTranslation(svg);

            this.renderer.setAttribute(svg, 'transform', `translate(${dX + translation[0]},${dY + translation[1]})`);
        }
    }

    moveSelection(x: number, y: number) {
        let dX = x - this.startX;
        let dY = y - this.startY;

        this.store.moveSelection(this.startSelectX, this.startSelectY, dX, dY);
    }

    stop(): void {
        this.store.setIsSelectionMoving(false);

        this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
        this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
        this.state.svgState.drawSvg.removeEventListener('mouseleave', this.mouseUpListener);
    }

    handleKeyDown(key: string): void {
        this.startSelectX = this.state.selectionBox.x;
        this.startSelectY = this.state.selectionBox.y;

        if (key === SelectionButtons.ArrowLeft) {
            this.store.moveSelection(this.startSelectX, this.startSelectY, -MINIMUM_MOVEMENT, 0);
            for (const svg of this.state.selectionBox.svgs) {
                let translation = this.state.selectionBox.getTranslation(svg);

                this.renderer.setAttribute(svg, 'transform', `translate(${translation[0] - MINIMUM_MOVEMENT},${translation[1]})`);
            }
        }
        if (key === SelectionButtons.ArrowRight) {
            this.store.moveSelection(this.startSelectX, this.startSelectY, MINIMUM_MOVEMENT, 0);
            for (const svg of this.state.selectionBox.svgs) {
                let translation = this.state.selectionBox.getTranslation(svg);

                this.renderer.setAttribute(svg, 'transform', `translate(${translation[0] + MINIMUM_MOVEMENT},${translation[1]})`);
            }
        }
        if (key === SelectionButtons.ArrowUp) {
            this.store.moveSelection(this.startSelectX, this.startSelectY, 0, -MINIMUM_MOVEMENT);
            for (const svg of this.state.selectionBox.svgs) {
                let translation = this.state.selectionBox.getTranslation(svg);

                this.renderer.setAttribute(svg, 'transform', `translate(${translation[0]},${translation[1] - MINIMUM_MOVEMENT})`);
            }
        }
        if (key === SelectionButtons.ArrowDown) {
            this.store.moveSelection(this.startSelectX, this.startSelectY, 0, MINIMUM_MOVEMENT);
            for (const svg of this.state.selectionBox.svgs) {
                let translation = this.state.selectionBox.getTranslation(svg);

                this.renderer.setAttribute(svg, 'transform', `translate(${translation[0]},${translation[1] + MINIMUM_MOVEMENT})`);
            }
        }
    }
}
