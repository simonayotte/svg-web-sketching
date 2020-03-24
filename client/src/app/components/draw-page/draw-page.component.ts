import { Component, OnInit } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';

@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnInit {
    constructor(public store: DrawStore, private drawingHandler: DrawingHandler) {}

    ngOnInit() {}

    ngOnDestroy(){
        this.drawingHandler.clearCanvas();
    }

}
