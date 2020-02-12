import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorService } from '../color/color.service';
import { DrawStateService } from '../draw-state/draw-state.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService {
    constructor(private drawStateService: DrawStateService, private colorService: ColorService) {
        // Get canvas reference
        this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            if (canvasRef != null) {
                this.canvasRef = canvasRef;
            }
        });
        this.drawStateService.canvasHeightObs.subscribe((canvasHeight: number) => {
            if (canvasHeight != null) {
                this.canvasHeight = canvasHeight;
            }
        });
        this.drawStateService.canvasWidthObs.subscribe((canvasWidth: number) => {
            if (canvasWidth != null) {
                this.canvasWidth = canvasWidth;
            }
        });
        this.drawStateService.canvasContextObs.subscribe((canvasContext: CanvasRenderingContext2D) => {
            if (canvasContext != null) {
                this.canvasContext = canvasContext;
                this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
            }
        });

        // Get draw page state
        //this.drawStateService.isPanelOpenObs.subscribe((isPanelOpen: boolean) => (this.isPanelOpen = isPanelOpen));

        this.colorService.firstColorObs.subscribe((color: string) => (this.firstColor = color));
        this.colorService.secondColorObs.subscribe((color: string) => (this.secondColor = color));

        // Bind this to event listeners
        this.mouseMoveListener = this.continueRect.bind(this);
        this.mouseUpListener = this.stopRect.bind(this);
        this.mouseOutListener = this.stopRect.bind(this);
    }

    private thickness: BehaviorSubject<number> = new BehaviorSubject<number>(25);
    thicknessObs: Observable<number> = this.thickness.asObservable();

    private canvasRef: ElementRef;
    private canvasContext: CanvasRenderingContext2D;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;
    private mouseOutListener: EventListener;
    private isShiftDown: boolean;

    private firstColor: string;
    private secondColor: string;
    private displayOutline: boolean;
    private displayFill: boolean;


    private initialX: number;
    private initialY: number;

    private isDrawing: boolean;
    private canvasImage: ImageData;
    private canvasHeight: number;
    private canvasWidth: number;

    setThickess(thickness: number) {
        this.thickness.next(thickness);
    }

    startRect(event: MouseEvent): void {
        if (!this.isDrawing) {
            this.isDrawing = true;

            this.initialX = event.offsetX;
            this.initialY = event.offsetY;

            // Stroke style

            this.canvasContext.lineJoin = 'miter';
            this.canvasContext.lineCap = 'square';
            this.canvasContext.strokeStyle = this.secondColor;
            this.canvasContext.fillStyle = this.firstColor;

            this.canvasRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
            this.canvasRef.nativeElement.addEventListener('mouseup', this.mouseUpListener);
            this.canvasRef.nativeElement.addEventListener('mouseout', this.mouseOutListener);
            this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    continueRect(event: MouseEvent): void {

        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvasContext.putImageData(this.canvasImage, 0, 0);

        this.canvasContext.beginPath();

        const startX =
            event.offsetX > this.initialX ? this.initialX + this.canvasContext.lineWidth / 2 : this.initialX - this.canvasContext.lineWidth / 2;
        const startY =
            event.clientY > this.initialY ? this.initialY + this.canvasContext.lineWidth / 2 : this.initialY - this.canvasContext.lineWidth / 2;

        let width = event.offsetX - this.initialX;
        let height = event.clientY - this.initialY;

        // Check if the rectangle is smaller than the thickness
        if (this.canvasContext.lineWidth >= Math.abs(width) || this.canvasContext.lineWidth >= Math.abs(height)) {
            this.canvasContext.fillStyle = this.displayOutline ? this.secondColor : this.firstColor;
            this.canvasContext.fillRect(this.initialX, this.initialY, width, height);
            this.canvasContext.fillStyle = this.firstColor;
        } else {
            // If the rectangle is bigger, add offset depending on the thickness
            width += this.canvasContext.lineWidth < width ? -this.canvasContext.lineWidth : this.canvasContext.lineWidth;
            height += this.canvasContext.lineWidth < height ? -this.canvasContext.lineWidth : this.canvasContext.lineWidth;
            if (this.isShiftDown) {

                if  (Math.abs(width) < Math.abs(height)) {
                    if( (width<0 && height >0) || (width>0 && height <0) ){ //XOR for 1st and 3d quadrants
                        height = -width;}
                    else{
                        height=width;
                    }    
                    console.log("heightCW:", height, "  widthC: ", width);
                } else {
                    if( (width<0 && height >0) || (width>0 && height <0) ){ //XOR for 1st and 3d quadrants
                        height = -width;
                    }
                    else{
                    height=width;
                    }
                }
            }

            if (!this.isShiftDown) {
                width = event.offsetX - this.initialX;
                height= event.offsetY - this.initialY;
                width += this.canvasContext.lineWidth < width ? -this.canvasContext.lineWidth : this.canvasContext.lineWidth;
                height += this.canvasContext.lineWidth < height ? -this.canvasContext.lineWidth : this.canvasContext.lineWidth;
            }

            this.canvasContext.rect(startX, startY, width, height);
            if (this.displayFill) {
                this.canvasContext.fill();
            }
            if (this.displayOutline) {
                this.canvasContext.stroke();
            }
        }
    }

    stopRect(): void {
        this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.isDrawing = false;
        this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
        this.canvasRef.nativeElement.removeEventListener('mouseup', this.mouseUpListener);
        this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
    }

    setRectangleType(rectangleType: string): void {
        switch (rectangleType) {
            case 'outline only':
                this.displayOutline = true;
                this.displayFill = false;
                this.canvasContext.lineWidth = this.thickness.value;
                break;
            case 'fill only':
                this.displayOutline = false;
                this.displayFill = true;
                this.canvasContext.lineWidth = 1;
                break;
            default:
                this.displayOutline = true;
                this.displayFill = true;
                this.canvasContext.lineWidth = this.thickness.value;
                break;
        }
    }

    getshiftDown(): boolean {
        return this.isShiftDown;
    }

    setshiftDown(value: boolean): void {
        this.isShiftDown = value;
    }
}
