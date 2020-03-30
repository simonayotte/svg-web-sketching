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

  //Emission
  //Constant emissionPeriod for getting rid of lag
  emissionPeriod = 50;
  sprayIntervalID: any; //Pour acceder au setInterval du spray pattern

  //Mouse position
  x: number;
  y: number;
  
  constructor(private store: DrawStore) { 
    super();
    this.store.stateObs.subscribe((value: DrawState) => {
        this.state = value;
    });
  }

  start(event: MouseEvent) {
    //Update current mouse position
    this.x = event.offsetX;
    this.y = event.offsetY;
    
    //Styling for SVG
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.svg.setAttribute('stroke', this.state.colorState.firstColor.hex());
    this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
    this.svg.setAttribute('stroke-width', '1');
    this.svg.setAttribute('stroke-linecap', 'round');
    this.svg.setAttribute('stroke-linejoin', 'round');

    this.svg.setAttribute('d', `M ${this.x} ${this.y} `);
    this.state.svgState.drawSvg.appendChild(this.svg);
    this.points.push(new Coordinate(this.x, this.y));

    //Function in interval for calling
    //Interval se fait a chaque 50 pour eviter le lag
    this.sprayIntervalID = setInterval( () => this.spray(), this.emissionPeriod);
  }

  continue(event: MouseEvent) {
    //Update current mouse position
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  stop() {
    clearInterval(this.sprayIntervalID);
    if (this.points.length > 1)
      this.store.pushSvg(this.svg);

    this.points = [];
    this.state.svgState.drawSvg.removeChild(this.svg);
  }

  //Returns random point inside the circle
  generateRandomPoint(x: number, y: number) : Coordinate {
    let angle = Math.random()*Math.PI*2;
    let r = Math.random()*Math.pow(this.state.globalState.thickness/2,2);
    let pointX = x + Math.sqrt(r) * Math.cos(angle);
    let pointY = y + Math.sqrt(r) * Math.sin(angle);
    return new Coordinate(pointX, pointY);
  }

  //Adds a random point inside the SVG path, genere une emission
  generateRandomSprayPoint(x: number, y: number) {
    let density = this.convertEmissionRate();
    for(var i = 0; i < density; i++){
      let path = this.svg.getAttribute('d') as string;
      let point = this.generateRandomPoint(x, y);
      //Move to new point and show pixel
      path = path.concat(`M ${point.pointX} ${point.pointY} h 1`);
      this.svg.setAttribute('d', path);
      this.points.push(new Coordinate(x, y));
    } 
  }

  //Conversion of emissionRate/sec in emissionRate per 50ms
  convertEmissionRate(): number {
    return this.state.emissionRate*0.05/1000 * 10000;
  }

  //Function for calling in setInterval, sprays with correct emissionRate
  spray() {
    this.generateRandomSprayPoint(this.x, this.y);
  }

}
