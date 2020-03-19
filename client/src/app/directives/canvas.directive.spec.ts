import { CanvasDirective } from './canvas.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CanvasHandlerService } from '../services/canvas-handler/canvas-handler.service';
//import { ElementRef } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
    template: '<canvas canvas> </canvas>',
})
class TestComponent {}
describe('CanvasDirective', () => {
    // let directive: CanvasDirective;
    let fixture: ComponentFixture<TestComponent>;
    let directive: CanvasDirective;
    let directiveEl: DebugElement;
    let canvasEl: DebugElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CanvasDirective, TestComponent],
            providers: [CanvasHandlerService],
            imports: [MatDialogModule],
        });
        fixture = TestBed.createComponent(TestComponent);
        directiveEl = fixture.debugElement.query(By.directive(CanvasDirective));
        directive = directiveEl.injector.get(CanvasDirective);
        canvasEl = fixture.debugElement.query(By.css('canvas'));

        directive.ngOnInit();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });
    it('keydown event should call #onKeyDown()', () => {
        const event: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'c',
        });

        let spy = spyOn(directive, 'onKeyDown');
        document.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });
    it('keyup event should call #onKeyUp()', () => {
        const event: KeyboardEvent = new KeyboardEvent('keyup', {
            key: 'c',
        });
        let spy = spyOn(directive, 'onKeyUp');
        document.dispatchEvent(event);

        expect(spy).toHaveBeenCalled();
    });
    it('mousedown event should call #onMouseDown()', () => {
        const event: MouseEvent = new MouseEvent('mousedown', {
            clientX: 10,
            clientY: 15,
        });
        let spy = spyOn(directive, 'onMouseDown');
        canvasEl.triggerEventHandler('mousedown', event);

        expect(spy).toHaveBeenCalled();
    });
    it('mouseleave event should call #onMouseleave()', () => {
        let spy = spyOn(directive, 'onMouseleave');
        canvasEl.triggerEventHandler('mouseleave', null);

        expect(spy).toHaveBeenCalled();
    });
});
