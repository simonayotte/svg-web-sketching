import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-ellipsis',
    templateUrl: './ellipsis.component.html',
    styleUrls: ['./ellipsis.component.scss'],
})
export class EllipsisComponent implements OnInit {
    @Input('type') type: string;
    @Input('thickness') thickness: number;
    @Output() thicknessChange = new EventEmitter();
    @Output() ellipsisTypeChange = new EventEmitter();
    constructor() {}

    ngOnInit() {}

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }

    setType(value: string) {
        if (value === 'outline ' || value === 'outlineFill' || value === 'fill') {
            this.ellipsisTypeChange.emit(value);
        }
    }
}
