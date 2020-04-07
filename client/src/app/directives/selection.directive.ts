import { Directive, HostListener, Injector, OnInit } from '@angular/core';
import { MovementService } from '../services/movement/movement.service';
import { RotationService } from './../services/rotation/rotation.service';

@Directive({
    selector: '[selection]',
})
export class SelectionDirective implements OnInit {
    movement: MovementService;
    rotation: RotationService;
    constructor(protected injector: Injector) {
        this.movement = injector.get(MovementService);
        this.rotation = injector.get(RotationService);
    }
    ngOnInit() {}

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.movement.start(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.movement.handleKeyDown(event.key);
    }

    @HostListener('wheel', ['$event'])
    onMouseWheel(event: WheelEvent) {
        this.rotation.start(event);
    }
}
