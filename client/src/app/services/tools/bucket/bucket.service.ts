import { Injectable, RendererFactory2 } from '@angular/core';
//import { Tools } from 'src/app/models/enums';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { Coordinate } from 'src/app/models/coordinate';

const MAXIMUM_TOLERANCE = 100;
@Injectable({
  providedIn: 'root'
})
export class BucketService extends Tool {
  SVGWidth: number;
  SVGHeight: number;

  constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
    super();
    this.store.stateObs.subscribe((value: DrawState) => {
        this.state = value;
    });

    this.renderer = rendererFactory.createRenderer(null, null);
  }

  start(event: MouseEvent): void {
    this.svg = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(this.svg, 'stroke-width', '1');
    this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
    this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.firstColor.hex());
    this.renderer.setAttribute(this.svg, 'stroke-linecap', 'square');
    this.renderer.setAttribute(this.svg, 'stroke-linejoin', 'square');
    this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
    this.SVGHeight = +this.state.svgState.drawSvg.getAttribute('height')!;
    this.SVGWidth = +this.state.svgState.drawSvg.getAttribute('width')!;
    this.colorArea(event.offsetX, event.offsetY);
    this.stop();
  }

  stop(): void {
    this.store.pushSvg(this.svg);
    this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
    this.stopSignal();
  }

  colorArea(mouseX: number, mouseY: number): void {
    if (this.state.tolerance === MAXIMUM_TOLERANCE) {
      this.fillEntireSVG();
    } else {
      const unverifiedPixels: Coordinate[] = [];
      const verifiedPixels: Coordinate[] = [];
      const pixelsToColor: Coordinate[] = [];
      unverifiedPixels.push(new Coordinate(mouseX, mouseY));
      const color = this.getPixelColor(mouseX, mouseY);

      while (unverifiedPixels.length > 0) {
        const currentPixel = unverifiedPixels.pop();
        if (currentPixel !== undefined) {
          const currentPixelColor = this.getPixelColor(currentPixel.pointX, currentPixel.pointY);
          if (currentPixel.pointX >= 0 && currentPixel.pointX <= this.SVGWidth && currentPixel.pointY >= 0 && currentPixel.pointY <= this.SVGHeight) {
            if (!verifiedPixels.includes(currentPixel) && this.checkColor(currentPixelColor, color, this.state.tolerance)) {
              verifiedPixels.push(currentPixel);
              pixelsToColor.push(currentPixel);

              unverifiedPixels.push(new Coordinate(currentPixel.pointX + 1, currentPixel.pointY));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX - 1, currentPixel.pointY));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX, currentPixel.pointY + 1));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX, currentPixel.pointY - 1));
            }
          }
        }
      }

      this.renderer.setAttribute(this.svg, 'd', this.pointsToString(pixelsToColor));
    }
  }

  createHTMLCanvas(): void {

  }

  fillCanvas(): void {

  }

  getPixelColor(posX: number, posY: number): number[] {
    return [1,1,1];
  }

  checkColor(pixelColor: number[], primaryColor: number[], tolerance: number): boolean {
    const diff = (255 + tolerance) / 100;
    const isRedOk = (primaryColor[0] >= pixelColor[0] - diff) && (primaryColor[0] <= pixelColor[0] + diff);
    const isGreenOk = (primaryColor[1] >= pixelColor[1] - diff) && (primaryColor[1] <= pixelColor[1] + diff);
    const isBlueOk = (primaryColor[2] >= pixelColor[2] - diff) && (primaryColor[2] <= pixelColor[2] + diff);
    return isRedOk && isGreenOk && isBlueOk;
  }

  fillEntireSVG(): void {
    const path = `M0 0 L${this.SVGWidth} 0 L${this.SVGWidth} ${this.SVGHeight} L0 ${this.SVGHeight} Z`;
    this.renderer.setAttribute(this.svg, 'd', path);
  }

  pointsToString(points: Coordinate[]): string {
    let result = '';
    for (let point of points) {
        result = result.concat(`M ${point.pointX} ${point.pointY} h 1`);
    }
    return result;
  }
}
