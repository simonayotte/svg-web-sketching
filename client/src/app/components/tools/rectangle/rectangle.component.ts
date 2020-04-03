import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Types } from 'src/app/models/enums';

@Component({
    selector: 'app-rectangle',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent implements OnInit {
    @Input('rectangleType') rectangleType: Types;
    @Input('thickness') thickness: number;
    @Output() thicknessChange = new EventEmitter();
    @Output() rectangleTypeChange = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setRectangleType(value: Types) {
        this.rectangleTypeChange.emit(value);
    }
}
