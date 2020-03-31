import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-eraser',
    templateUrl: './eraser.component.html',
    styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent implements OnInit {
    constructor() {}

    @Input('thickness') thickness: string;

    @Output() thicknessChange = new EventEmitter();

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }
    ngOnInit() {}
}
