import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Types } from 'src/app/models/enums';

@Component({
    selector: 'app-polygon',
    templateUrl: './polygon.component.html',
    styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent implements OnInit {
    @Input('type') type: Types;
    @Input('thickness') thickness: number;
    @Input('polygonSides') sides: number;
    @Output() thicknessChange = new EventEmitter();
    @Output() polygonTypeChange = new EventEmitter();
    @Output() polygonSidesChange = new EventEmitter();
    constructor() {}

    ngOnInit() {}

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
