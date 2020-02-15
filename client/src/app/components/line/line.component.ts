import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DrawStateService } from 'src/app/services/draw-state/draw-state.service';
import { LineService } from 'src/app/services/line/line.service';

@Component({
    selector: 'app-line',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnInit, OnDestroy {
    constructor(private drawStateService: DrawStateService, private lineService: LineService) {
        this.lineService.thicknessObs.subscribe((thickness: number) => {
            this.thickness = thickness;
        });

        this.lineService.junctionPointThicknessObs.subscribe((junctionPointThickness: number) => {
            this.junctionPointThickness = junctionPointThickness;
        });

        this.drawStateService.canvasRefObs.subscribe((canvasRef: ElementRef) => (this.canvasRef = canvasRef));
        this.mouseDownListener = this.lineService.connectLineEventHandler.bind(this.lineService);
    }

    canvasRef: ElementRef;
    thickness: number;
    lineHasJunction = true;
    junctionPointThickness: number;

    private mouseDownListener: EventListener;

    ngOnInit() {
        this.canvasRef.nativeElement.addEventListener('mousedown', this.mouseDownListener);
    }

    ngOnDestroy() {
        this.canvasRef.nativeElement.removeEventListener('mousedown', this.mouseDownListener);
    }

    setThickness(event: Event) {
        if (event.target) {
            this.lineService.setThickness(parseInt((event.target as HTMLInputElement).value, 10));
        }
    }

    setJunctionPointThickness(event: Event) {
        if (event.target) {
            this.lineService.setJunctionPointThickness(parseInt((event.target as HTMLInputElement).value, 10));
        }
    }

    setJunctionType(lineHasJunction: boolean) {
        this.lineService.setJunctionType(lineHasJunction);
        this.lineHasJunction = lineHasJunction;
    }

    @HostListener('document:keydown.escape', ['$event'])
    cancelLine(event: KeyboardEvent) {
        this.lineService.cancelLine();
    }

    @HostListener('document:keydown.backspace', ['event'])
    cancelSegment(event: KeyboardEvent) {
        this.lineService.cancelSegment();
    }

    @HostListener('document:keydown.shift', ['event'])
    alignLine(event: KeyboardEvent) {
        this.lineService.setShiftKeyDown(true);
    }

    @HostListener('document:keyup.shift', ['event'])
    freeLine(event: KeyboardEvent) {
        this.lineService.setShiftKeyDown(false);
    }
}
