import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Types } from 'src/app/models/enums';

@Component({
    selector: 'app-ellipsis',
    templateUrl: './ellipsis.component.html',
    styleUrls: ['./ellipsis.component.scss'],
})
export class EllipsisComponent {
    @Input('type') type: Types;
    @Input('thickness') thickness: number;
    @Output() thicknessChange: EventEmitter<number> = new EventEmitter();
    @Output() ellipsisTypeChange: EventEmitter<Types> = new EventEmitter();

    /* tslint:disable:no-any */
    setThickness(event: any): void {
        this.thicknessChange.emit(event.target.value);
    }

    setType(value: Types): void {
        this.ellipsisTypeChange.emit(value);
    }
}
