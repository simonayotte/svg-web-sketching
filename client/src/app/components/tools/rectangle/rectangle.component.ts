import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-rectangle',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent implements OnInit {
    @Input('rectangleType') rectangleType: string;
    @Input('thickness') thickness: number;
    @Output() thicknessChange = new EventEmitter();
    @Output() rectangleTypeChange = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setRectangleType(value: string) {
        this.rectangleTypeChange.emit(value);
    }
}
