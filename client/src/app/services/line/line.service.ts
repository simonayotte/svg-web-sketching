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
    this.mouseDownListener = this.startLine.bind(this);
    this.mouseMoveListener = this.updateLine.bind(this);
    this.mouseUpListener = this.drawLine.bind(this);
    this.mouseOutListener = this.stopDraw.bind(this);
  }

  ngOnInit(){
    this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
  }

  ngOnDestroy() {
    this.canvasRef.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
  }

  private thickness: BehaviorSubject<number> = new BehaviorSubject<number>(25);
  thicknessObs: Observable<number> = this.thickness.asObservable();

  setThickess(thickness: number) {
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

  startLine(event: MouseEvent): void {
    let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;

    //Stroke style
    this.canvasContext.lineJoin = 'round';
    this.canvasContext.lineCap = 'round';
    this.canvasContext.lineWidth = this.thickness.value;
    this.canvasContext.strokeStyle = this.color;
    this.canvasContext.fillStyle = this.color;

    //Write circle when click only
    this.canvasContext.beginPath();
    this.canvasContext.arc(positionX, event.clientY, this.thickness.value / 2, 0, 2 * Math.PI);
    this.canvasContext.closePath();
    this.canvasContext.fill();
    this.lastX = positionX;
    this.lastY = event.clientY;

    this.canvasRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
    this.canvasRef.nativeElement.addEventListener('mouseup', this.mouseUpListener);
    this.canvasRef.nativeElement.addEventListener('mouseout', this.mouseOutListener);

  }

  updateLine(event: MouseEvent): void {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.lastX, this.lastY);
    this.canvasContext.lineTo(event.clientX, event.clientY);
    this.canvasContext.stroke();
  }

  drawLine(event: MouseEvent): void {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.lastX, this.lastY);
    this.canvasContext.lineTo(event.clientX, event.clientY);
    this.canvasContext.stroke();
  }

  calculateLine(event: MouseEvent): void {
    let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;

    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.lastX, this.lastY);
    this.canvasContext.lineTo(positionX, event.clientY);
    this.canvasContext.closePath();
    this.canvasContext.stroke();
    this.lastX = positionX;
    this.lastY = event.clientY;
  }


  stopDraw(): void {
    this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
    this.canvasRef.nativeElement.removeEventListener('mouseup', this.mouseUpListener);
    this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
  }
}
