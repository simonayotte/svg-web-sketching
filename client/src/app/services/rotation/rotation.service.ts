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
  
  multipleRotation(): void {
    for (const svg of this.state.selectionBox.svgs) {
      this.rotate(svg, this.state.selectionBox.centerX, this.state.selectionBox.centerY);
    }
  }

  // Find closest element to x, y mouse cursor and return svg element inside the box
  singleRotation(x: number, y: number): void {
    let element = this.findElementToRotate(x, y);
    let elementToRotate = this.state.selectionBox.svgs[element];
    let center = this.findSVGCenter(elementToRotate);
    this.rotate(elementToRotate, center.pointX, center.pointY);
    //this.state.selectionBox.updateCenter();
  }

  // TODO: Find way to call this method when finished with rotation.
  stop(): void {
    this.state.svgState.drawSvg.removeEventListener('wheel', this.mouseWheelListener);
  }

  // Give MouseEvent coordiante -> finds closest SVG element inside the selection box
  findElementToRotate(x: number, y:number): number {
    let currentIndex = 0;
    let minDistance = Math.sqrt(Math.pow(this.state.svgState.width, 2) + Math.pow(this.state.svgState.height, 2));
    let index = -1;
    for (const svg of this.state.selectionBox.svgs) {
      // Calculate distance from center of SVG to mouse coord
      let center = this.findSVGCenter(svg);
      let distance = Math.sqrt(Math.pow((center.pointX - x),2) + Math.pow((center.pointY - y),2));
      if (distance <= minDistance) {
        minDistance = distance;
        index = currentIndex;
      }
      currentIndex++;
    }
    return index;
  }

  // Rotate one SVG element, with coordinates of center of rotation
  rotate(svg: SVGGraphicsElement, x: number, y: number) : void {
    let rotation = Tool.getRotation(svg);
    this.renderer.setAttribute(svg, 'transform', `rotate(${(this.angle + rotation) % 360},${x},${y})`);
    this.state.selectionBox.update();
  }

  findSVGCenter(svg: SVGGraphicsElement): Coordinate {    
    const svgBox = svg.getBoundingClientRect();
    let thickness = parseInt(<string>svg.getAttribute('stroke-width')) / 2;
    let rectLeft = svgBox.left - thickness - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
    let rectTop = svgBox.top - thickness;
    let rectRight = svgBox.right + thickness - (this.state.selectionBox.isPanelOpen ? PANEL_WIDTH : SIDEBAR_WIDTH);
    let rectBottom = svgBox.bottom + thickness;
    const centerX = Math.abs((rectRight- rectLeft)/2 + rectLeft);
    const centerY = Math.abs((rectBottom - rectTop)/2 + rectTop);
    return new Coordinate(centerX, centerY);
  }
}
