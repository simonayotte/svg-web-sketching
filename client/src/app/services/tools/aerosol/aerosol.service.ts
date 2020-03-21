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
      this.color = this.state.colorState.firstColor.hex();

      this.state.canvasState.ctx.lineWidth = this.state.globalState.thickness;
      this.state.canvasState.ctx.lineJoin = 'round';
      this.state.canvasState.ctx.lineCap = 'round';
      this.state.canvasState.ctx.fillStyle = this.color;
      this.state.canvasState.ctx.strokeStyle = this.color;

      
  }

  handleKeyDown(key: string): void {}

  handleKeyUp(key: string): void {}

  start(event: MouseEvent) {
    this.prepare();
    this.state.canvasState.canvas.addEventListener('mousemove', this.mouseMoveListener);
    this.state.canvasState.canvas.addEventListener('mouseup', this.mouseUpListener);

  }

  continue(event: MouseEvent): void {
      
  }

  stop() {
    
  }

  

  //TODO: Add CreateAerosolElement

  //TODO: Add drawFromAerosolElement

}
