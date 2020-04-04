import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Types } from 'src/app/models/enums';

/* tslint:disable:no-any */
@Component({
    selector: 'app-polygon',
    templateUrl: './polygon.component.html',
    styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent {
    @Input('type') type: Types;
    @Input('thickness') thickness: number;
    @Input('polygonSides') sides: number;
    @Output() thicknessChange: EventEmitter<number> = new EventEmitter();
    @Output() polygonTypeChange: EventEmitter<Types> = new EventEmitter();
    @Output() polygonSidesChange: EventEmitter<number> = new EventEmitter();

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setType(value: Types) {
        this.polygonTypeChange.emit(value);
    }

    setSides(event: any) {
        this.polygonSidesChange.emit(event.target.value);
    }
}
