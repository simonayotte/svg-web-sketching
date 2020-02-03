import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DrawStateService } from '../../services/draw-state/draw-state.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-drawing',
  templateUrl: './create-drawing.component.html',
  styleUrls: ['./create-drawing.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
  }
})
export class CreateDrawingComponent implements OnInit { 

private isWidthModified:boolean = false;
private isHeightModified:boolean = false; 
private isRGB:boolean = false;
private isHEX:boolean = true;
constructor(public drawStateService:DrawStateService,public dialogRef:MatDialogRef<CreateDrawingComponent>) { }
  drawingForm = new FormGroup({
    width: new FormControl('width', [Validators.required,Validators.min(0)]),
    height: new FormControl('height',[Validators.required,Validators.min(0)]),
    hex : new FormControl('hex',[Validators.pattern('#[0-9a-fA-F]{6}')]),
    rgb : new FormControl('rgb',[Validators.pattern('[(][0-2]*[0-5]{0,2},[0-2]*[0-5]{0,2},[0-2]*[0-5]{0,2}[)]')]),
    backgroundColor: new FormControl('')
  })
  get width() { return this.drawingForm.get('width'); }
  get height() { return this.drawingForm.get('height'); }
  get rgb() { return this.drawingForm.get('rgb'); }
  get hex() { return this.drawingForm.get('hex'); }

  resetFields(){
    this.drawingForm.reset();
    this.isWidthModified=false;
    this.isHeightModified=false;
  }
  onSubmit() {
    this.drawStateService.setCanvasWidth(this.drawingForm.controls['width'].value - 52);
    this.drawStateService.setCanvasHeight(this.drawingForm.controls['height'].value);
    this.drawStateService.setCanvasColor(this.drawingForm.controls['backgroundColor'].value);
    this.closeDialog();
    this.resetFields();
  }

  onResize(){
    if (!this.isWidthModified){
      this.drawingForm.patchValue({width: window.innerWidth});
    }
    if (!this.isHeightModified){
      this.drawingForm.patchValue({height: window.innerHeight});
    }
  }
  //service
  toggleIsWidthChanged(){
    this.isWidthModified = true;
  }
  //service
  toggleIsHeightChanged(){
    this.isHeightModified = true;
  } 
  toggleRGB(){
    this.isHEX = false;
    this.isRGB = true;
  }
  //service
  toggleHEX(){
    this.isRGB = false;
    this.isHEX = true;
  }
  //service
  numberToHex(number:number){
    let hex = number.toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
  };
  //service
  convertRGBtoHEX(r:number,g:number,b:number){
    let red = this.numberToHex(r);
    let green = this.numberToHex(g);
    let blue = this.numberToHex(b);
  return '#'+red+green+blue;
  }
  changeColor(){
    if (this.isHEX){
      this.drawingForm.patchValue({backgroundColor: this.drawingForm.controls['hex'].value})
    }
    else if(this.isRGB){
      let rgbString = this.drawingForm.controls['rgb'].value;
      let pattern = new RegExp('[0-9]{1,3}','g')
      let rgb:string = rgbString.match(pattern);
      let hex = this.convertRGBtoHEX(+rgb[0],+rgb[1],+rgb[2]).toString()
      this.drawingForm.patchValue({backgroundColor: hex})
    }
  }
  ngOnInit() {
    this.drawingForm.patchValue({width: window.innerWidth});
    this.drawingForm.patchValue({height: window.innerHeight});
    this.drawingForm.patchValue({backgroundColor : '#ffffff'});
    this.drawingForm.patchValue({hex : '#ffffff'});
    this.drawingForm.patchValue({rgb:'(255,255,255)'})
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
