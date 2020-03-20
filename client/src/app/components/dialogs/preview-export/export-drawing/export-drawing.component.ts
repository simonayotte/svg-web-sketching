import { Component, OnInit } from '@angular/core';
import { DrawState } from 'src/app/state/draw-state';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { DrawStore } from 'src/app/store/draw-store';
import { MatDialogRef } from '@angular/material';
import { PreviewImageComponent } from '../../preview-image/preview-image.component';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})
export class ExportDrawingComponent implements OnInit {
  dataURL: string;
  state:DrawState;
  buttonDisabled = false;
  previewHeight:number;
  previewWidth:number;
  constructor(private drawingHandler:DrawingHandler, private store:DrawStore, public dialogRef:MatDialogRef<PreviewImageComponent>) { 
    this.drawingHandler.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));
    this.drawingHandler.previewWidthObs.subscribe((previewWidth: number) => (this.previewWidth = previewWidth));
    this.drawingHandler.previewHeightObs.subscribe((previewHeight: number) => (this.previewHeight = previewHeight));
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
  }

  ngOnInit() {
  }

}
