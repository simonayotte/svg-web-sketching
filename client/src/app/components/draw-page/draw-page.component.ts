import { Component, OnDestroy, HostListener } from '@angular/core';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { DrawStore } from 'src/app/store/draw-store';

@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnDestroy {
    constructor(public store: DrawStore, private drawingHandler: DrawingHandler) {}

    ngOnDestroy() {
        this.drawingHandler.clearCanvas();
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }
}
