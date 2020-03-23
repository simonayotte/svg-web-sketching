import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { SavedDrawing } from '../../../models/saved-drawing';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';
import { MatDialogRef } from '@angular/material';
import { Color } from 'src/app/models/color';

@Component({
  selector: 'app-drawing-gallery',
  templateUrl: './drawing-gallery.component.html',
  styleUrls: ['./drawing-gallery.component.scss']
})
export class DrawingGalleryComponent implements OnInit {
  private state:DrawState
  private drawings: Array<SavedDrawing> = [];
  private trashColor:string = 'black'
  private deleteActivated:boolean = false;
  constructor(private httpService: HttpService, private store:DrawStore, private dialogRef: MatDialogRef<DrawingGalleryComponent>) {
    this.store.stateObs.subscribe((value: DrawState) => {
      this.state = value;
  })};

  async ngOnInit() {
    this.state.globalState.isKeyHandlerActive = false;
    this.updateGallery();
  }

  ngOnDestroy() {
    this.state.globalState.isKeyHandlerActive = true;
}

  async updateGallery(){
    this.httpService.getAllDrawings().toPromise().then(data => {
      this.drawings = data;
    },
    err => alert(err.message));
  }

  toggleTrashColor(){
    this.trashColor == 'black' ? (this.trashColor = 'red', this.deleteActivated=true)
                        : (this.trashColor = 'black', this.deleteActivated=false);
  }

  async deleteDrawing(drawing:SavedDrawing){
    if(this.deleteActivated){
      this.httpService.deleteDrawing(drawing._id).toPromise().then(data => {
        alert(data.message);
        this.updateGallery();
      },
      err => alert(err.message))
      this.updateGallery();
    }
  }

  loadDrawing(drawing:SavedDrawing){
    this.store.setDrawHeight(drawing.height);
    this.store.setDrawWidth(drawing.width);
    let canvasColor = new Color(drawing.RGBA[0],drawing.RGBA[1],drawing.RGBA[2],drawing.RGBA[3])
    this.store.setCanvasColor(canvasColor);
    console.log(drawing.svgs);
    console.log(this.state.svgState.svgs)
    this.dialogRef.close()
  }

}
