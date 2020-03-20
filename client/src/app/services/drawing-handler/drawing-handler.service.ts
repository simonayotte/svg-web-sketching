import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';

//we do not want the img preview width and height to exceed 300px.
const MAX_IMG_PREVIEW_SIZE: number = 300;

@Injectable({
  providedIn: 'root'
})

export class DrawingHandler {
  private state:DrawState
  private destCtx:CanvasRenderingContext2D | null;
  private imageData:ImageData;
  private data:Uint8ClampedArray;

  private previewWidth: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  previewWidthObs: Observable<number> = this.previewWidth.asObservable();

  private previewHeight: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  previewHeightObs: Observable<number> = this.previewHeight.asObservable();

  constructor(private store:DrawStore) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
  }
  getPreviewWidth():number{
    return this.previewWidth.value;
  }

  getPreviewHeight():number{
    return this.previewHeight.value;
  }


  /*Theses functions is used when a preview of the image to be saved or exported is shown, it is used to make an image 
  with dimensions that are proportional with the canvas*/
  setPreviewImgWidth() {
    if(this.state.canvasState.width < MAX_IMG_PREVIEW_SIZE){
      this.previewWidth.next(this.state.canvasState.canvas.width);
    }
    else{
    let width_height_ratio = this.state.canvasState.canvas.width/this.state.canvasState.canvas.height;
    width_height_ratio > 1? this.previewWidth.next(MAX_IMG_PREVIEW_SIZE):
                            this.previewWidth.next(MAX_IMG_PREVIEW_SIZE*width_height_ratio)
    }                
  }

  setPreviewImgHeight() {
    if(this.state.canvasState.height < MAX_IMG_PREVIEW_SIZE){
      this.previewHeight.next(this.state.canvasState.canvas.height);
    }
    else{
    let width_height_ratio = this.state.canvasState.canvas.width/this.state.canvasState.canvas.height;
    width_height_ratio > 1? this.previewHeight.next(MAX_IMG_PREVIEW_SIZE/width_height_ratio):
                            this.previewHeight.next(MAX_IMG_PREVIEW_SIZE)                
    }
  }

   /*We set the canvas background by modifying its css, but when calling toDataURL on the canvas, 
  the background color is not taken since its not part of the image data, only of the DOM styling
  so in this function, a dummy canvas is created with a rectangle with the canvas color*/
  setImgBackgroundColor(format:string, filter?:string | undefined):string{
    //Code inspired from https://stackoverflow.com/questions/18609715/html5-canvas-todataurl-image-has-no-background-color
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
      this.imageData=this.destCtx.getImageData(0,0,destinationCanvas.width,destinationCanvas.height);
      this.data = this.imageData.data
      if(filter){
        this.brightenFilter();
      }
    }
    //finally use the destinationCanvas.toDataURL() method to get the desired output;
    let dataURL:string = destinationCanvas.toDataURL(`image/${format}`,1.0);
    
    return dataURL;
  }

  applyFilter(filter:string){
    switch (filter){
      case 'invert':
        this.invertFilter();
        break;
      case 'grey':
        this.grayScaleFilter();
        break;
      case 'blackAndWhite':
        this.blackAndWhiteFilter();
        break;
      case 'transparent':
        this.transparentFilter();
        break;
      case 'bright':
        this.brightenFilter();
        break;
    }
  }

  invertFilter(){
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i]     = 255 - this.data[i];     // rouge
      this.data[i + 1] = 255 - this.data[i + 1]; // vert
      this.data[i + 2] = 255 - this.data[i + 2]; // bleu
    }
    if(this.destCtx != null){
      this.destCtx.putImageData(this.imageData, 0, 0);
    }
  }

  grayScaleFilter(){
    for (let i = 0; i < this.data.length; i += 4) {
      let grey = 0.3  * this.data[i] + 0.59 * this.data[i+1] + 0.11 * this.data[i+2];
      this.data[i]     = grey; // rouge
      this.data[i + 1] = grey; // vert
      this.data[i + 2] = grey; // bleu
    }
    if(this.destCtx != null){
      this.destCtx.putImageData(this.imageData, 0, 0);
    }
  }

  blackAndWhiteFilter(){
    for (let i = 0; i < this.data.length; i += 4) {
      let avg = (this.data[i] + this.data[i+1] + this.data[i+2])/3
      avg > 127 ? 
      (this.data[i]     = 255, 
      this.data[i + 1] = 255, 
      this.data[i + 2] = 255):
      (this.data[i]     = 0, 
      this.data[i + 1] = 0, 
      this.data[i + 2] = 0)
    }
    if(this.destCtx != null){
      this.destCtx.putImageData(this.imageData, 0, 0);
    }
  }

  transparentFilter(){
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i+3] = 127;
    }
    if(this.destCtx != null){
      this.destCtx.putImageData(this.imageData, 0, 0);
    }
  }

  brightenFilter(){
    for (var i=0; i<this.data.length; i+=4) {
      this.data[i] = this.data[i] + 50; 
      this.data[i+1] = this.data[i+1] + 50; 
      this.data[i+2] = this.data[i+2] + 50; 
    }
    if(this.destCtx != null){
      this.destCtx.putImageData(this.imageData, 0, 0);
    }
  }
}
