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

    constructor() {
        // Empty Block
    }

    ngOnInit(): void {
        // Empty Block
    }

    setThickness(event: any): void {
        this.thicknessChange.emit(event.target.value);
    }

    setRectangleType(value: Types): void {
        this.rectangleTypeChange.emit(value);
    }
}
