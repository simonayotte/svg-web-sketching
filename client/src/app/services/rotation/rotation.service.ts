import { Injectable, RendererFactory2 } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

export const DEFAULT_ROTATION = 15;
export const ALT_ROTATION = 1;

const PANEL_WIDTH = 252;
const SIDEBAR_WIDTH = 52;
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
  // Fonctionne 
  rotateSvgs(): void {
    const centerX = this.state.selectionBox.centerX;
    const centerY = this.state.selectionBox.centerY;
    for (const svg of this.state.selectionBox.svgs) {
      let rotation = Tool.getRotation(svg);
      console.log("angle", rotation, "centerX",  centerX, "centerY", centerY);   
      this.renderer.setAttribute(svg, 'transform', `rotate(${(this.angle + rotation) % 360},${centerX},${centerY})`);
      this.state.selectionBox.update();
    }
  }

  // Find closest element to x, y mouse cursor and return svg element inside the box
  rotateSvg(x: number, y: number): void {
    let element = this.findElementToRotate(x, y);
    console.log("index", element[0]);
    let elementToRotate = this.state.selectionBox.svgs[element[0]];
    let rotation = Tool.getRotation(elementToRotate);
    this.renderer.setAttribute(elementToRotate, 'transform', `rotate(${(this.angle + rotation) % 360},${element[1]},${element[2]})`);
    this.state.selectionBox.update();
  }

  stop(): void {
    this.state.selectionBox.isRotating = false;
    this.state.svgState.drawSvg.removeEventListener('wheel', this.mouseWheelListener);
  }

  // Give MouseEvent coordiante -> finds closest SVG element inside the selection box
  findElementToRotate(x: number, y:number): number[] {
    let currentIndex = 0;
    for (const svg of this.state.selectionBox.svgs) {
      const domRect = svg.getBoundingClientRect();
      let thickness = parseInt(<string>svg.getAttribute('stroke-width')) / 2;
      let rectLeft = domRect.left - thickness - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
      let rectTop = domRect.top - thickness;
      let rectRight = domRect.right + thickness - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
      let rectBottom = domRect.bottom + thickness;

      console.log("rectLeft", rectLeft, "x", x,  "rectRight", rectRight);
      console.log("rectTop", rectTop, "y", y, "rectBottom", rectBottom);
      const insideX = (rectLeft <= x && x <= rectRight);
      const insideY = (rectTop <= y && y <= rectBottom);
      if(insideX && insideY) {
        const centerX = Math.abs((rectRight- rectLeft)/2 + rectLeft); console.log("centerX", centerX);
        const centerY = Math.abs((rectBottom - rectTop)/2 + rectTop); console.log("centerY" , centerY);
        return [currentIndex, centerX, centerY];
      }
      currentIndex++;
    }
    return [-1,-1,-1];
  }
}
