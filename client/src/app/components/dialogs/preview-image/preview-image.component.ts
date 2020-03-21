import { Component, OnInit } from '@angular/core';
import { SaveDrawingService } from 'src/app/services/save-drawing-service/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { MatDialogRef } from '@angular/material';
import { Drawing } from '../../../../../../common/models/drawing';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { HttpService } from 'src/app/services/http-service/http.service';

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
  constructor(private saveDrawingService:SaveDrawingService, private store:DrawStore, public dialogRef:MatDialogRef<PreviewImageComponent>,
    private drawingHandler: DrawingHandler,
    private httpService:HttpService) { 
    this.saveDrawingService.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));
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

  
  async saveDrawing() {
    this.buttonDisabled = true;
    let drawing = new Drawing(this.saveDrawingService.getImgName(), this.saveDrawingService.getTags(), this.saveDrawingService.getDataURL());
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
