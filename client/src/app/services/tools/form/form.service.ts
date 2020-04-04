import { Injectable, RendererFactory2 } from '@angular/core';
import { Types } from '../../../models/enums';
import { Tool } from '../../../models/tool';
import { DrawState } from '../../../state/draw-state';
import { DrawStore } from '../../../store/draw-store';

@Injectable({
    providedIn: 'root',
})
export class FormService extends Tool {
    isDrawing: boolean;

    constructor(protected store: DrawStore, rendererFactory: RendererFactory2) {
        super();
        this.store.stateObs.subscribe((value: DrawState) => {
            this.state = value;
        });

        this.isDrawing = false;
        this.mouseMoveListener = this.continue.bind(this);
        this.mouseUpListener = this.stop.bind(this);
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    setColors(type: Types): void {
        switch (type) {
            case Types.Outline:
                this.renderer.setAttribute(this.svg, 'fill', 'none');
                this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.secondColor.hex());

                break;
            case Types.OutlineFill:
                this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
                this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.secondColor.hex());

                break;
            case Types.Fill:
                this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
                this.renderer.setAttribute(this.svg, 'stroke', 'none');
                break;
        }
    }
}
