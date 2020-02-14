import { Injectable, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DrawStateService } from '../draw-state/draw-state.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorService } from '../color/color.service';
@Injectable({
    providedIn: 'root',
})
export class BrushService implements OnInit, OnDestroy {
    constructor(private drawStateService: DrawStateService, private colorService: ColorService) {
        //Get canvas reference
        this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => {
            if (canvasRef != null) this.canvasRef = canvasRef;
        });
        this.drawStateService.canvasContextObs.subscribe((canvasContext: CanvasRenderingContext2D) => {
            if (canvasContext != null) this.canvasContext = canvasContext;
        });

        //Get draw page state
        this.drawStateService.isPanelOpenObs.subscribe((isPanelOpen: boolean) => (this.isPanelOpen = isPanelOpen));

        this.colorService.firstColorObs.subscribe((firstColor: string) => (this.firstColor = firstColor));

        //Bind this to event listeners
        this.mouseDownListener = this.startDraw.bind(this);
        this.mouseMoveListener = this.continueDraw.bind(this);
        this.mouseUpListener = this.stopDraw.bind(this);
        this.mouseOutListener = this.stopDraw.bind(this);
    }
    ngOnInit() {
        this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
        this.setTexture('normal');
    }

    ngOnDestroy() {
        this.canvasRef.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
    }

    private canvasRef: ElementRef;
    private canvasContext: CanvasRenderingContext2D;

    private pattern: CanvasPattern | null;
    private mouseDownListener: EventListener;

    private mouseUpListener: EventListener;
    private mouseMoveListener: EventListener;
    private mouseOutListener: EventListener;

    private firstColor: string;
    private isPanelOpen: boolean;

    private lastX: number;
    private lastY: number;

    private thickness: BehaviorSubject<number> = new BehaviorSubject<number>(25);
    thicknessObs: Observable<number> = this.thickness.asObservable();

    setTexture(texture: string) {
        let image: HTMLImageElement = new Image(this.thickness.value, this.thickness.value);

        switch (texture) {
            case 'circle':
                image.src = `data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${this.firstColor.substr(
                    1,
                )}' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E`;
                break;
            case 'brick':
                image.src = `data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23${this.firstColor.substr(
                    1,
                )}' fill-opacity='1'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;
                break;
            case 'zigzag':
                image.src = `data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%23${this.firstColor.substr(
                    1,
                )}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E`;
                break;
            case 'square':
                image.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23${this.firstColor.substr(
                    1,
                )}' fill-opacity='1'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E`;
                break;
            case 'wave':
                image.src = `data:image/svg+xml,%3Csvg width='76' height='18' viewBox='0 0 76 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 18c-2.43-1.824-4-4.73-4-8 0-4.418-3.582-8-8-8H0V0h20c5.523 0 10 4.477 10 10 0 4.418 3.582 8 8 8h20c4.418 0 8-3.582 8-8 0-5.523 4.477-10 10-10v2c-4.418 0-8 3.582-8 8 0 3.27-1.57 6.176-4 8H32zM64 0c-1.67 1.256-3.748 2-6 2H38c-2.252 0-4.33-.744-6-2h32z' fill='%23${this.firstColor.substr(
                    1,
                )}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E`;
                break;
            default:
                this.pattern = null;
                return;
        }

        image.onload = () => {
            this.pattern = this.canvasContext.createPattern(image, 'repeat');
        };
    }

    setThickess(thickness: number) {
        this.thickness.next(thickness);
    }

    startDraw(event: MouseEvent): void {
        //comment tester une fonction comme celle la
        let positionX = this.isPanelOpen ? event.clientX - 252 : event.clientX - 52;
        this.drawStateService.setIsDrawingStarted(true);

        //Stroke style
        this.canvasContext.lineJoin = 'round';
        this.canvasContext.lineCap = 'round';
        this.canvasContext.lineWidth = this.thickness.value;

        if (this.pattern != null) {
            this.canvasContext.fillStyle = this.pattern;
            this.canvasContext.strokeStyle = this.pattern;
        } else {
            this.canvasContext.fillStyle = this.firstColor;
            this.canvasContext.strokeStyle = this.firstColor;
        }

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

    continueDraw(event: MouseEvent): void {
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
