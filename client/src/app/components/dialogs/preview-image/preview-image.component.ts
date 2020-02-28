import { Component, OnInit } from '@angular/core';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss']
})
export class PreviewImageComponent implements OnInit {
  dataURL: string;
  state:DrawState;
  buttonDisabled = false;
  constructor(private saveDrawingService:SaveDrawingService, private store:DrawStore, private dialogRef:MatDialogRef<PreviewImageComponent>) { 
    this.saveDrawingService.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));

    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
  }
  ngOnInit() {
    this.state.globalState.isKeyHandlerActive = false;
  }

  ngOnDestroy() {
    this.state.globalState.isKeyHandlerActive = true;
  }

  saveDrawing() {
    this.buttonDisabled = true;
    this.saveDrawingService.saveDrawing().subscribe(data => alert(data.message),
    err => alert(err.message))
    this.buttonDisabled = false;
    this.dialogRef.close();
  }
}
