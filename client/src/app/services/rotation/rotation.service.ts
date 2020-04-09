import { Injectable, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { SelectionButtons } from 'src/app/models/enums';

export const DEFAULT_ROTATION = 15;
export const ALT_ROTATION = 1;
@Injectable({
  providedIn: 'root'
})
export class RotationService extends Tool {
  
  mouseWheelListener: EventListener;
  isShiftDown: boolean;
  angle: number;

  constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
      super();
      this.store.stateObs.subscribe((value: DrawState) => {
          this.state = value;
      });
      this.isShiftDown = false;
      this.angle = DEFAULT_ROTATION;

      this.mouseWheelListener = this.start.bind(this);
      this.state.svgState.drawSvg.addEventListener('wheel', this.mouseWheelListener);

      this.renderer = rendererFactory.createRenderer(null, null);
  }

  start(event: WheelEvent): void {
    event.preventDefault();
    this.store.setIsSelectionRotating(true);
    event.altKey ? this.angle = ALT_ROTATION : this.angle = DEFAULT_ROTATION;
    console.log(event.deltaY);
    this.rotateSvgs();
  }

  rotateSvgs(): void {
    const centerX = this.state.selectionBox.getCenter().pointX;
    const centerY = this.state.selectionBox.getCenter().pointY;
    for (const svg of this.state.selectionBox.svgs) {
      //let rotation = this.state.selectionBox.getRotation(svg);
      //this.renderer.setAttribute(svg, 'transform', `rotate(${(this.angle + rotation[0]) % 360 },${centerX},${centerY})`);
      this.state.selectionBox.update();
    }
  }

  stop(): void {
    this.store.setIsSelectionRotating(false);
    this.state.svgState.drawSvg.removeEventListener('wheel', this.mouseWheelListener);
  }

  handleKeyDown(key: string): void {
    if (key === SelectionButtons.Shift) {
      this.isShiftDown = !this.isShiftDown;
    }
  }
}
