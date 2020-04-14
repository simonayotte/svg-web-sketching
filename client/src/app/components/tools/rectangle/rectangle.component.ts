import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Types } from 'src/app/models/enums';

@Component({
    selector: 'app-rectangle',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent {
    @Input('rectangleType') rectangleType: Types;
    @Input('thickness') thickness: number;
    @Output() thicknessChange: EventEmitter<number> = new EventEmitter();
    @Output() rectangleTypeChange: EventEmitter<Types> = new EventEmitter();

    /* tslint:disable:no-any */
    setThickness(event: any): void {
        this.thicknessChange.emit(event.target.value);
    }

    setRectangleType(value: Types): void {
        this.rectangleTypeChange.emit(value);
    }
}
