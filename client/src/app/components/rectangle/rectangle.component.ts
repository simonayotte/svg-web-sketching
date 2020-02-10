import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { RectangleService } from 'src/app/services/rectangle/rectangle.service';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';

@Component({
    selector: 'app-rectangle',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent implements OnInit, OnDestroy {
    constructor(private drawStateService: DrawStateService, private rectangleService: RectangleService) {
        this.rectangleService.thicknessObs.subscribe((thickness: number) => {
            this.thickness = thickness;
        });

        this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => (this.canvasRef = canvasRef));

        this.mouseDownListener = this.rectangleService.startRect.bind(this.rectangleService);
    }

    public rectangleType = 'outline only';
    public thickness: number;

    private canvasRef: ElementRef;
    private mouseDownListener: EventListener;

    ngOnInit() {
        this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
    }

    ngOnDestroy() {
        this.canvasRef.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
    }

    setThickness($event: Event) {
        if ($event.target) {
            this.rectangleService.setThickess(parseInt(($event.target as HTMLInputElement).value, 10));
        }
    }

    setRectangleType(rectangleType: string) {
        if (rectangleType === 'outline only' || rectangleType === 'fill only' || rectangleType === 'outline and fill') {
            this.rectangleService.setRectangleType(rectangleType);
            this.rectangleType = rectangleType;
        }
    }
}
