import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileTypes } from 'src/app/models/enums';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

// we do not want the img preview width and height to exceed 300px.
const MAX_IMG_PREVIEW_SIZE = 300;
const wait = async (ms: number) => new Promise((res) => setTimeout(res, ms));

@Injectable({
  providedIn: 'root'
})

export class DrawingHandler {
  state: DrawState;
  private renderer2: Renderer2;
  private previewWidth: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  previewWidthObs: Observable<number> = this.previewWidth.asObservable();

  private previewHeight: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  previewHeightObs: Observable<number> = this.previewHeight.asObservable();

  private dataURL: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dataURLObs: Observable<string> = this.dataURL.asObservable();

  constructor(private store: DrawStore, private renderFactory2: RendererFactory2) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
    this.renderer2 = this.renderFactory2.createRenderer(null, null);
  }
  getPreviewWidth(): number {
    return this.previewWidth.value;
  }

  getPreviewHeight(): number {
    return this.previewHeight.value;
  }

  setDataURL(dataURL: string): void {
    this.dataURL.next(dataURL);
  }

  getDataURL(): string {
    return this.dataURL.value;
  }

  /*Functions are used when a preview of the image to be saved or exported is shown, it is used to make an image
  with dimensions that are proportional with the canvas*/
  setPreviewImgWidth(): void {
    if (this.state.svgState.width < MAX_IMG_PREVIEW_SIZE) {
      this.previewWidth.next(this.state.svgState.width);
    } else {
    const widthHeightRatio = this.state.svgState.width / this.state.svgState.height;
    widthHeightRatio > 1 ? this.previewWidth.next(MAX_IMG_PREVIEW_SIZE) :
                            this.previewWidth.next(MAX_IMG_PREVIEW_SIZE * widthHeightRatio);
    }
  }

  setPreviewImgHeight(): void {
    if (this.state.svgState.height < MAX_IMG_PREVIEW_SIZE) {
      this.previewHeight.next(this.state.svgState.height);
    } else {
    const widthHeightRatio = this.state.svgState.width / this.state.svgState.height;
    widthHeightRatio > 1 ? this.previewHeight.next(MAX_IMG_PREVIEW_SIZE / widthHeightRatio) :
                            this.previewHeight.next(MAX_IMG_PREVIEW_SIZE);
    }
  }

  async prepareDrawingExportation(format: string, filter?: string | undefined): Promise<void> {
    if (filter) {
      this.store.setSVGFilter(filter);
      // wait for filter to be applied before saving the drawing
      await wait(1);
    }
    const xml: string = new XMLSerializer().serializeToString(this.state.svgState.drawSvg);
    const svg64: string = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64: string = b64Start + svg64;
    if (format === FileTypes.Svg) {
      this.setDataURL(image64);
    } else {
      const img = new Image();
      img.src = image64;
      img.onload = () => {
        const canvas = this.renderer2.createElement('canvas');
        canvas.width = this.state.svgState.width;
        canvas.height = this.state.svgState.height;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(img, 0, 0);
        this.setDataURL(canvas.toDataURL(`image/${format}`, 1.0));
      };
    }
    // wait for dataURL to be set
    await wait(1);
    this.store.setSVGFilter('');
  }

  convertHtmlToSvgElement(svgsHTML: string[]): SVGGraphicsElement[] {
    const parser = new DOMParser();
    const svgArray = [];
    for (const svgHTML of svgsHTML) {
        const htmlElement = parser.parseFromString(svgHTML, 'image/svg+xml').documentElement;
        const svg: SVGGraphicsElement = this.renderer2.createElement(htmlElement.tagName, 'svg');

        for (let i = 0; i < htmlElement.attributes.length; i++) {
            const attribute = htmlElement.attributes.item(i);
            if (attribute) {
                this.renderer2.setAttribute(svg, attribute.name, attribute.value);
            }
        }
        svgArray.push(svg);
    }
    return svgArray;
  }

  clearCanvas(): void {
    this.store.emptySvg(true);
    this.store.resetUndoRedo();
  }
}
