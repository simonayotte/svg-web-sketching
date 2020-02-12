import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DrawStateService } from '../../services/draw-state/draw-state.service';
import { MatDialogRef } from '@angular/material';
import { ColorService } from 'src/app/services/color/color.service';


const SIDEBAR_WIDTH:number = 52;

@Component({
  selector: 'app-create-drawing',
  templateUrl: './create-drawing.component.html',
  styleUrls: ['./create-drawing.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
  }
})
export class CreateDrawingComponent implements OnInit { 
public isWidthModified:boolean = false;
public isHeightModified:boolean = false;
private isFormColorWindowOpen:boolean = false;
private canvasContext:CanvasRenderingContext2D;
private canvasWidth:number;
private canvasHeight:number;
private selectedCanvasColor:string;
constructor(private drawStateService:DrawStateService,private colorService:ColorService,private dialogRef:MatDialogRef<CreateDrawingComponent>) { 
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
  public drawingForm = new FormGroup({
    width: new FormControl('width', [Validators.required,Validators.min(0)]),
    height: new FormControl('height',[Validators.required,Validators.min(0)]),
  })
  get width() { return this.drawingForm.get('width'); }
  get height() { return this.drawingForm.get('height'); }
  
  onSubmit() : void {
    this.closeDialog();
    this.drawStateService.setCanvasWidth(this.drawingForm.controls['width'].value - SIDEBAR_WIDTH);
    this.drawStateService.setCanvasHeight(this.drawingForm.controls['height'].value);
    this.colorService.setCanvasColor(this.selectedCanvasColor);
    this.drawStateService.setIsDrawingStarted(false);
    this.canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight)
    this.colorService.setIsFormSubmitted(true)
    }

  onResize() : void {
    if (!this.isWidthModified){
      this.drawingForm.patchValue({width: window.innerWidth});
    }
    if (!this.isHeightModified){
      this.drawingForm.patchValue({height: window.innerHeight});
    }
  }

  toggleIsWidthChanged() : void {
    this.isWidthModified = true;
  }
  
  toggleIsHeightChanged() : void {
    this.isHeightModified = true;
  } 
  
  openColorWindow() : void {
      if(!this.isFormColorWindowOpen)
      {
        this.colorService.openFormColorWindow('canvas')
      }
  }

  closeDialog() : void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.drawingForm.patchValue({width: window.innerWidth});
    this.drawingForm.patchValue({height: window.innerHeight});
    this.colorService.setSelectedCanvasColor('#ffffffff');
    this.isWidthModified=false;
    this.isHeightModified=false;
  }
  
}
