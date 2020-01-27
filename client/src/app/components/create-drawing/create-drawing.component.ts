import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DrawingBoardInfo } from '../../drawingboard-info'



@Component({
  selector: 'app-create-drawing',
  templateUrl: './create-drawing.component.html',
  styleUrls: ['./create-drawing.component.scss']
})
export class CreateDrawingComponent implements OnInit {  constructor() { }
color:string = "#ffffff";
drawingBoardInfo:DrawingBoardInfo;
  drawingForm = new FormGroup({
    width: new FormControl('', [Validators.required,Validators.min(0)]),
    height: new FormControl('',[Validators.required,Validators.min(0)]),
    backgroundColor: new FormControl('#ffffff',Validators.required)
  })
  resetFields(){
    this.drawingForm.reset();
  }
  onSubmit() {
    this.drawingBoardInfo = new DrawingBoardInfo(this.drawingForm.controls['width'].value,this.drawingForm.controls['height'].value, this.drawingForm.controls['backgroundColor'].value )
    console.log(this.drawingBoardInfo)
    console.log("Hello")
    this.resetFields();
  }
  updateColor(event:any) {
    this.drawingForm.patchValue({backgroundColor : event})
  }
  ngOnInit() {
  }

}
