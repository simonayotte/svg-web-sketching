import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from 'src/app/models/color';
import { SelectedColors } from 'src/app/models/enums';
@Component({
    selector: 'app-color-panel',
    templateUrl: './color-panel.component.html',
    styleUrls: ['./color-panel.component.scss'],
})
export class ColorPanelComponent {
    @Input('firstColor') firstColor: Color;
    @Input('secondColor') secondColor: Color;
    @Input('canvasColor') canvasColor: Color;

    @Output() openColor: EventEmitter<void> = new EventEmitter();
    @Output() selectedColorChange: EventEmitter<SelectedColors> = new EventEmitter();
    @Output() swapColor: EventEmitter<void> = new EventEmitter();

    openColorWindow(color: SelectedColors): void {
        this.openColor.emit();
        this.selectedColorChange.emit(color);
    }

    swap(): void {
        this.swapColor.emit();
    }
}
