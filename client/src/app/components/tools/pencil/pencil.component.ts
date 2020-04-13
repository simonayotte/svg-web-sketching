import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pencil',
    templateUrl: './pencil.component.html',
    styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent {
    @Input('thickness') thickness: string;

    @Output() thicknessChange: EventEmitter<number> = new EventEmitter();
    /* tslint:disable:no-any */
    setThickness(event: any): void {
        this.thicknessChange.emit(event.target.value);
    }
}
