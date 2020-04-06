import { Directive, HostListener, OnInit, Injector } from '@angular/core';
import { MovementService } from '../services/movement/movement.service';
@Directive({
    selector: '[selection]',
})
export class SelectionDirective implements OnInit {
    service: MovementService;
    constructor(protected injector: Injector) {
        this.service = injector.get(MovementService);
    }
    ngOnInit() {}

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.service.start(event);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.service.handleKeyDown(event.key);
    }
}
