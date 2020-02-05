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
    this.mouseDownListener = this.drawLine.bind(this);
    this.mouseMoveListener = this.previewLine.bind(this);
    this.mouseUpListener = this.stopLine.bind(this);
    this.mouseOutListener = this.stopLine.bind(this);
  }

  ngOnInit(){
    this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
    this.canvasHeight = 2000;
    this.canvasWidth = 2000;
    this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
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
  private mouseUpListener: EventListener;
  private mouseMoveListener: EventListener;
  private mouseOutListener: EventListener;

  private color: string;
  private isPanelOpen: boolean;

  private lastX: number;
  private lastY: number;

  private canvasWidth: number;
  private canvasHeight: number;
  private canvasImage: ImageData;

  drawLine(event: MouseEvent): void {
      //Position on event
      let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;
      let positionY = event.clientY;

      //Stroke style
      this.canvasContext.lineJoin = 'round';
      this.canvasContext.lineCap = 'round';
      this.canvasContext.lineWidth = this.thickness.value;
      this.canvasContext.strokeStyle = this.color;
      this.canvasContext.fillStyle = this.color;

      //Premier point de la ligne vs point subsequent
      if(this.lastX && this.lastY) {
        //Logique pour connecter la ligne avec les points precedent
        this.canvasContext.beginPath();
        this.canvasContext.arc(positionX, positionY, this.thickness.value, 0, 2 * Math.PI);
        this.canvasContext.moveTo(this.lastX, this.lastY);
        this.canvasContext.lineTo(positionX, positionY);
        this.canvasContext.stroke();
        this.lastX = positionX;
        this.lastY = positionY;

      } else { //Si c'est le premier point de la sequence
        this.canvasContext.beginPath();
        this.canvasContext.arc(positionX, positionY, this.thickness.value, 0, 2 * Math.PI);
        this.canvasContext.closePath();
        this.canvasContext.fill();
        this.lastX = positionX;
        this.lastY = positionY;
      }
      this.canvasImage = this.canvasContext.getImageData(0,0, this.canvasWidth, this.canvasHeight);

      this.canvasRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
      this.canvasRef.nativeElement.addEventListener('mouseup', this.mouseUpListener);
      this.canvasRef.nativeElement.addEventListener('mouseout', this.mouseOutListener);
    
  }

  previewLine(event: MouseEvent): void {
    let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;
    let positionY = event.clientY;
    if(this.lastX && this.lastY) {
      //save state of canvas
      this.canvasContext.clearRect(0,0, this.canvasWidth, this.canvasHeight);
      this.canvasContext.putImageData(this.canvasImage, 0, 0,);

      //Draw preview line
      this.canvasContext.beginPath();
      this.canvasContext.arc(positionX, positionY, this.thickness.value, 0, 2 * Math.PI);
      this.canvasContext.moveTo(this.lastX, this.lastY);
      this.canvasContext.lineTo(positionX, positionY);
      this.canvasContext.stroke();
    }
    
  }

  stopLine(): void {
    //this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
    //this.canvasRef.nativeElement.removeEventListener('mouseup', this.mouseUpListener);
    //this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
  }

}
