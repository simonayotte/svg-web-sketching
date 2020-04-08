import { Directive, HostListener, OnInit } from '@angular/core';
import { MovementService } from '../services/tools/movement/movement.service';
@Directive({
    selector: '[selection]',
})
export class SelectionDirective implements OnInit {
    constructor(private movementService: MovementService) {}

    ngOnInit() {}

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.movementService.start(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        this.movementService.handleKeyDown(event.key);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.movementService.handleKeyUp(event.key);
    }
}
