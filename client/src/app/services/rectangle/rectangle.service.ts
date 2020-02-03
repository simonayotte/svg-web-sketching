import { Injectable, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DrawStateService } from '../draw-state/draw-state.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RectangleService implements OnInit, OnDestroy {
  constructor(private drawStateService: DrawStateService) {
    //Get canvas reference
    this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
        if (canvasRef != null) this.canvasRef = canvasRef;
    });
    this.drawStateService.canvasContextObs.subscribe((canvasContext: CanvasRenderingContext2D) => {
        if (canvasContext != null) this.canvasContext = canvasContext;
    });
    //Get draw page state
    this.drawStateService.isPanelOpenObs.subscribe((isPanelOpen: boolean) => (this.isPanelOpen = isPanelOpen));

    this.drawStateService.currentColorObs.subscribe((color: string) => (this.color = color));

    //Bind this to event listeners
    this.mouseDownListener = this.startRect.bind(this);
    this.mouseMoveListener = this.continueRect.bind(this);
    this.mouseUpListener = this.stopRect.bind(this);
    this.mouseOutListener = this.stopRect.bind(this);
  }
  ngOnInit() {
      this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
      /// TODO: get canvas width and height
      this.canvasHeight = 2000;
      this.canvasWidth = 2000;
      this.canvasImage = this.canvasContext.getImageData(0,0,this.canvasWidth,this.canvasHeight);
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

  private initialX: number;
  private initialY: number;

  private isDrawing: boolean;
  private canvasImage: ImageData;
  private canvasHeight: number;
  private canvasWidth: number;


  startRect(event: MouseEvent): void {
      if (!this.isDrawing) {
        this.isDrawing = true;
        let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;

        this.initialX = positionX;
        this.initialY = event.clientY;

        //Stroke style
        
        this.canvasContext.lineJoin = 'miter';
        this.canvasContext.lineCap = 'square';
        this.canvasContext.lineWidth = this.thickness.value;
        this.canvasContext.strokeStyle = this.color;

        this.canvasRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
        this.canvasRef.nativeElement.addEventListener('mouseup', this.mouseUpListener);
        this.canvasRef.nativeElement.addEventListener('mouseout', this.mouseOutListener);
      }
  }

  continueRect(event: MouseEvent): void {
      let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;

      this.canvasContext.clearRect(0,0,this.canvasWidth,this.canvasHeight);
      this.canvasContext.putImageData(this.canvasImage,0,0);

      this.canvasContext.beginPath();
      let width = positionX - this.initialX;
      let height = event.clientY - this.initialY;
      this.canvasContext.rect(this.initialX,this.initialY,width,height);
      this.canvasContext.stroke();
  }

  stopRect(): void { 
      this.canvasImage = this.canvasContext.getImageData(0,0,this.canvasWidth,this.canvasHeight);
      this.isDrawing = false;
      this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
      this.canvasRef.nativeElement.removeEventListener('mouseup', this.mouseUpListener);
      this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
  }
}
