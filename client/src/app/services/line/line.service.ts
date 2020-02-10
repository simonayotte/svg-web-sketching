import { Injectable, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DrawStateService } from '../draw-state/draw-state.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorService } from 'src/app/services/color/color.service';

@Injectable({
  providedIn: 'root'
})
export class LineService implements OnInit, OnDestroy {

  constructor(private drawStateService: DrawStateService, private colorService: ColorService) {
    this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
      if (canvasRef != null) this.canvasRef = canvasRef;
    });
    this.drawStateService.canvasContextObs.subscribe((canvasContext: CanvasRenderingContext2D) => {
        if (canvasContext != null) this.canvasContext = canvasContext;
    });
    //Get draw page state
    this.drawStateService.isPanelOpenObs.subscribe((isPanelOpen: boolean) => (this.isPanelOpen = isPanelOpen));

    this.colorService.firstColorWithOpacityObs.subscribe((color: string) => (this.color = color));

    //Bind this to event listeners
    this.lineHasJunction = false;
    this.mouseDownListener = this.connectLineEventHandler.bind(this);
    this.mouseMoveListener = this.previewLineEventHandler.bind(this);
    this.mouseOutListener = this.stopLine.bind(this);
    this.mouseDoubleDownListener = this.stopLine.bind(this);
  }

  ngOnInit(){
    this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
    this.canvasRef.nativeElement.addEventListener('dblclick', this.mouseDoubleDownListener);
    this.canvasHeight = 2000;
    this.canvasWidth = 2000;
    this.lineImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    this.coordinates = new Array<Coordinate>();
    this.setJunctionType(true);
  }

  ngOnDestroy() {
    this.canvasRef.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
  }

  private thickness: BehaviorSubject<number> = new BehaviorSubject<number>(25);
  thicknessObs: Observable<number> = this.thickness.asObservable();

  setThickness(thickness: number) {
      this.thickness.next(thickness);
  }

  private canvasRef: ElementRef;
  private canvasContext: CanvasRenderingContext2D;

  private mouseDownListener: EventListener;
  //private mouseUpListener: EventListener;
  private mouseMoveListener: EventListener;
  private mouseOutListener: EventListener;
  private mouseDoubleDownListener: EventListener;

  private color: string;
  private isPanelOpen: boolean;

  //Attributs pour les jonctions entre les points
  private lineHasJunction: boolean;
  //private junctionPointRadius: number;
  private junctionPointThickness: BehaviorSubject<number> = new BehaviorSubject<number>(25);
  junctionPointThicknessObs: Observable<number> = this.thickness.asObservable();

  private lastX?: number;
  private lastY?: number;

  private canvasWidth: number;
  private canvasHeight: number;
  private canvasImage: ImageData;

  private lineImage: ImageData;

  //TODO: Structure pour save les points pour annuler le dernier segment
  private coordinates: Array<Coordinate>;

  connectLineEventHandler(event: MouseEvent): void {
    let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;
    let positionY = event.clientY;
    this.connectLine(positionX, positionY);
    this.coordinates.push(new Coordinate(positionX, positionY));
  }

  connectLine(positionX: number, positionY: number): void {

      //Stroke style
      this.canvasContext.lineJoin = 'round';
      this.canvasContext.lineCap = 'round';
      this.canvasContext.lineWidth = this.thickness.value;
      this.canvasContext.strokeStyle = this.color;
      this.canvasContext.fillStyle = this.color;

      //Si ce n'est pas le premier point de la sequence de ligne
      if(this.lastX && this.lastY) {
        if(this.lineHasJunction){
          this.drawPoint(positionX, positionY);
        }
        this.drawLine(positionX, positionY);
        this.lastX = positionX;
        this.lastY = positionY;

      } else { //Si c'est le premier point de la sequence
        this.drawPoint(positionX,positionY);
        this.lastX = positionX;
        this.lastY = positionY;
      }
      //Ajouter la nouvelle ligne au saved Canvas Image
      this.canvasImage = this.canvasContext.getImageData(0,0, this.canvasWidth, this.canvasHeight);
      //Ajout à l'array des saved states
      console.log(this.coordinates);
      this.canvasRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
      this.canvasRef.nativeElement.addEventListener('mouseout', this.mouseOutListener);
      
    
  }
  //MouseMoveEvent => PreviewLine
  previewLineEventHandler(event: MouseEvent) {
    let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;
    let positionY = event.clientY;
    if(this.lastX && this.lastY) {
      //save state of canvas
      this.canvasContext.clearRect(0,0, this.canvasWidth, this.canvasHeight);
      this.canvasContext.putImageData(this.canvasImage, 0, 0,);
      this.drawLine(positionX, positionY);
    }
  }

  //TODO: Le premier point n'est pas supprimé
  //Backspace => cancelSegment
  cancelSegment(): void {
    this.coordinates.pop();
    this.lastX = undefined;
    this.lastY = undefined;
    this.canvasContext.clearRect(0,0, this.canvasWidth, this.canvasHeight);
    this.coordinates.forEach(element => {
      this.connectLine(element.pointX, element.pointY);
    });
  }

  //Escape => cancelLine
  cancelLine(): void {
    this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
    this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
    while(this.coordinates.length != 0){
      this.coordinates.pop();
    }
    this.canvasContext.clearRect(0,0, this.canvasWidth, this.canvasHeight);
    this.canvasContext.putImageData(this.lineImage, 0, 0,);  
    this.lastX = undefined;
    this.lastY = undefined;  
  }
  
  drawLine(positionX: number, positionY: number): void {
    this.canvasContext.beginPath();
    //Changer le style des connections ici pour ajouter des points ou non
    //this.canvasContext.arc(positionX, positionY, this.thickness.value, 0, 2 * Math.PI);
    if(this.lastX && this.lastY){
      this.canvasContext.moveTo(this.lastX, this.lastY);
      this.canvasContext.lineTo(positionX, positionY);
      this.canvasContext.stroke();
    }
  }

  //Draws the connection point for the lines
  drawPoint(positionX: number, positionY:number): void {
    if (this.lineHasJunction) {
      this.canvasContext.beginPath();
      this.canvasContext.ellipse(positionX, positionY, this.junctionPointThickness.value/2, this.junctionPointThickness.value/2, 0, 0, 2 * Math.PI);
      this.canvasContext.stroke();
    } else {
      this.canvasContext.beginPath();
      this.canvasContext.stroke();
    }
  }

  //TODO: Refactor this function
  stopLine(event: MouseEvent): void {
    this.lastX = undefined;
    this.lastY = undefined;
    //Enlever tout les elements de l'array
    while(this.coordinates.length != 0){
      this.coordinates.pop();
    }
    this.lineImage = this.canvasContext.getImageData(0,0, this.canvasWidth, this.canvasHeight);
    this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
    this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
  }

  setJunctionType(lineHasJunction: boolean) {
    this.lineHasJunction = lineHasJunction;
  }

  setJunctionPointThickness(junctionPointThickness: number) {
    this.junctionPointThickness.next(junctionPointThickness);
  }  

}

//Structure pour sauver les points
class Coordinate {
  pointX: number;
  pointY: number;
  constructor(pointX: number, pointY: number){
    this.pointX = pointX;
    this.pointY = pointY;
  }
}

