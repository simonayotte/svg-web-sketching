import { Injectable, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { SelectionButtons } from 'src/app/models/enums';

export const OFFSET = 10;
@Injectable({
    providedIn: 'root',
})
export class ClipboardService extends Tool {
    isCtrl: boolean;
    copiedSvgs: SVGGraphicsElement[] = [];

    constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
        this.isCtrl = false;
        this.mouseUpListener = this.stop.bind(this);
        this.mouseMoveListener = this.continue.bind(this);

        this.renderer = rendererFactory.createRenderer(null, null);
    }

    copy(): void {
        this.copiedSvgs = this.cloneSvgs(this.state.selectionBox.svgs);
    }

    paste(svgs: SVGGraphicsElement[]): void {
        if (svgs.length > 0) {
            this.store.pushSvgs(svgs);
            setTimeout(() => {
                //wait svgs to be appended

                for (const svg of svgs) {
                    let translation = this.state.selectionBox.getTranslation(svg);

                    this.renderer.setAttribute(svg, 'transform', `translate(${OFFSET + translation[0]},${OFFSET + translation[1]})`);
                }
                this.state.selectionBox.svgs = svgs;
            });
        }
    }

    cut(): void {
        this.copy();
        this.store.deleteSvgs(this.state.selectionBox.svgs);
        this.state.selectionBox.hideSelection();
    }

    duplicate(): void {
        let svgs = this.cloneSvgs(this.state.selectionBox.svgs);
        this.paste(svgs);
    }

    delete(): void {
        this.store.deleteSvgs(this.state.selectionBox.svgs);
        this.state.selectionBox.svgs = [];
    }

    handleKeyDown(key: string): void {
        if (key === SelectionButtons.Control) {
            this.isCtrl = true;
        }

        if (key === SelectionButtons.Delete) {
            this.delete();
        }
        if (this.isCtrl) {
            if (key === SelectionButtons.C) {
                this.copy();
            }
            if (key === SelectionButtons.V) {
                this.paste(this.copiedSvgs);
            }
            if (key === SelectionButtons.X) {
                this.cut();
            }
            if (key === SelectionButtons.D) {
                this.duplicate();
            }
        }
    }

    handleKeyUp(key: string): void {
        if (key === SelectionButtons.Control) {
            this.isCtrl = false;
        }
    }
}
