import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-line',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnInit {
    constructor() {}

    @Input('thickness') thickness: string;
    @Input('lineJunctionThickness') lineJunctionThickness: string;
    @Input('lineHasJunction') lineHasJunction: boolean;

    @Output() textureChange = new EventEmitter();
    @Output() thicknessChange = new EventEmitter();
    @Output() lineJunctionThicknessChange = new EventEmitter();
    @Output() lineHasJunctionChange = new EventEmitter();

    ngOnInit() {}

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setLineHasJunction(value: boolean) {
        this.lineHasJunctionChange.emit(value);
    }

    setLineJunctionThickness(event: any) {
        this.lineJunctionThicknessChange.emit(event.target.value);
    }
}
