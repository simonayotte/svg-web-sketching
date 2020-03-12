import { Component, OnInit } from '@angular/core';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { MatDialogRef } from '@angular/material';
import { Drawing } from '../../../../../../common/models/drawing';

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
  constructor(private saveDrawingService:SaveDrawingService, private store:DrawStore, public dialogRef:MatDialogRef<PreviewImageComponent>) { 
    this.saveDrawingService.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));
    this.saveDrawingService.previewWidthObs.subscribe((previewWidth: number) => (this.previewWidth = previewWidth));
    this.saveDrawingService.previewHeightObs.subscribe((previewHeight: number) => (this.previewHeight = previewHeight));
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
  }
  ngOnInit() {
    this.saveDrawingService.setPreviewImgWidth();
    this.saveDrawingService.setPreviewImgHeight();
    this.state.globalState.isKeyHandlerActive = false;
  }

  ngOnDestroy() {
    this.state.globalState.isKeyHandlerActive = true;
  }

  saveDrawing() {
    this.buttonDisabled = true;
    let drawing = new Drawing(this.saveDrawingService.getImgName(), this.saveDrawingService.getTags(), this.saveDrawingService.getDataURL());
    this.saveDrawingService.saveDrawing(drawing).subscribe(data => alert(data.message),
    err => alert(err.message))
    this.buttonDisabled = false;
    this.dialogRef.close();
  }
}
