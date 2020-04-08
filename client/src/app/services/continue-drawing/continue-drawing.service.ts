import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { DrawingHandler } from '../drawing-handler/drawing-handler.service';
import { DrawStore } from 'src/app/store/draw-store';
import { Color } from 'src/app/models/color';

@Injectable({
  providedIn: 'root'
})
export class ContinueDrawingService {

  private isContinueDrawing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isContinueDrawingObs: Observable<boolean> = this.isContinueDrawing.asObservable();

  constructor(private drawingHandler: DrawingHandler, private store:DrawStore) { }

  setIsContinueDrawing(value :boolean): void {
    this.isContinueDrawing.next(value)
  }

  loadSavedDrawing(): void {
    let drawingJSONString:string | null = localStorage.getItem('Drawing');
    if(drawingJSONString){
        let drawingJSON = JSON.parse(drawingJSONString);
        this.store.setDrawWidth(drawingJSON.width);
        this.store.setDrawHeight(drawingJSON.height);
        let canvasColor = new Color(drawingJSON.canvasColor[0],drawingJSON.canvasColor[1],drawingJSON.canvasColor[2],drawingJSON.canvasColor[3])
        this.store.setCanvasColor(canvasColor);
        let svgArray: SVGGraphicsElement[] = this.drawingHandler.convertHtmlToSvgElement(drawingJSON.svgsHTML);
        this.drawingHandler.clearCanvas();
        setTimeout(()=> this.store.setSvgArray(svgArray));
    }
  }


}
