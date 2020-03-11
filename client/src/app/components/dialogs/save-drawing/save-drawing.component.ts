import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material'
import { PreviewImageComponent } from 'src/app/components/dialogs/preview-image/preview-image.component'
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';

const NAME_STRING = 'name';
const TAGS_STRING = 'tags';

@Component({
  selector: 'app-save-drawing',
  templateUrl: './save-drawing.component.html',
  styleUrls: ['./save-drawing.component.scss']
})
export class SaveDrawingComponent implements OnInit {
  tagStringArray: Array<string> = [];
  isPreviewWindowOpened: boolean = false;
  state:DrawState;
  destCtx:CanvasRenderingContext2D | null;
 
  
  constructor(private fb:FormBuilder, private saveDrawingService:SaveDrawingService, private dialog: MatDialog, private store:DrawStore) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  });
  };

  saveDrawingForm = this.fb.group({
    name : ['', Validators.required],
    tags : this.fb.array([])
   })
  get name() { return this.saveDrawingForm.get(NAME_STRING); }
  get tags() { return this.saveDrawingForm.get(TAGS_STRING) as FormArray;}
  ngOnInit() {
    this.state.globalState.isKeyHandlerActive = false;
  }

  ngOnDestroy() {
    this.state.globalState.isKeyHandlerActive = true;
  }

  addTag(): void {
    if(this.tags.valid){
      this.tags.push(this.fb.control([''] ,[Validators.required, Validators.pattern('[A-Za-z0-9-^\S*$]+')]))
    }
  }

  removeTag(index:number): void {
      this.tags.removeAt(index);
  }

  getTagsValues(): void{
    for(let i = 0; i < this.tags.length; i++){
      this.tagStringArray.push(this.tags.at(i).value)
    }
  }
  /*We set the canvas background by modifying its css, but when calling toDataURL on the canvas, 
  the background color is not taken since its not part of the image data, only of the DOM styling*/
  setImgBackgroundColor():string{
    //Code taken from https://stackoverflow.com/questions/18609715/html5-canvas-todataurl-image-has-no-background-color
    let destinationCanvas:HTMLCanvasElement = document.createElement("canvas");
    destinationCanvas.width = this.state.canvasState.canvas.width;
    destinationCanvas.height = this.state.canvasState.canvas.height;

    this.destCtx = destinationCanvas.getContext('2d');

    //create a rectangle with the desired color
    if(this.destCtx != null){
      this.destCtx.fillStyle = this.state.colorState.canvasColor.hex();
      this.destCtx.fillRect(0,0,this.state.canvasState.canvas.width,this.state.canvasState.canvas.height);

      //draw the original canvas onto the destination canvas
      this.destCtx.drawImage(this.state.canvasState.canvas, 0, 0);
    }
    //finally use the destinationCanvas.toDataURL() method to get the desired output;
    return destinationCanvas.toDataURL();
  }


  
  onSubmit(): void {
    this.saveDrawingService.setDataURL(this.setImgBackgroundColor());
    this.saveDrawingService.setImgName(this.saveDrawingForm.controls[NAME_STRING].value);
    this.getTagsValues();
    this.saveDrawingService.setTags(this.tagStringArray);
    this.dialog.open(PreviewImageComponent);
  }
}
