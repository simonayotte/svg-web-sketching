import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { FileTypes } from 'src/app/models/enums';

// we do not want the img preview width and height to exceed 300px.
const MAX_IMG_PREVIEW_SIZE = 300;
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

  /*Theses functions are used when a preview of the image to be saved or exported is shown, it is used to make an image
  with dimensions that are proportional with the canvas*/
  setPreviewImgWidth() {
    if (this.state.svgState.width < MAX_IMG_PREVIEW_SIZE) {
      this.previewWidth.next(this.state.svgState.width);
    } else {
    const width_height_ratio = this.state.svgState.width / this.state.svgState.height;
    width_height_ratio > 1 ? this.previewWidth.next(MAX_IMG_PREVIEW_SIZE) :
                            this.previewWidth.next(MAX_IMG_PREVIEW_SIZE * width_height_ratio);
    }
  }

  setPreviewImgHeight() {
    if (this.state.svgState.height < MAX_IMG_PREVIEW_SIZE) {
      this.previewHeight.next(this.state.svgState.height);
    } else {
    const width_height_ratio = this.state.svgState.width / this.state.svgState.height;
    width_height_ratio > 1 ? this.previewHeight.next(MAX_IMG_PREVIEW_SIZE / width_height_ratio) :
                            this.previewHeight.next(MAX_IMG_PREVIEW_SIZE);
    }
  }

  async prepareDrawingExportation(format: string, filter?: string | undefined) {
    if (filter) {
      this.store.setSVGFilter(filter);
      // wait for filter to be applied before saving the drawing
      await wait(1);
    }
    const xml: string = new XMLSerializer().serializeToString(this.state.svgState.drawSvg);
    const svg64: string = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64: string = b64Start + svg64;
    if (format == FileTypes.Svg) {
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

  clearCanvas() {
    this.store.emptySvg();
    this.store.resetUndoRedo()
  }
}
