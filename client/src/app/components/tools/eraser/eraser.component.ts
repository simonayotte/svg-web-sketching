import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-eraser',
    templateUrl: './eraser.component.html',
    styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent {
    @Input('thickness') thickness: string;

    @Output() thicknessChange: EventEmitter<number> = new EventEmitter();
    /* tslint:disable:no-any */
    setThickness(event: any): void {
        this.thicknessChange.emit(event.target.value);
    }
}
