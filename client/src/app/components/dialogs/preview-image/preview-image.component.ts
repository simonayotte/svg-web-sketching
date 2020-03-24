import { Component, OnInit } from '@angular/core';
import { SaveDrawingService } from 'src/app/services/save-drawing-service/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { MatDialogRef } from '@angular/material';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { SavedDrawing } from 'src/app/models/saved-drawing';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss']
})

export class PreviewImageComponent implements OnInit {
  dataURL: string;
  state:DrawState;
  buttonDisabled = false;
  previewHeight:number;
  previewWidth:number;
  svgsHTML:Array<string> = [];
  constructor(private saveDrawingService:SaveDrawingService, private store:DrawStore, public dialogRef:MatDialogRef<PreviewImageComponent>,
    private drawingHandler: DrawingHandler,
    private httpService:HttpService) { 
    this.drawingHandler.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));
    this.drawingHandler.previewWidthObs.subscribe((previewWidth: number) => (this.previewWidth = previewWidth));
    this.drawingHandler.previewHeightObs.subscribe((previewHeight: number) => (this.previewHeight = previewHeight));
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
  }
  ngOnInit() {
    this.drawingHandler.setPreviewImgWidth();
    this.drawingHandler.setPreviewImgHeight();
    this.state.globalState.isKeyHandlerActive = false;
  }

  ngOnDestroy() {
    this.state.globalState.isKeyHandlerActive = true;
  }

  getSvgsHTML(){
    for (let svg of this.state.svgState.svgs){
      this.svgsHTML.push(svg.outerHTML);
    }
  }

  async saveDrawing() {
    this.getSvgsHTML();
    console.log(this.svgsHTML)
    this.buttonDisabled = true;
    let canvasColor = this.state.colorState.canvasColor;
    let drawing = new SavedDrawing(this.saveDrawingService.getImgName(), 
    this.saveDrawingService.getTags(), 
    this.dataURL, 
    this.svgsHTML, 
    this.state.svgState.width, 
    this.state.svgState.height,
    [canvasColor.r,canvasColor.g,canvasColor.b,canvasColor.a]);
    this.httpService.saveDrawing(drawing).toPromise().then(
    data => {
      this.dialogRef.close();
      alert(data.message)
      this.buttonDisabled = false;

    },
    err => {
      this.dialogRef.close();
      alert(err.message)
      this.buttonDisabled = false;
    })
  }
}
