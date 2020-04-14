import { Directive, HostListener } from '@angular/core';
import { MovementService } from '../services/tools/movement/movement.service';
@Directive({
    selector: '[selection]',
})
export class SelectionDirective {
    constructor(private movementService: MovementService) {}

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.movementService.start(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.movementService.handleKeyDown(event.key);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.movementService.handleKeyUp(event.key);
    }
}
