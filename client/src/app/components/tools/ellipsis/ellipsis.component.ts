import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Types } from 'src/app/models/enums';

@Component({
    selector: 'app-ellipsis',
    templateUrl: './ellipsis.component.html',
    styleUrls: ['./ellipsis.component.scss'],
})
export class EllipsisComponent implements OnInit {
    @Input('type') type: Types;
    @Input('thickness') thickness: number;
    @Output() thicknessChange = new EventEmitter();
    @Output() ellipsisTypeChange = new EventEmitter();
    constructor() {}

    ngOnInit() {}

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setType(value: Types) {
        this.ellipsisTypeChange.emit(value);
    }
}
