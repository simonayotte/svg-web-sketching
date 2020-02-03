import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushComponent } from './brush.component';

describe('BrushComponent', () => {
    let component: BrushComponent;
    let fixture: ComponentFixture<BrushComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrushComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrushComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#setTexture should modify the value correctly', () => {
        component.setTexture('wave');
        expect(component.texture).toBe('wave');
    });

    it('#setTexture should not modify the value if the input string is not a valid texture ', () => {
        component.setTexture('text');
        expect(component.texture).toBe('normal');
    });
});
