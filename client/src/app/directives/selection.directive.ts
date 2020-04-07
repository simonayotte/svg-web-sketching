import { Directive, HostListener, Injector, OnInit } from '@angular/core';
import { MovementService } from '../services/movement/movement.service';
import { RotationService } from './../services/rotation/rotation.service';
import { ClipboardService } from '../services/tools/clipboard/clipboard.service';
@Directive({
    selector: '[selection]',
})
export class SelectionDirective implements OnInit {
    movementService: MovementService;
    clipboardService: ClipboardService;
    rotationService: RotationService;
    constructor(protected injector: Injector) {
        this.movementService = injector.get(MovementService);
        this.clipboardService = injector.get(ClipboardService);
        this.rotationService = injector.get(RotationService);
    }
    ngOnInit() {}

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.movementService.start(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        this.movementService.handleKeyDown(event.key);
        this.clipboardService.handleKeyDown(event.key);
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        this.movementService.handleKeyUp(event.key);
        this.clipboardService.handleKeyUp(event.key);
    }

    @HostListener('wheel', ['$event'])
    onMouseWheel(event: WheelEvent) {
        this.rotationService.start(event);
    }
}
