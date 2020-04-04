import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-line',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.scss'],
})
export class LineComponent {
    constructor() {
        this.textureChange = new EventEmitter();
        this.thicknessChange = new EventEmitter();
        this.lineJunctionThicknessChange = new EventEmitter();
        this.lineHasJunctionChange = new EventEmitter();
    }

    @Input('thickness') thickness: string;
    @Input('lineJunctionThickness') lineJunctionThickness: string;
    @Input('lineHasJunction') lineHasJunction: boolean;

    @Output() textureChange: EventEmitter<unknown>;
    @Output() thicknessChange: EventEmitter<unknown>;
    @Output() lineJunctionThicknessChange: EventEmitter<unknown>;
    @Output() lineHasJunctionChange: EventEmitter<unknown>;

    /* tslint:disable:no-any */
    // Permet emission de notre event dans le test
    setThickness(event: any): void {
        this.thicknessChange.emit(event.target.value);
    }

    setLineHasJunction(value: boolean): void {
        this.lineHasJunctionChange.emit(value);
    }

    setLineJunctionThickness(event: any): void {
        this.lineJunctionThicknessChange.emit(event.target.value);
    }
}
