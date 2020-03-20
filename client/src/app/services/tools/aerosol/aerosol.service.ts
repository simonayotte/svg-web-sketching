import { Aerosol } from './../../../models/aerosol';
import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Coordinate } from 'src/app/models/coordinate';


@Injectable({
  providedIn: 'root'
})
export class AerosolService implements Tool {

  state: DrawState;
  constructor(private store: DrawStore) {
      this.store.stateObs.subscribe((value: DrawState) => {
          this.state = value;
          if (this.state.canvasState.canvas) {
              this.prepare();
          }
      });
      this.mouseMoveListener = this.continue.bind(this);
      this.mouseUpListener = this.stop.bind(this);
  }

  color: string;
  lastX: number;
  lastY: number;

  private path: Coordinate[] = [];

  private mouseUpListener: EventListener;
  private mouseMoveListener: EventListener;

  prepare() {
      
  }

  handleKeyDown(key: string): void {}

  handleKeyUp(key: string): void {}

  start(event: MouseEvent) {
      
  }

  continue(event: MouseEvent): void {
      
  }

  stop() {
    
  }

  //TODO: Add CreateAerosolElement

  //TODO: Add drawFromAerosolElement

}
