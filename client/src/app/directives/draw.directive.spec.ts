import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ElementRef } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { DrawHandlerService } from '../services/draw-handler/draw-handler.service';
import { DrawDirective } from './draw.directive';

@Component({
    template: '<svg draw> </svg>',
})
class TestComponent {}
describe('DrawDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let directive: DrawDirective;
    let directiveEl: DebugElement;
    let svgEl: DebugElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DrawDirective, TestComponent],
            providers: [DrawHandlerService],
            imports: [MatDialogModule],
        });
        fixture = TestBed.createComponent(TestComponent);
        directiveEl = fixture.debugElement.query(By.directive(DrawDirective));
        directive = directiveEl.injector.get(DrawDirective);
        svgEl = fixture.debugElement.query(By.css('svg'));

        directive.ngOnInit();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });
    it('keydown event should call #onKeyDown()', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'c',
        });

        const spy = spyOn(directive, 'onKeyDown');
        document.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });
    it('keyup event should call #onKeyUp()', () => {
        const event: KeyboardEvent = new KeyboardEvent('keyup', {
            key: 'c',
        });
        const spy = spyOn(directive, 'onKeyUp');
        document.dispatchEvent(event);

        expect(spy).toHaveBeenCalled();
    });
    it('mousedown event should call #onMouseDown()', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 10,
            clientY: 15,
        });
        const spy = spyOn(directive, 'onMouseDown');
        svgEl.triggerEventHandler('mousedown', event);

        expect(spy).toHaveBeenCalled();
    });

    it('mouseleave event should call #onMouseleave()', () => {
        const spy = spyOn(directive, 'onMouseleave');
        svgEl.triggerEventHandler('mouseleave', null);
        expect(spy).toHaveBeenCalled();
    });
});
