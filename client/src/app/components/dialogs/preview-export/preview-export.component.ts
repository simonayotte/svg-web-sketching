import { Component, OnInit } from '@angular/core';
import { DrawState } from 'src/app/state/draw-state';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { DrawStore } from 'src/app/store/draw-store';
import { MatDialogRef } from '@angular/material';
import { PreviewImageComponent } from '../preview-image/preview-image.component';
import { ExportedDrawing } from 'src/app/models/exported-drawing';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-preview-export',
  templateUrl: './preview-export.component.html',
  styleUrls: ['./preview-export.component.scss']
})
export class PreviewExportComponent implements OnInit {

  dataURL: string;
  state:DrawState;
  buttonDisabled = false;
  previewHeight:number;
  previewWidth:number;
  constructor(private drawingHandler:DrawingHandler, 
    private store:DrawStore, 
    public dialogRef:MatDialogRef<PreviewImageComponent>,
    private exportDrawingService:ExportDrawingService,
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

  exportDrawing() {
    this.buttonDisabled = true;
    let drawing = new ExportedDrawing(this.exportDrawingService.getExportName(), this.exportDrawingService.getType(), this.dataURL)
    this.httpService.exportDrawing(drawing).subscribe(data => alert(data.message),
    err => alert(err.message));
    this.buttonDisabled = false;
    this.dialogRef.close();
  }
}
