import { PencilService } from './../../services/pencil/pencil.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';

@Component({
    selector: 'app-pencil',
    templateUrl: './pencil.component.html',
    styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent implements OnInit {
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
