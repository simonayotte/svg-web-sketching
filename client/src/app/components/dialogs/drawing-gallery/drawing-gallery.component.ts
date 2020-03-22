import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Drawing } from '../../../../../../common/models/drawing';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

@Component({
  selector: 'app-drawing-gallery',
  templateUrl: './drawing-gallery.component.html',
  styleUrls: ['./drawing-gallery.component.scss']
})
export class DrawingGalleryComponent implements OnInit {
  private state:DrawState
  private drawings: Array<Drawing> = [];
  private trashColor:string = 'black'
  private deleteActivated:boolean = false;
  constructor(private httpService: HttpService, private store:DrawStore) {
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

  async deleteDrawing(drawing:Drawing){
    if(this.deleteActivated){
      this.httpService.deleteDrawing(drawing._id).toPromise().then(data => {
        alert(data.message);
        this.updateGallery();

      },
      err => alert(err.message))
      this.updateGallery();

    }
  }

}
