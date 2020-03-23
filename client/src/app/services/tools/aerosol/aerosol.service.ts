import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawStore } from '../../../store/draw-store';
import { DrawState } from 'src/app/state/draw-state';
import { Coordinate } from 'src/app/models/coordinate';


@Injectable({
  providedIn: 'root'
})
export class AerosolService extends Tool {

  state: DrawState;
  points: Coordinate[] = [];
  pixel: SVGCircleElement;

  constructor(private store: DrawStore) { 
      super();
      this.store.stateObs.subscribe((value: DrawState) => {
          this.state = value;
      });
  }

  start(event: MouseEvent) {
      let x = event.offsetX;
      let y = event.offsetY;

      this.drawPixel(x, y);
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.svg.setAttribute('stroke', "");
      this.svg.setAttribute('fill', 'none');
      this.svg.setAttribute('stroke-width', "1");
      this.svg.setAttribute('stroke-linecap', 'round');
      this.svg.setAttribute('stroke-linejoin', 'round');

      //First point of the path
      this.svg.setAttribute('d', `M ${x} ${y} `);
      this.state.svgState.drawSvg.appendChild(this.svg);
      this.points.push(new Coordinate(x, y));
  }

  continue(event: MouseEvent) {
    for (let i = 0; i < 60; i++) {
      this.svg.setAttribute('stroke', this.state.colorState.firstColor.hex());
      let path = this.svg.getAttribute('d') as string;
      let point = this.generateRandomPoint(event.offsetX, event.offsetY);
      //Move to new point and show pixel
      path = path.concat(`M ${point.pointX} ${point.pointY} h 1`);
      this.svg.setAttribute('d', path);
      this.points.push(new Coordinate(event.offsetX, event.offsetY));
    }
  }

  stop() {
  if (this.points.length > 1) {
      this.store.pushSvg(this.svg);
  } else {
      this.store.pushSvg(this.pixel);
  }

  this.points = [];
  this.state.svgState.drawSvg.removeChild(this.pixel);
  this.state.svgState.drawSvg.removeChild(this.svg);
  }

  drawPixel(x: number, y: number) {
    this.pixel = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.pixel.setAttribute('cx', x.toString());
    this.pixel.setAttribute('cy', y.toString());
    this.pixel.setAttribute('r', '1');
    this.pixel.setAttribute('fill', this.state.colorState.firstColor.hex());
    this.state.svgState.drawSvg.appendChild(this.pixel);
  }

  //Returns random point inside the circle
  generateRandomPoint(x: number, y: number) : Coordinate {
    let angle = Math.random()*Math.PI*2;
    let r = Math.random()*Math.pow(this.state.globalState.thickness/2,2);
    return new Coordinate(x + Math.cos(angle)*r, y + Math.sin(angle)*r);
  }

}
