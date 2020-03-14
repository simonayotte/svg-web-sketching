import { Component, OnInit } from '@angular/core';
import { DrawStore } from 'src/app/store/draw-store';
/*import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { DrawingStartedDialogComponent } from '../drawing-started-dialog/drawing-started-dialog.component';*/

@Component({
    selector: 'app-draw-page',
    templateUrl: './draw-page.component.html',
    styleUrls: ['./draw-page.component.scss'],
})
export class DrawPageComponent implements OnInit {
    constructor(public store: DrawStore) {}

    ngOnInit() {}
}
