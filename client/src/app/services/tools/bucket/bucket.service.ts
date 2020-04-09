import { Injectable, RendererFactory2 } from '@angular/core';
//import { Tools } from 'src/app/models/enums';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';


@Injectable({
  providedIn: 'root'
})
export class BucketService extends Tool{

  constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
    super();
    this.store.stateObs.subscribe((value: DrawState) => {
        this.state = value;
    });
    this.mouseMoveListener = this.continue.bind(this);
    this.mouseUpListener = this.stop.bind(this);

    this.renderer = rendererFactory.createRenderer(null, null);
  }

  start(event: MouseEvent): void {

  }

  continue(event: MouseEvent): void {

  }

  stop(): void {
    this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
    this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
  }
}
