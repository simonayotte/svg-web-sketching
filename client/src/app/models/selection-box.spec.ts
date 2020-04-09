import { TestBed } from '@angular/core/testing';
import { SelectionBox } from './selection-box';
/* tslint:disable:no-magic-numbers */
describe('Color', () => {
    let selectionBox: SelectionBox = new SelectionBox(0, 0, 0, 0);
    let rect: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    let circle: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    beforeEach(() => {
        TestBed.configureTestingModule({});
        spyOn(rect, 'getBoundingClientRect').and.returnValue(new DOMRect(200, 200, 100, 100));
        spyOn(circle, 'getBoundingClientRect').and.returnValue(new DOMRect(75, 300, 50, 125));
    });

    it('should create', () => {
        expect(selectionBox).toBeTruthy();
    });

    it('#set() should set #display to true if new #svgs is not empty', () => {
        selectionBox.svgs = [rect];
        expect(selectionBox.display).toBeTruthy();
    });
    it('#set() should set #display to false if new #svgs is empty', () => {
        selectionBox.svgs = [];
        expect(selectionBox.display).toBeFalsy();
    });

    it('#set() should set #x to position x of most left svg', () => {
        selectionBox.svgs = [rect, circle];
        expect(selectionBox.x).toEqual(75 - 52); //52 is sidebar width
    });

    it('#set() should set #y to position y of most top svg', () => {
        selectionBox.svgs = [rect, circle];
        expect(selectionBox.y).toEqual(200);
    });

    it('#set() should set #width to difference between most right svg and most left svg x positions', () => {
        selectionBox.svgs = [rect, circle];
        expect(selectionBox.width).toEqual(200 + 100 - 75);
    });

    it('#set() should set #height to difference between most bottom svg and most top svg y positions', () => {
        selectionBox.svgs = [rect, circle];
        expect(selectionBox.height).toEqual(300 + 125 - 200);
    });
});
