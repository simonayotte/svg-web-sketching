import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawStateService } from '../draw-state/draw-state.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService {

    private thickness: BehaviorSubject<number> = new BehaviorSubject<number>(25);
    thicknessObs: Observable<number> = this.thickness.asObservable();

    private canvasRef: ElementRef;
    private canvasContext: CanvasRenderingContext2D;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;
    private mouseOutListener: EventListener;

    private color: string;

    lastX: number;
    lastY: number;

    constructor(private drawStateService: DrawStateService, private colorService: ColorService) {
        // Get canvas reference
        this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            if (canvasRef != null) { this.canvasRef = canvasRef; }
        });
        this.drawStateService.canvasContextObs.subscribe((canvasContext: CanvasRenderingContext2D) => {
            if (canvasContext != null) { this.canvasContext = canvasContext; }
        });
        // Get draw page state

        this.colorService.firstColorObs.subscribe((color: string) => (this.color = color));

        // Bind this to event listeners
        this.mouseMoveListener = this.continueDraw.bind(this);
        this.mouseUpListener = this.stopDraw.bind(this);
        this.mouseOutListener = this.stopDraw.bind(this);
    }

    setThickess(thickness: number) {
        this.thickness.next(thickness);
    }

    startDraw(event: MouseEvent): void {
        this.drawStateService.setIsDrawingStarted(true);

        // Stroke style
        this.canvasContext.lineJoin = 'round';
        this.canvasContext.lineCap = 'round';
        this.canvasContext.lineWidth = this.thickness.value;
        this.canvasContext.strokeStyle = this.color;
        this.canvasContext.fillStyle = this.color;

        // Write circle when click only
        this.canvasContext.beginPath();
        this.canvasContext.arc(event.offsetX, event.offsetY, this.thickness.value / 2, 0, 2 * Math.PI);
        this.canvasContext.closePath();
        this.canvasContext.fill();
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;

        this.canvasRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
        this.canvasRef.nativeElement.addEventListener('mouseup', this.mouseUpListener);
        this.canvasRef.nativeElement.addEventListener('mouseout', this.mouseOutListener);
    }

    continueDraw(event: MouseEvent): void {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.lastX, this.lastY);
        this.canvasContext.lineTo(event.offsetX, event.offsetY);
        this.canvasContext.closePath();
        this.canvasContext.stroke();
        this.lastX = event.offsetX;
        this.lastY = event.offsetY;
    }

    stopDraw(): void {
        this.lastX = 0;
        this.lastY = 0;
        this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
        this.canvasRef.nativeElement.removeEventListener('mouseup', this.mouseUpListener);
        this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
    }
}
