import { Injectable } from '@angular/core';
import { Tool } from 'src/app/models/tool';
import { DrawState } from 'src/app/state/draw-state';
import { DrawStore } from 'src/app/store/draw-store';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends Tool {
  state: DrawState;
  initialX: number;
  initialY: number;
  shapes: SVGElement[] = [];
  selectedShapes: SVGElement[] = [];
  tempSelectedShapes: SVGElement[] = [];
  hasSelected = false;
  selectMultiple = false;
  isSelecting = false;
  isDeselecting = false;
  singleSelect = false;
  controlKey = false;
  aKey = false;
  encompassingBox: SVGElement;

  private mouseUpListener: EventListener;
  private mouseMoveListener: EventListener;

  constructor(private store: DrawStore) {
    super();
    this.store.stateObs.subscribe((value: DrawState) => {
        this.state = value;
    });
    this.mouseMoveListener = this.continue.bind(this);
    this.mouseUpListener = this.stop.bind(this);
}

  handleKeyDown(key: string): void {
    if (key === 'Control') {
      this.controlKey = true;
    }
    if (key === 'a') {
      this.aKey = true;
    }
    if (this.controlKey && this.aKey) {
      this.selectedShapes = this.shapes;
      if (this.selectedShapes[0]) { this.drawEncompassingBox(this.selectedShapes); }
    }
  }

  handleKeyUp(key: string): void {
    if (key === 'Control') {
      this.controlKey = false;
    }
    if (key === 'a') {
      this.aKey = false;
    }
  }

  start(event: MouseEvent) {
      this.singleSelect = true;
      this.initialX = event.offsetX;
      this.initialY = event.offsetY;
      this.shapes = this.state.svgState.svgs;

      // ---------------test
      let test = this.shapes[0].getBoundingClientRect();
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.svg.setAttribute('stroke-width', this.state.globalState.thickness.toString());
        this.state.svgState.drawSvg.appendChild(this.svg);
        this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
        this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());
        this.svg.setAttributeNS(null, 'x', (test.left).toString());
        this.svg.setAttributeNS(null, 'y', (test.top).toString());
        this.svg.setAttributeNS(null, 'height', test.height.toString());
        this.svg.setAttributeNS(null, 'width', test.width.toString());
      // ---------------test

      this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
      this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
      if ( event.button == 0 ) { // left click
          this.isSelecting = true;
          this.isDeselecting = false;
       } else if (event.button == 2 && !this.isDeselecting) { // right click
         this.isDeselecting = true;
         this.isSelecting = false;
         this.tempSelectedShapes = this.selectedShapes.slice();
      }
  }

  continue(event: MouseEvent): void {
    this.singleSelect = false;
    this.drawSelectionRectangle(this.initialX, this.initialY, event.offsetX - this.initialX, event.offsetY - this.initialY);

    if ( this.isSelecting ) {
      this.selectedShapes = this.findMultipleShapes(this.shapes, this.initialX, this.initialY, event.offsetX, event.offsetY);
    } 
    else if ( this.isDeselecting ) {
      this.reverseSelection(event.offsetX, event.offsetY);
    }
    if (this.selectedShapes[0]) { this.drawEncompassingBox(this.selectedShapes); }
  }

  stop() {
    if ( this.singleSelect ) {
      if ( this.isSelecting ) {
        //this.selectedShapes = [this.findSingleShape(this.initialX, this.initialY, this.selectedShapes)];
      } else if ( this.isDeselecting ) {
        // let shapeToRemove = this.findSingleShape(this.initialX, this.initialY, this.selectedShapes);
        //this.selectedShapes.splice(this.selectedShapes.indexOf(shapeToRemove), 1);
      }
    }
    this.isSelecting = false;
    this.isDeselecting = false;
    if (this.selectedShapes[0]) { this.drawEncompassingBox(this.selectedShapes); }
    // this.state.svgState.drawSvg.removeChild(this.svg);
    this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
    this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
  }

  findSingleShape( positionX: number, positionY: number, shapes: SVGElement[]): void {
    //let shape: SVGElement = new SVGElement();
    //return shape;
  }

  // Check which shapes are inside the given selection rectangle
  findMultipleShapes(shapes: SVGElement[], startX: number, startY: number, endX: number, endY: number): SVGElement[] {
    let Aleft   = startX > endX ? endX : startX;
    let Aright  = startX > endX ? startX : endX;
    let Atop    = startY > endY ? endY : startY;
    let Abottom = startY > endY ? startY : endY;
    let selectedShapes: SVGElement[] = [];
    for (let i = 0; i < shapes.length; i++) {
      let shape = shapes[i];
      let boundingRect = shape.getBoundingClientRect()
      let Bleft   = boundingRect.left > boundingRect.right ? boundingRect.right : boundingRect.left;
      let Bright  = boundingRect.left > boundingRect.right ? boundingRect.left : boundingRect.right;
      let Btop    = boundingRect.top > boundingRect.bottom ? boundingRect.bottom : boundingRect.top;
      let Bbottom = boundingRect.top > boundingRect.bottom ? boundingRect.top : boundingRect.bottom;
      if (Aleft < Bright && Aright > Bleft && Atop < Bbottom && Abottom > Btop) {
        selectedShapes.push(shape);
      }
    }
    return selectedShapes;
  }

  reverseSelection(mouseX: number, mouseY: number) {
    this.selectedShapes = this.tempSelectedShapes.slice();
      let shapesToRemove = this.findMultipleShapes(this.shapes, this.initialX, this.initialY, mouseX, mouseY);
      if (this.selectedShapes[0] && shapesToRemove[0]) { 
        for (let i = 0; i < shapesToRemove.length; i++) {
          for (let j = 0; j < this.selectedShapes.length; j++) {
            if (shapesToRemove[i] == this.selectedShapes[j]) {
              this.selectedShapes.splice(j, 1);
            }
          }
        }
      }
  }

  drawSelectionRectangle(startX: number, startY: number, width: number, height: number) {
    // this.state.canvasState.ctx.beginPath();
    // this.state.canvasState.ctx.globalAlpha = 0.2;
    // this.state.canvasState.ctx.setLineDash([5]);
    // this.state.canvasState.ctx.rect(startX, startY, width, height);
    // this.state.canvasState.ctx.fill();
    // this.state.canvasState.ctx.globalAlpha = 1.0;1
    // this.state.canvasState.ctx.stroke();
    // this.state.canvasState.ctx.setLineDash([0]);
  }

  drawEncompassingBox(shapes: SVGElement[]) {
    console.log(this.selectedShapes);
  //   let startX = shapes[0].startSelectX;
  //   let startY = shapes[0].startSelectY;
  //   let endX = shapes[0].endSelectX;
  //   let endY = shapes[0].endSelectY;
  //   for (let i = 0; i < shapes.length; i++) {
  //     if (startX > shapes[i].startSelectX) { startX = shapes[i].startSelectX; }
  //     if (startY > shapes[i].startSelectY) { startY = shapes[i].startSelectY; }
  //     if (endX < shapes[i].endSelectX) { endX = shapes[i].endSelectX; }
  //     if (endY < shapes[i].endSelectY) { endY = shapes[i].endSelectY; }
  //   }
  //   this.state.canvasState.ctx.beginPath();
  //   this.state.canvasState.ctx.setLineDash([5]);
  //   this.state.canvasState.ctx.rect(startX, startY, endX - startX, endY - startY);
  //   this.state.canvasState.ctx.stroke();
  //   this.state.canvasState.ctx.setLineDash([0]);
  }
}
