import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-pencil',
    templateUrl: './pencil.component.html',
    styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent implements OnInit {
    constructor() {}
    @Input('thickness') thickness: string;

    @Output() textureChange = new EventEmitter();
    @Output() thicknessChange = new EventEmitter();

    setThickness(event: any) {
        this.thicknessChange.emit(event.target.value);
    }
    ngOnInit() {}
}
