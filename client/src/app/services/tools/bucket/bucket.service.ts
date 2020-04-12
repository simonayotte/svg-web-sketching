import { Injectable, RendererFactory2 } from '@angular/core';
//import { Tools } from 'src/app/models/enums';
import { Color } from 'src/app/models/color';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { Coordinate } from 'src/app/models/coordinate';

const MAXIMUM_TOLERANCE = 100;
@Injectable({
  providedIn: 'root'
})
export class BucketService extends Tool {
  ctx: CanvasRenderingContext2D;

  constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
    super();
    this.store.stateObs.subscribe((value: DrawState) => {
        this.state = value;
    });

    this.renderer = rendererFactory.createRenderer(null, null);
  }

  start(event: MouseEvent): void {
    this.ctx = this.createHTMLCanvas(this.state.svgState.width, this.state.svgState.height);
    this.fillCanvas(this.state.svgState.drawSvg, event);
  }

  stop(): void {
    if (this.svg) {
      this.store.pushSvg(this.svg);
      this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
    }
    this.stopSignal();
  }

  colorArea(mouseX: number, mouseY: number): void {
    if (this.state.tolerance == MAXIMUM_TOLERANCE) {
      this.fillEntireSVG();
    } else {
      this.createPath();
      const SVGWidth = this.state.svgState.width;
      const SVGHeight = this.state.svgState.height;
      const unverifiedPixels: Coordinate[] = [];
      const verifiedPixels = new Uint8Array(SVGWidth*SVGHeight);
      const pixelsToColor = new Uint8Array(SVGWidth*SVGHeight);
      unverifiedPixels.push(new Coordinate(mouseX, mouseY));
      const imageData = this.ctx.getImageData(0,0,SVGWidth,SVGHeight);
      const color = this.getPixelColor(mouseX, mouseY, imageData);

      while (unverifiedPixels.length > 0) {
        const currentPixel = unverifiedPixels.pop();
        
        if (currentPixel !== undefined) {
          if (currentPixel.pointX >= 0 && currentPixel.pointX <= SVGWidth && currentPixel.pointY >= 0 && currentPixel.pointY <= SVGHeight) {
            const currentPixelColor = this.getPixelColor(currentPixel.pointX, currentPixel.pointY, imageData);
            if (!verifiedPixels[currentPixel.pointY * SVGWidth + currentPixel.pointX] && this.checkColor(currentPixelColor, color, this.state.tolerance)) {
              pixelsToColor[currentPixel.pointY * SVGWidth + currentPixel.pointX] = 1;

              unverifiedPixels.push(new Coordinate(currentPixel.pointX + 1, currentPixel.pointY));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX - 1, currentPixel.pointY));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX, currentPixel.pointY + 1));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX, currentPixel.pointY - 1));
            }
          }
          verifiedPixels[currentPixel.pointY * SVGWidth + currentPixel.pointX] = 1;
        }
      }

      this.renderer.setAttribute(this.svg, 'd', this.pointsToString(pixelsToColor));
    }
    this.stop();
  }

  createHTMLCanvas(width: number, height: number): CanvasRenderingContext2D {
    const canvas = this.renderer.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    return ctx;
  }

  fillCanvas(svg: SVGSVGElement, event: MouseEvent): void {
    const img = new Image();
    const xml = new XMLSerializer().serializeToString(svg);

    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';

    const image64 = b64Start + svg64;

    img.onload = () => {
        if (this.ctx) {
            this.ctx.drawImage(img, 0, 0);
            this.colorArea(event.offsetX, event.offsetY);
        }
    };

    img.src = image64;
  }

  getPixelColor(posX: number, posY: number, imageData: ImageData): Color {
    const data: Uint8ClampedArray = imageData.data.slice((posY * imageData.width + posX)*4, (posY * imageData.width + posX)*4 + 4);
    return new Color(data[0], data[1], data[2], data[3]);
  }

  checkColor(pixelColor: Color, primaryColor: Color, tolerance: number): boolean {
    const diff = (255 + tolerance) / 100;
    const isRedOk = (primaryColor.r >= pixelColor.r - diff) && (primaryColor.r <= pixelColor.r + diff);
    const isGreenOk = (primaryColor.g >= pixelColor.g - diff) && (primaryColor.g <= pixelColor.g + diff);
    const isBlueOk = (primaryColor.b >= pixelColor.b - diff) && (primaryColor.b <= pixelColor.b + diff);
    return isRedOk && isGreenOk && isBlueOk;
  }

  fillEntireSVG(): void {
    this.svg = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(this.svg, 'stroke-width', '1');
    this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
    this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.firstColor.hex());
    this.renderer.setAttribute(this.svg, 'x', '0');
    this.renderer.setAttribute(this.svg, 'y', '0');
    this.renderer.setAttribute(this.svg, 'width', this.state.svgState.width.toString());
    this.renderer.setAttribute(this.svg, 'height', this.state.svgState.height.toString());
    this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
  }

  createPath(): void {
    this.svg = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(this.svg, 'stroke-width', '1');
    this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
    this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.firstColor.hex());
    this.renderer.setAttribute(this.svg, 'stroke-linecap', 'square');
    this.renderer.setAttribute(this.svg, 'stroke-linejoin', 'square');
    this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
  }

  pointsToString(points: Uint8Array): string {
    let result = '';
    for (let i = 0; i < this.state.svgState.height; i++) {
      for (let j = 0; j < this.state.svgState.width; j++) {
        if (points[i * this.state.svgState.width + j]) {
          result = result.concat(`M ${j} ${i} v 1`);
        }
      }
    }
    return result;
  }
}
