import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-polygon',
    templateUrl: './polygon.component.html',
    styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent implements OnInit {
    @Input('type') type: string;
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

    setType(value: string) {
        this.polygonTypeChange.emit(value);
    }

    setSides(event: any) {
        this.polygonSidesChange.emit(event.target.value);
    }
}
