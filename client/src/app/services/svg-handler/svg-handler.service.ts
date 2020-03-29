import { Injectable, Injector } from '@angular/core';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { Tools } from 'src/app/models/enums';
import { EraserService } from '../tools/eraser/eraser.service';

@Injectable({
    providedIn: 'root',
})
export class SvgHandlerService {
    state: DrawState;

    constructor(public injector: Injector, public store: DrawStore) {
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });
    }

    onMouseOver(svg: SVGGraphicsElement) {
        if (this.state.globalState.tool === Tools.Eraser) {
            this.injector.get(EraserService).onMouseOver(svg);
        }
    }

    onMouseOut(svg: SVGGraphicsElement) {
        if (this.state.globalState.tool === Tools.Eraser) {
            this.injector.get(EraserService).onMouseOut(svg);
        }
    }

    onClick(svg: SVGGraphicsElement) {
        if (this.state.globalState.tool === Tools.Eraser) {
            this.injector.get(EraserService).onClick(svg);
        }
    }
}
