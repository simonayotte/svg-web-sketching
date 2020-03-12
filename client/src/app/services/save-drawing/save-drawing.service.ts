import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Drawing } from '../../../../../common/models/drawing'
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from 'src/app/models/httpResponse';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';

const SERVER_URL: string = 'http://localhost:3000/savedrawing'
const DEFAULT_IMG_PREVIEW_SIZE: number = 300;

@Injectable({
  providedIn: 'root'
})
export class SaveDrawingService {
  state:DrawState
  destCtx:CanvasRenderingContext2D | null;
  private previewWidth: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  previewWidthObs: Observable<number> = this.previewWidth.asObservable();

  private previewHeight: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  previewHeightObs: Observable<number> = this.previewHeight.asObservable();

  private dataURL: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dataURLObs: Observable<string> = this.dataURL.asObservable();

  private imgName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  imgNameObs: Observable<string> = this.imgName.asObservable();

  private tags: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  tagsObs: Observable<Array<string>> = this.tags.asObservable()

  constructor(private http:HttpClient, private store:DrawStore) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
   }

  setDataURL(dataURL:string): void{
    this.dataURL.next(dataURL);
  }

  setImgName(imgName:string): void{
    this.imgName.next(imgName);
  }

  setTags(tags:Array<string>): void{
    this.tags.next(tags);
  }

  getDataURL():string{
    return this.dataURL.value;
  }

  getImgName():string{
    return this.imgName.value;
  }

  getTags():Array<string>{
    return this.tags.value;
  }

  getPreviewWidth():number{
    return this.previewWidth.value;
  }

  getPreviewHeight():number{
    return this.previewHeight.value;
  }

  saveDrawing(drawing:Drawing){
    return this.http.post<HttpResponse>(SERVER_URL, drawing)
  }

  setPreviewImgWidth() {
    if(this.state.canvasState.width < DEFAULT_IMG_PREVIEW_SIZE){
      this.previewWidth.next(this.state.canvasState.canvas.width);
    }
    else{
    let width_height_ratio = this.state.canvasState.canvas.width/this.state.canvasState.canvas.height;
    width_height_ratio > 1? this.previewWidth.next(DEFAULT_IMG_PREVIEW_SIZE):
                            this.previewWidth.next(DEFAULT_IMG_PREVIEW_SIZE*width_height_ratio)
    }                
  }

  setPreviewImgHeight() {
    if(this.state.canvasState.height < DEFAULT_IMG_PREVIEW_SIZE){
      this.previewHeight.next(this.state.canvasState.canvas.height);
    }
    else{
    let width_height_ratio = this.state.canvasState.canvas.width/this.state.canvasState.canvas.height;
    width_height_ratio > 1? this.previewHeight.next(DEFAULT_IMG_PREVIEW_SIZE/width_height_ratio):
                            this.previewHeight.next(DEFAULT_IMG_PREVIEW_SIZE)                
    }
  }

   /*We set the canvas background by modifying its css, but when calling toDataURL on the canvas, 
  the background color is not taken since its not part of the image data, only of the DOM styling*/
  setImgBackgroundColor():string{
    //Code taken from https://stackoverflow.com/questions/18609715/html5-canvas-todataurl-image-has-no-background-color
    let destinationCanvas:HTMLCanvasElement = document.createElement("canvas");
    destinationCanvas.width = this.state.canvasState.canvas.width;
    destinationCanvas.height = this.state.canvasState.canvas.height;

    this.destCtx = destinationCanvas.getContext('2d');

    //create a rectangle with the desired color
    if(this.destCtx != null){
      this.destCtx.fillStyle = this.state.colorState.canvasColor.hex();
      this.destCtx.fillRect(0,0,this.state.canvasState.canvas.width,this.state.canvasState.canvas.height);

      //draw the original canvas onto the destination canvas
      this.destCtx.drawImage(this.state.canvasState.canvas, 0, 0);
    }
    //finally use the destinationCanvas.toDataURL() method to get the desired output;
    return destinationCanvas.toDataURL();
  }
}

