import { Component, OnInit } from '@angular/core';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawState } from 'src/app/state/draw-state';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss']
})
export class PreviewImageComponent implements OnInit {
  dataURL: string;
  name: string;
  state:DrawState;
  constructor(private saveDrawingService:SaveDrawingService, private store:DrawStore) { 
    this.saveDrawingService.dataURLObs.subscribe((dataURL: string) => (this.dataURL = dataURL));
    this.saveDrawingService.imgNameObs.subscribe((imgName: string) => (this.name = imgName));

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
}
