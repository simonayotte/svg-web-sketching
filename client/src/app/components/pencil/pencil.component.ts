import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { PencilService } from 'src/app/services/pencil/pencil.service';

@Component({
    selector: 'app-pencil',
    templateUrl: './pencil.component.html',
    styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent implements OnInit, OnDestroy {
    constructor(private drawStateService: DrawStateService, private pencilService: PencilService) {
        this.pencilService.thicknessObs.subscribe((thickness: number) => {
            this.thickness = thickness;
        });
        this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => (this.canvasRef = canvasRef));

        this.mouseDownListener = this.pencilService.startDraw.bind(this.pencilService);
    }
    thickness: number;

    private canvasRef: ElementRef;
    private mouseDownListener: EventListener;

    ngOnInit() {
        this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
    }

    ngOnDestroy() {
        this.canvasRef.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
    }

    setThickness(event: Event) {
        if (event.target) {
            this.pencilService.setThickess(parseInt((event.target as HTMLInputElement).value, 10));
        }
    }
}
