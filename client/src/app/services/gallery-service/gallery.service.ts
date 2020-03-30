import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Color } from 'src/app/models/color';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawingHandler } from '../drawing-handler/drawing-handler.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  public state:DrawState;
  private renderer2:Renderer2;

  constructor(private store:DrawStore, private drawingHandler: DrawingHandler, public rendererFactory :RendererFactory2) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
    })
    this.renderer2 = rendererFactory.createRenderer(null, null);
  };

  private drawings: BehaviorSubject<Array<SavedDrawing>> = new BehaviorSubject<Array<SavedDrawing>>([]);
  drawingsObs: Observable<Array<SavedDrawing>> = this.drawings.asObservable();

  private drawingToLoad: BehaviorSubject<SavedDrawing> = new BehaviorSubject<SavedDrawing>(new SavedDrawing('',[],'',[],0,0,[]));
  drawingToLoadObs: Observable<SavedDrawing> = this.drawingToLoad.asObservable();
  
  private didGalleryOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  didGalleryOpenObs: Observable<boolean> = this.didGalleryOpen.asObservable();

  setDrawings(value: Array<SavedDrawing>){
    this.drawings.next(value);
  }

  setDrawingToLoad(value: SavedDrawing){
    this.drawingToLoad.next(value);
  }

  setDidGalleryOpen(value: boolean){
    this.didGalleryOpen.next(value);
  }

  convertHtmlToSvgElement(svgsHTML: Array<string>){
    for( let svgHTML of svgsHTML){
      let svgElement: SVGElement = this.renderer2.createElement('svg','svg');
      this.state.svgState.drawSvg.appendChild(svgElement);
      svgElement.innerHTML = svgHTML;
      this.store.pushSvg(svgElement);
    }
  }

  loadDrawing(drawing:SavedDrawing){
    this.store.setDrawHeight(drawing.height);
    this.store.setDrawWidth(drawing.width);
    let canvasColor = new Color(drawing.RGBA[0],drawing.RGBA[1],drawing.RGBA[2],drawing.RGBA[3])
    this.store.setCanvasColor(canvasColor);
    this.drawingHandler.clearCanvas();
    this.convertHtmlToSvgElement(drawing.svgsHTML);
  }

  filterDrawings(tagStringArray: Array<string>, allDrawingsInDb: Array<SavedDrawing>): Array<SavedDrawing>{
    let filteredDrawings:Array<SavedDrawing> = [];
    for (let drawing of allDrawingsInDb){
      for (let tag of tagStringArray){
        if(drawing.tags.includes(tag) && !filteredDrawings.includes(drawing)){
          filteredDrawings.push(drawing);
        }
      }
    }
    this.setDrawings(filteredDrawings);
    return filteredDrawings;
  }
}
