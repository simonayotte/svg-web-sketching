import { Directive, HostListener } from '@angular/core';
import { MovementService } from '../services/tools/movement/movement.service';
import { RotationService } from './../services/rotation/rotation.service';
@Directive({
    selector: '[selection]',
})
export class SelectionDirective {
    constructor(private movementService: MovementService, private rotationService: RotationService) {}

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.movementService.start(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        this.movementService.handleKeyDown(event.key);
        this.rotationService.handleKeyDown(event.key);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.movementService.handleKeyUp(event.key);
        this.rotationService.handleKeyUp(event.key);
    }

    @HostListener('wheel', ['$event'])
    onMouseWheel(event: WheelEvent) {
        event.preventDefault();
        this.rotationService.start();
    }
}
