import { Injectable, RendererFactory2 } from '@angular/core';
import { Color } from 'src/app/models/color';
import { Coordinate } from 'src/app/models/coordinate';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

const MAXIMUM_TOLERANCE = 100;
const MAXIMUM_PIXEL_COLOR_VALUE = 255;
const PIXEL_SIZE = 4;
@Injectable({
  providedIn: 'root'
})
export class BucketService extends Tool {
  ctx: CanvasRenderingContext2D;
  isFilling: boolean;

  constructor(private store: DrawStore, rendererFactory: RendererFactory2) {
    super();
    this.isFilling = false;

    this.store.stateObs.subscribe((value: DrawState) => {
        this.state = value;
    });

    this.renderer = rendererFactory.createRenderer(null, null);
  }

  start(event: MouseEvent): void {
    this.ctx = this.createHTMLCanvas(this.state.svgState.width, this.state.svgState.height);
    this.isFilling = true;
    this.fillCanvas(this.state.svgState.drawSvg, event);
  }

  stop(): void {
    if (this.isFilling) {
      this.store.pushSvg(this.svg);
      this.renderer.removeChild(this.state.svgState.drawSvg, this.svg);
      this.isFilling = false;
    }
    this.stopSignal();
  }

  colorArea(mouseX: number, mouseY: number, svgWidth: number, svgHeight: number): void {
    if (this.state.tolerance === MAXIMUM_TOLERANCE) {
      this.fillEntireSVG();
    } else {
      this.createPath();
      const unverifiedPixels: Coordinate[] = [];
      const verifiedPixels = new Uint8Array(svgWidth * svgHeight);
      const pixelsToColor = new Uint8Array(svgWidth * svgHeight);
      unverifiedPixels.push(new Coordinate(mouseX, mouseY));
      const imageData = this.ctx.getImageData(0, 0, svgWidth, svgHeight);
      const color = this.getPixelColor(mouseX, mouseY, imageData);

      while (unverifiedPixels.length > 0) {
        const currentPixel = unverifiedPixels.pop();

        if (currentPixel !== undefined) {
          if (currentPixel.pointX >= 0 && currentPixel.pointX <= svgWidth && currentPixel.pointY >= 0 && currentPixel.pointY <= svgHeight) {
            const currentPixelColor = this.getPixelColor(currentPixel.pointX, currentPixel.pointY, imageData);
            if (!verifiedPixels[currentPixel.pointY * svgWidth + currentPixel.pointX] &&
                this.checkColor(currentPixelColor, color, this.state.tolerance)) {
              pixelsToColor[currentPixel.pointY * svgWidth + currentPixel.pointX] = 1;

              unverifiedPixels.push(new Coordinate(currentPixel.pointX + 1, currentPixel.pointY));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX - 1, currentPixel.pointY));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX, currentPixel.pointY + 1));
              unverifiedPixels.push(new Coordinate(currentPixel.pointX, currentPixel.pointY - 1));
            }
          }
          verifiedPixels[currentPixel.pointY * svgWidth + currentPixel.pointX] = 1;
        }
      }

      this.renderer.setAttribute(this.svg, 'd', this.pointsToString(pixelsToColor, svgWidth, svgHeight));
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

  // Draw all svg in created canvas
  // Source: https://stackoverflow.com/questions/3768565/drawing-an-svg-file-on-a-html5-canvas
  fillCanvas(svg: SVGSVGElement, event: MouseEvent): void {
    const img = new Image();
    const xml = new XMLSerializer().serializeToString(svg);

    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';

    const image64 = b64Start + svg64;

    img.onload = () => {
        if (this.ctx) {
            this.ctx.drawImage(img, 0, 0);
            this.colorArea(event.offsetX, event.offsetY, this.state.svgState.width, this.state.svgState.height);
        }
    };

    img.src = image64;
  }

  getPixelColor(posX: number, posY: number, imageData: ImageData): Color {
    const data: Uint8ClampedArray = imageData.data.slice((posY * imageData.width + posX) * PIXEL_SIZE,
                                                         (posY * imageData.width + posX) * PIXEL_SIZE + PIXEL_SIZE);
    // tslint:disable-next-line:no-magic-numbers
    return new Color(data[0], data[1], data[2], data[3]);
  }

  checkColor(pixelColor: Color, primaryColor: Color, tolerance: number): boolean {
    const diff = (MAXIMUM_PIXEL_COLOR_VALUE * tolerance) / MAXIMUM_TOLERANCE;
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
    this.renderer.setAttribute(this.svg, 'stroke-width', '3');
    this.renderer.setAttribute(this.svg, 'fill', this.state.colorState.firstColor.hex());
    this.renderer.setAttribute(this.svg, 'stroke', this.state.colorState.firstColor.hex());
    this.renderer.setAttribute(this.svg, 'stroke-linecap', 'square');
    this.renderer.setAttribute(this.svg, 'stroke-linejoin', 'square');
    this.renderer.appendChild(this.state.svgState.drawSvg, this.svg);
  }

  // Translate the array of points to color into a SVG path element
  pointsToString(points: Uint8Array, width: number, height: number): string {
    let result = '';
    for (let i = 0; i <= height; i++) {
      for (let j = 0; j <= width; j++) {
        if (points[i * width + j]) {
          result = result.concat(`M ${j} ${i}`);
          let endOfLine = this.nextPixel(points, i, j, width);
          // Find the position of the rightmost connected pixel
          while (endOfLine !== this.nextPixel(points, endOfLine, i, width)) {
            endOfLine = this.nextPixel(points, endOfLine, i, width);
          }
          result = result.concat(`L ${endOfLine + 1} ${i}`);
          j = endOfLine;
        }
      }
    }
    return result;
  }

  // return the position of the next right pixel to color
  nextPixel(points: Uint8Array, x: number, y: number, width: number): number {
    if (x + 1 < width) {
      return points[y * width + x + 1] ? x + 1 : x;
    } else {
      return x;
    }
  }
}
