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
  shapes: Element[] = [];
  selectedShapes: Element[] = [];
  tempSelectedShapes: Element[] = [];
  hasSelected = false;
  selectMultiple = false;
  isSelecting = false;
  isDeselecting = false;
  singleSelect = false;
  controlKey = false;
  aKey = false;
  encompassingBox: SVGElement;
  displayEncompassingBox: boolean = true;
  offset: number;

  private mouseUpListener: EventListener;
  private mouseMoveListener: EventListener;

  constructor(private store: DrawStore) {
    super();
    this.store.stateObs.subscribe((value: DrawState) => {
        this.state = value;
    });
    this.mouseMoveListener = this.continue.bind(this);
    this.mouseUpListener = this.stopSelect.bind(this);
}

  handleKeyDown(key: string): void {
    if (key === 'Control') {
      this.controlKey = true;
    }
    if (key === 'a') {
      this.aKey = true;
    }
    if (this.controlKey && this.aKey) {
      this.selectedShapes = this.shapes.slice();
      if (this.selectedShapes[0]) { 
        this.drawEncompassingBox(this.selectedShapes);
      }
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
      this.shapes = <Element[]>this.state.svgState.svgs;
      this.offset = this.offset; 

      if ( event.button == 0 ) { // left click
          this.isSelecting = true;
          this.isDeselecting = false;
          if (this.encompassingBox) { this.encompassingBox.setAttributeNS(null, 'opacity', '0');
        } else {
            this.createEncompassingBox();
          }
       } else if (event.button == 2 && !this.isDeselecting) { // right click
         this.isDeselecting = true;
         this.isSelecting = false;
         this.tempSelectedShapes = this.selectedShapes.slice();
      }

      this.createSelectionRectangle();

      this.state.svgState.drawSvg.addEventListener('mousemove', this.mouseMoveListener);
      this.state.svgState.drawSvg.addEventListener('mouseup', this.mouseUpListener);
  }

  continue(event: MouseEvent): void {
    this.singleSelect = false;
    this.drawSelectionRectangle(this.initialX, this.initialY, event.offsetX, event.offsetY);

    if ( this.isSelecting ) {
      this.selectedShapes = this.findMultipleShapes(this.shapes, this.initialX, this.initialY, event.offsetX, event.offsetY);
    } 
    else if ( this.isDeselecting ) {
      this.reverseSelection(event.offsetX, event.offsetY);
    }
    if (this.selectedShapes[0]) { this.drawEncompassingBox(this.selectedShapes); }
    else { if (this.encompassingBox) {this.encompassingBox.setAttributeNS(null, 'opacity', '0');}
  }
  }

  stopSelect(event: MouseEvent): void{
    let targetedElement = <Element>event.target;
    if ( this.singleSelect ) {
      this.findSingleShape(targetedElement);
    }
    this.drawEncompassingBox(this.selectedShapes);
    this.stop();
  }

  stop() {
    this.isSelecting = false;
    this.isDeselecting = false;
    if (this.svg) {this.svg.remove();}
    this.state.svgState.drawSvg.removeEventListener('mousemove', this.mouseMoveListener);
    this.state.svgState.drawSvg.removeEventListener('mouseup', this.mouseUpListener);
  }

  // Check which shape is under the mouse cursor
  findSingleShape(targetedElement: Element): void {
    if ( this.isSelecting ) {
      if ( this.shapes.includes(targetedElement) ) {
        this.selectedShapes = [targetedElement];
      }
      else {
        this.selectedShapes = [];
      }
    } else if ( this.isDeselecting ) {
      if ( this.shapes.includes(targetedElement) ) {
      let isPresent = false;
        for (let i = 0; i < this.selectedShapes.length; i++) {
          if ( targetedElement == this.selectedShapes[i]) {
            this.selectedShapes.splice(i, 1);
            isPresent = true;
            break;
          }
        }
        if (!isPresent) {
          this.selectedShapes.push(targetedElement);
        }
      }
    }
  }

  // Check which shapes are inside the given selection rectangle
  findMultipleShapes(shapes: Element[], startX: number, startY: number, endX: number, endY: number): Element[] {
    let Aleft   = startX > endX ? endX : startX;
    let Aright  = startX > endX ? startX : endX;
    let Atop    = startY > endY ? endY : startY;
    let Abottom = startY > endY ? startY : endY;
    let selectedShapes: Element[] = [];
    this.offset = this.state.svgState.drawSvg.getBoundingClientRect().left; 
    for (let i = 0; i < shapes.length; i++) {
      let shape = shapes[i];
      let boundingRect = shape.getBoundingClientRect();
      let thickness = +shapes[i].getAttribute('stroke-width')!/2;
      let Bleft   = boundingRect.left - thickness> boundingRect.right + thickness ? boundingRect.right + thickness : boundingRect.left - thickness;
      let Bright  = boundingRect.left - thickness> boundingRect.right + thickness ? boundingRect.left - thickness : boundingRect.right + thickness;
      let Btop    = boundingRect.top - thickness > boundingRect.bottom + thickness ? boundingRect.bottom + thickness : boundingRect.top - thickness;
      let Bbottom = boundingRect.top - thickness > boundingRect.bottom + thickness ? boundingRect.top - thickness : boundingRect.bottom + thickness;
      if (Aleft < Bright - this.offset && Aright > Bleft - this.offset && Atop < Bbottom && Abottom > Btop) {
        selectedShapes.push(shape);
      }
    }
    return selectedShapes;
  }

  // Find the shapes inside the rectangle drawn by the mouse and inverse their selection state
  reverseSelection(mouseX: number, mouseY: number) {
    let shapeIsSelected;
    this.selectedShapes = this.tempSelectedShapes.slice();
    let shapesToRemove = this.findMultipleShapes(this.shapes, this.initialX, this.initialY, mouseX, mouseY);
    let shapesToAdd: Element[] = [];
    if (this.selectedShapes[0] && shapesToRemove[0]) { 
        for (let i = 0; i < shapesToRemove.length; i++) {
          shapeIsSelected = false;
          for (let j = 0; j < this.selectedShapes.length; j++) {
            if (shapesToRemove[i] == this.selectedShapes[j]) {
              this.selectedShapes.splice(j, 1);
              shapeIsSelected = true;
              break;
            }
          }
          if (!shapeIsSelected) { shapesToAdd.push(shapesToRemove[i]) ;}
        }
    }

    if (shapesToAdd != [] ) {
      for (let i = 0; i < shapesToAdd.length; i++) {
        this.selectedShapes.push(shapesToAdd[i]);
      }
    }
  }

  createSelectionRectangle(): void {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.svg.setAttribute('stroke-width', '1');
    this.svg.setAttribute('fill', this.state.colorState.firstColor.hex()); // TODO no color ?
    this.svg.setAttribute('stroke', 'transparent');
    this.svg.setAttribute('stroke-dasharray', '10');
    this.state.svgState.drawSvg.appendChild(this.svg);
  }

  drawSelectionRectangle(startX: number, startY: number, endX: number, endY: number) {
    this.svg.setAttribute('fill', this.state.colorState.firstColor.hex());
    this.svg.setAttribute('stroke', this.state.colorState.secondColor.hex());

    let height = Math.abs(endY - startY);
    let width = Math.abs(endX - startX);
    let x = endX > startX ? startX : endX;
    let y = endY > startY ? startY : endY;
    this.svg.setAttributeNS(null, 'x', x.toString());
    this.svg.setAttributeNS(null, 'y', y.toString());
    this.svg.setAttributeNS(null, 'height', height.toString());
    this.svg.setAttributeNS(null, 'width', width.toString());
    this.svg.setAttributeNS(null, 'fill-opacity', '0.2');
  }

  createEncompassingBox(): void {
    this.encompassingBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.encompassingBox.setAttribute('stroke-width', '2');
    this.encompassingBox.setAttribute('fill', 'none');
    this.encompassingBox.setAttribute('stroke-dasharray', '10');
    this.encompassingBox.setAttribute('stroke', this.state.colorState.secondColor.hex()); // TODO no color ?
    this.encompassingBox.setAttributeNS(null, 'opacity', '0.4');
    this.state.svgState.drawSvg.appendChild(this.encompassingBox);
  }

  drawEncompassingBox(shapes: Element[]) {
    if (!shapes[0]) {
      this.encompassingBox.setAttributeNS(null, 'opacity', '0');
      return
    };
    this.offset = this.state.svgState.drawSvg.getBoundingClientRect().left; 
    let tempStart = shapes[0].getBoundingClientRect();
    let thickness = +shapes[0].getAttribute('stroke-width')!/2;
    let startX = tempStart.left - thickness - this.offset;
    let startY = tempStart.top - thickness;
    let endX = tempStart.right + thickness - this.offset;
    let endY = tempStart.bottom + thickness;
    for (let i = 0; i < shapes.length; i++) {
      let boundingRectangle = shapes[i].getBoundingClientRect();
      thickness = +shapes[i].getAttribute('stroke-width')!/2;
      if (startX > boundingRectangle.left - thickness - this.offset) { startX = boundingRectangle.left - thickness - this.offset; }
      if (startY > boundingRectangle.top - thickness) { startY = boundingRectangle.top - thickness; }
      if (endX < boundingRectangle.right + thickness - this.offset) { endX = boundingRectangle.right + thickness - this.offset; }
      if (endY < boundingRectangle.bottom + thickness) { endY = boundingRectangle.bottom + thickness; }
    }

    this.encompassingBox.setAttributeNS(null, 'x', (startX).toString());
    this.encompassingBox.setAttributeNS(null, 'y', (startY).toString());
    this.encompassingBox.setAttributeNS(null, 'height', (endY - startY).toString());
    this.encompassingBox.setAttributeNS(null, 'width', (endX - startX).toString());
    this.encompassingBox.setAttributeNS(null, 'opacity', '0.4');
  }
}
