import { Component, OnInit } from '@angular/core';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { MatDialogRef } from '@angular/material';

const DEFAULT_IMG_PREVIEW_SIZE:number = 300;

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
  constructor(private saveDrawingService:SaveDrawingService, private store:DrawStore, private dialogRef:MatDialogRef<PreviewImageComponent>) { 
    this.saveDrawingService.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));

    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
  }
  ngOnInit() {
    this.setPreviewImgDimension();
    this.state.globalState.isKeyHandlerActive = false;
  }

  ngOnDestroy() {
    this.state.globalState.isKeyHandlerActive = true;
  }

  setPreviewImgDimension() {
    if(this.state.canvasState.canvas.width < DEFAULT_IMG_PREVIEW_SIZE){
      this.previewWidth = this.state.canvasState.canvas.width
    }
    else if(this.state.canvasState.canvas.height < DEFAULT_IMG_PREVIEW_SIZE){
      this.previewWidth = this.state.canvasState.canvas.width
    }
    else{
      let width_height_ratio = this.state.canvasState.canvas.width/this.state.canvasState.canvas.height;
      width_height_ratio > 1? (this.previewWidth = DEFAULT_IMG_PREVIEW_SIZE 
                              , this.previewHeight = DEFAULT_IMG_PREVIEW_SIZE/width_height_ratio):
                              (this.previewHeight = DEFAULT_IMG_PREVIEW_SIZE 
                              , this.previewWidth = DEFAULT_IMG_PREVIEW_SIZE*width_height_ratio);
        }
  }

  saveDrawing() {
    this.buttonDisabled = true;
    this.saveDrawingService.saveDrawing().subscribe(data => alert(data.message),
    err => alert(err.message))
    this.buttonDisabled = false;
    this.dialogRef.close();
  }
}
