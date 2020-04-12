import { Coordinate } from './../../models/coordinate';
import { ElementToRotate } from './elementToRotate';
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
      this.state.selectionBox.svgsBeforeRotation = [];
      this.renderer = rendererFactory.createRenderer(null, null);
  }

  start(event: WheelEvent): void {
    event.preventDefault();
    this.angle = (event.altKey ? ALT_ROTATION : DEFAULT_ROTATION);
    event.shiftKey ? this.singleRotation(event.offsetX, event.offsetY) : this.multipleRotation();
  }
  
  // TODO: Fix calcul du centre de la bonding box
  multipleRotation(): void {
    for (const svg of this.state.selectionBox.svgs) {
      this.rotate(svg, this.state.selectionBox.centerX, this.state.selectionBox.centerY);
    }
  }

  // Find closest element to x, y mouse cursor and return svg element inside the box
  singleRotation(x: number, y: number): void {
    let element = this.findElementToRotate(x, y); // Returns ElementToRotate
    if (element != -1) {
      let elementToRotate = this.state.selectionBox.svgs[element];
      //this.rotate(elementToRotate, element.center.pointX, element.center.pointY);
      const domRect = elementToRotate.getBoundingClientRect();
      let thickness = parseInt(<string>elementToRotate.getAttribute('stroke-width')) / 2;
      let rectLeft = domRect.left - thickness - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
      let rectTop = domRect.top - thickness;
      let rectRight = domRect.right + thickness - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
      let rectBottom = domRect.bottom + thickness;
      const centerX = Math.abs((rectRight- rectLeft)/2 + rectLeft);
      const centerY = Math.abs((rectBottom - rectTop)/2 + rectTop);
      this.rotate(elementToRotate, centerX, centerY);
      this.state.selectionBox.updateCenter();
    }
  }

  // TODO: Find way to call this method when finished with rotation.
  stop(): void {
    this.state.svgState.drawSvg.removeEventListener('wheel', this.mouseWheelListener);
  }

  // TODO: Change to find the closest SVG Element that can be found
  // Give MouseEvent coordiante -> finds closest SVG element inside the selection box
  findElementToRotate(x: number, y:number): number {
    let currentIndex = 0;
    //let maxDistance = Math.sqrt(Math.pow((this.state.svgState.width),2) + Math.pow((this.state.svgState.height),2));
    //console.log('maxDistance:', maxDistance);
    // Get center of the first SVG Element in the array.
    //let elementToRotate = new ElementToRotate(new Coordinate(0, 0), currentIndex, maxDistance);
    // Find closest SVG element to mouse 
    for (const svg of this.state.selectionBox.svgs) {
      // Operations to obtain center of current SVG
      const domRect = svg.getBoundingClientRect();
      let thickness = parseInt(<string>svg.getAttribute('stroke-width')) / 2;
      let rectLeft = domRect.left - thickness - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
      let rectTop = domRect.top - thickness;
      let rectRight = domRect.right + thickness - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
      let rectBottom = domRect.bottom + thickness;

      //const centerX = Math.abs((rectRight- rectLeft)/2 + rectLeft);
      //const centerY = Math.abs((rectBottom - rectTop)/2 + rectTop);
      // if (currentIndex === 0)
      //   elementToRotate.center = new Coordinate(centerX, centerY);
      // Check for minDistance, updates minDistance
      // if(elementToRotate.findDistance(x, y)) {
      //   elementToRotate.updateElement(centerX, centerY, currentIndex);
      // } 
      const insideX = (rectLeft <= x && x <= rectRight);
      const insideY = (rectTop <= y && y <= rectBottom);
      if(insideX && insideY)
        return currentIndex;
      currentIndex++;
    }
    return -1;
    // return elementToRotate;
  }

  // Rotate one SVG element, with coordinates of center of rotation
  rotate(svg: SVGGraphicsElement, x: number, y: number) : void {
    let rotation = Tool.getRotation(svg);
    this.renderer.setAttribute(svg, 'transform', `rotate(${(this.angle + rotation) % 360},${x},${y})`);
    this.state.selectionBox.update();
  }
}
