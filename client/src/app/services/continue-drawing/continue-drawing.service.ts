import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Color } from 'src/app/models/color';
import { DrawingJson } from 'src/app/models/drawing-json';
import { CanvasColorIndex } from 'src/app/models/enums';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawingHandler } from '../drawing-handler/drawing-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ContinueDrawingService {

  private isContinueDrawing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isContinueDrawingObs: Observable<boolean> = this.isContinueDrawing.asObservable();

  constructor(private drawingHandler: DrawingHandler, private store: DrawStore) { }

  setIsContinueDrawing(value: boolean): void {
    this.isContinueDrawing.next(value);
  }

  getIsContinueDrawing(): boolean {
    return this.isContinueDrawing.value;
  }

  loadSavedDrawing(): void {
    const drawingJSONString: string | null = localStorage.getItem('Drawing');
    if (drawingJSONString) {
        const drawingJSON: DrawingJson = JSON.parse(drawingJSONString);
        this.store.setDrawWidth(drawingJSON.width);
        this.store.setDrawHeight(drawingJSON.height);
        const canvasColor = new Color(drawingJSON.canvasColor[CanvasColorIndex.One],
                                      drawingJSON.canvasColor[CanvasColorIndex.Two],
                                      drawingJSON.canvasColor[CanvasColorIndex.Three],
                                      drawingJSON.canvasColor[CanvasColorIndex.Four]);
        this.store.setCanvasColor(canvasColor);
        const svgArray: SVGGraphicsElement[] = this.drawingHandler.convertHtmlToSvgElement(drawingJSON.svgsHTML);
        this.drawingHandler.clearCanvas();
        setTimeout(() => this.store.setSvgArray(svgArray));
    }
  }

}
