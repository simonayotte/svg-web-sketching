import { Injectable, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

export const DEFAULT_ROTATION = 15;
export const ALT_ROTATION = 2;
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
      this.angle = DEFAULT_ROTATION;

      this.mouseWheelListener = this.start.bind(this);
      this.state.svgState.drawSvg.addEventListener('wheel', this.mouseWheelListener);

      this.renderer = rendererFactory.createRenderer(null, null);
  }

  start(event: WheelEvent): void {
    event.preventDefault();
    this.state.selectionBox.isRotating = true;
    this.angle = (event.altKey ? ALT_ROTATION : DEFAULT_ROTATION);
    event.shiftKey ? this.rotateSvg(event.offsetX, event.offsetY) : this.rotateSvgs();
    // Add logic for undo redo
  }

  rotateSvgs(): void {
    for (const svg of this.state.selectionBox.svgs) {
      const centerX = this.state.selectionBox.getCenter().pointX;
      const centerY = this.state.selectionBox.getCenter().pointY;
      console.log(centerX);
      console.log(centerY);
      let rotation = Tool.getRotation(svg);
      this.renderer.setAttribute(svg, 'transform', `rotate(${(this.angle + rotation) % 360},${centerX},${centerY})`);
      this.state.selectionBox.update();
    }
  }

  // Find closest element to x, y mouse cursor and return svg element inside the box
  rotateSvg(x: number, y: number): void {
    let elementToRotate = this.state.selectionBox.svgs[this.findElementToRotate(x, y)];
    let area = elementToRotate.getBoundingClientRect();
    const centerX = Math.abs((area.right - area.left)/2);
    const centerY = Math.abs((area.bottom - area.top)/2);
    let rotation = Tool.getRotation(elementToRotate);
    this.renderer.setAttribute(elementToRotate, 'transform', `rotate(${(this.angle + rotation) % 360},${centerX},${centerY})`);
    this.state.selectionBox.update();
  }

  stop(): void {
    this.state.selectionBox.isRotating = false;
    this.state.svgState.drawSvg.removeEventListener('wheel', this.mouseWheelListener);
  }
  // Give MouseEvent coordiante -> finds closest SVG element inside the selection box
  findElementToRotate(x: number, y:number): number {
    let currentIndex = 0;
    for (const svg of this.state.selectionBox.svgs) {
      const area = svg.getBoundingClientRect();
      const insideX = (area.left <= x && x <= area.right);
      const insideY = (area.top <= y && y <= area.bottom);
      if(insideX && insideY)
        return currentIndex;
      currentIndex++;
    }
    return 0;
  }
}
