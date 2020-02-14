import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';

const SIDEBAR_WIDTH = 52;

@Component({
  selector: 'app-create-drawing',
  templateUrl: './create-drawing.component.html',
  styleUrls: ['./create-drawing.component.scss']
})
export class CreateDrawingComponent implements OnInit {
isWidthModified = false;
isHeightModified = false;
isFormColorWindowOpen = false;
private widthString = 'width';
private heightString = 'height'
private canvasContext: CanvasRenderingContext2D;
private canvasWidth: number;
private canvasHeight: number;
private selectedCanvasColor: string;
constructor(private drawStateService: DrawStateService,
            private colorService: ColorService,
            public dialogRef: MatDialogRef<CreateDrawingComponent>) {
  this.drawStateService.canvasContextObs.subscribe((canvasContext: CanvasRenderingContext2D) => {
    this.canvasContext = canvasContext;
});
  this.drawStateService.canvasWidthObs.subscribe((canvasWidth) => {
    this.canvasWidth = canvasWidth;
});
  this.drawStateService.canvasHeightObs.subscribe((canvasHeight) => {
    this.canvasHeight = canvasHeight;
});
  this.colorService.isFormColorWindowOpenObs.subscribe((isFormColorWindowOpen) => {
    this.isFormColorWindowOpen = isFormColorWindowOpen
});
  this.colorService.selectedCanvasColorObs.subscribe((selectedCanvasColor) => {
    this.selectedCanvasColor = selectedCanvasColor;
});
}
  drawingForm = new FormGroup({
    width: new FormControl('width', [Validators.required, Validators.min(0)]),
    height: new FormControl('height', [Validators.required, Validators.min(0)]),
  })
  get width() { return this.drawingForm.get('width'); }
  get height() { return this.drawingForm.get('height'); }

  onSubmit(): void {
    this.dialogRef.close()
    this.drawStateService.setCanvasWidth(this.drawingForm.controls[this.widthString].value - SIDEBAR_WIDTH);
    this.drawStateService.setCanvasHeight(this.drawingForm.controls[this.heightString].value);
    this.colorService.setCanvasColor(this.selectedCanvasColor);
    this.drawStateService.setIsDrawingStarted(false);
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.colorService.setIsFormSubmitted(true);
    }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isWidthModified) {
      this.drawingForm.patchValue({width: window.innerWidth});
    }
    if (!this.isHeightModified) {
      this.drawingForm.patchValue({height: window.innerHeight});
    }
  }

  setIsWidthChangedToTrue(): void {
    this.isWidthModified = true;
  }

  setIsHeightChangedToTrue(): void {
    this.isHeightModified = true;
  }

  openColorWindow(): void {
      if (!this.isFormColorWindowOpen) {
        this.colorService.openFormColorWindow('canvas')
      }
  }

  ngOnInit() {
    this.drawingForm.patchValue({width: window.innerWidth});
    this.drawingForm.patchValue({height: window.innerHeight});
    this.colorService.setSelectedCanvasColor('#ffffffff');
    this.isWidthModified = false;
    this.isHeightModified = false;
  }
}
