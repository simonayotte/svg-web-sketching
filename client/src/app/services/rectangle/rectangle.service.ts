import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorService } from '../color/color.service';
import { DrawStateService } from '../draw-state/draw-state.service';
import { Rectangle } from 'src/app/models/rectangle';

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
    private rectangleType: string;

    initialX: number;
    initialY: number;
    isDrawing: boolean;

    private canvasImage: ImageData;
    private canvasHeight: number;
    private canvasWidth: number;

    currentStartX: number;
    currentStartY: number;
    currentHeight: number;
    currentWidth: number;

    setCanvasContext(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
    }

    getCanvasContext(): CanvasRenderingContext2D {
        return this.canvasContext;
    }

    setThickness(thickness: number) {
        this.thickness.next(thickness);
    }

    getThickness(): number {
        return this.thickness.value;
    }

    startRect(event: MouseEvent): void {
        this.drawStateService.setIsDrawingStarted(true);
        if (!this.isDrawing) {
            this.isDrawing = true;
            this.setDrawingParameters(event.offsetX, event.offsetY);

            // Bind other mouse event
            this.canvasRef.nativeElement.addEventListener('mousemove', this.mouseMoveListener);
            this.canvasRef.nativeElement.addEventListener('mouseup', this.mouseUpListener);
            this.canvasRef.nativeElement.addEventListener('mouseout', this.mouseOutListener);
            this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    setDrawingParameters(mousePositionX: number, mousePositionY: number) {
        this.initialX = mousePositionX;
        this.initialY = mousePositionY;

        // Stroke style
        this.canvasContext.lineWidth = this.thickness.value;
        this.canvasContext.lineJoin = 'miter';
        this.canvasContext.lineCap = 'square';
        this.canvasContext.strokeStyle = this.secondColor;
        this.canvasContext.fillStyle = this.firstColor;
    }

    continueRect(event: MouseEvent): void {
        this.adjustStartPosition(event.offsetX, event.offsetY);
        this.drawRect(this.currentStartX, this.currentStartY, this.currentWidth, this.currentHeight, this.canvasContext.lineWidth);
    }

    adjustStartPosition(mousePositionX: number, mousePositionY: number): void {
        this.currentStartX = mousePositionX > this.initialX ?
                this.initialX + this.canvasContext.lineWidth / 2 : this.initialX - this.canvasContext.lineWidth / 2;
        this.currentStartY = mousePositionY > this.initialY ?
                this.initialY + this.canvasContext.lineWidth / 2 : this.initialY - this.canvasContext.lineWidth / 2;
        this.currentWidth = mousePositionX - this.initialX;
        this.currentHeight = mousePositionY - this.initialY;
    }

    drawRect(startX: number, startY: number, width: number, height: number, thickness: number): void {

        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvasContext.putImageData(this.canvasImage, 0, 0);

        this.canvasContext.beginPath();

        // Check if the rectangle is smaller than the thickness
        if (thickness >= Math.abs(width) || thickness >= Math.abs(height)) {
            this.canvasContext.fillStyle = this.displayOutline ? this.secondColor : this.firstColor;
            this.canvasContext.fillRect(this.initialX, this.initialY, width, height);
            this.canvasContext.fillStyle = this.firstColor;
        } else {
            // If the rectangle is bigger, add offset depending on the thickness
            width += thickness < width ? -thickness : thickness;
            height += thickness < height ? -thickness : thickness;
            if (this.isShiftDown) {

                if  (Math.abs(width) < Math.abs(height)) {
                    if ( (width <= 0 && height >= 0) || (width >= 0 && height <= 0) ) { // XOR for 1st and 3d quadrants
                        height = -width;
                    } else {
                        height = width;
                        }
                } else {
                    if ( (width <= 0 && height >= 0) || (width >= 0 && height <= 0) ) { // XOR for 2nd and 4th quadrants
                        width = -height;
                    } else {
                        width = height;
                        }
                }
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

    stopRect(): Rectangle {
        this.canvasImage = this.canvasContext.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.isDrawing = false;
        this.canvasRef.nativeElement.removeEventListener('mousemove', this.mouseMoveListener);
        this.canvasRef.nativeElement.removeEventListener('mouseup', this.mouseUpListener);
        this.canvasRef.nativeElement.removeEventListener('mouseout', this.mouseOutListener);
        return this.createRectangleElement(this.currentStartX, this.currentStartY, this.currentWidth - this.initialX,
                                           this.currentHeight - this.initialY, this.thickness.value, this.firstColor,
                                           this.secondColor, this.rectangleType, this.getshiftDown());
    }

    createRectangleElement(startX: number, startY: number, endX: number, endY: number, rectangleThickness: number,
                           firstColor: string, secondColor: string, rectangleType: string, shift: boolean): Rectangle {
        const rectangleElement: Rectangle = {
            startSelectX: startX,
            startSelectY: startY,
            endSelectX: endX,
            endSelectY: endY,
            primaryColor: firstColor,
            secondaryColor: secondColor,
            thickness: rectangleThickness,
            type: rectangleType,
            isSquare: shift
        }
        return rectangleElement;
    }

    drawFromRectangleElement(rectangle: Rectangle): void {
        this.setDrawingParameters(rectangle.startSelectX, rectangle.startSelectY);
        this.adjustStartPosition(rectangle.endSelectX, rectangle.endSelectY);
        this.setRectangleType(rectangle.type);
        this.setThickness(rectangle.thickness);
        this.setshiftDown(rectangle.isSquare);
        this.firstColor = rectangle.primaryColor;
        this.secondColor = rectangle.secondaryColor;
        this.drawRect(this.currentStartX, this.currentStartY, this.currentWidth, this.currentHeight, this.canvasContext.lineWidth);
    }

    setRectangleType(rectangleType: string): void {
        switch (rectangleType) {
            case 'outline only':
                this.displayOutline = true;
                this.displayFill = false;
                this.canvasContext.lineWidth = this.thickness.value;
                this.rectangleType = rectangleType;
                break;
            case 'fill only':
                this.displayOutline = false;
                this.displayFill = true;
                this.canvasContext.lineWidth = 1;
                this.rectangleType = rectangleType;
                break;
            default:
                this.displayOutline = true;
                this.displayFill = true;
                this.canvasContext.lineWidth = this.thickness.value;
                this.rectangleType = 'outline and fill';
                break;
        }
    }

    getRectangleType(): string {
        return this.rectangleType;
    }

    getshiftDown(): boolean {
        return this.isShiftDown;
    }

    setshiftDown(value: boolean): void {
        this.isShiftDown = value;
        if (this.isDrawing) {
            this.drawRect(this.initialX, this.initialY, this.currentWidth, this.currentHeight, this.canvasContext.lineWidth);
        }
    }
}
