import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ColorComponent } from 'src/app/components/tools/color/color.component';
import { CreateDrawingComponent } from 'src/app/components/dialogs/create-drawing-dialog/create-drawing.component'

describe('CreateDrawingComponent', () => {
    let component: CreateDrawingComponent;
    let fixture: ComponentFixture<CreateDrawingComponent>;
    const width = 'width';
    const height = 'height';
    const dialogMock = {
        close: () => {
            /*empty function*/
        },
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateDrawingComponent, ColorComponent],
            imports: [FormsModule, ReactiveFormsModule],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: { dialogMock },
                },
                
                
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onResize() should be called whent theres a resize event', () => {
        const spyOnResize = spyOn(component, 'onResize');
        window.dispatchEvent(new Event('resize'));
        expect(spyOnResize).toHaveBeenCalled();
    });

    it('#onResize() should modify the width value of the FormGroup', () => {
        component.createDrawingForm.patchValue({ width: 0 });
        window.dispatchEvent(new Event('resize'));
        expect(component.createDrawingForm.controls[width].value).toEqual(window.innerWidth);
    });

    it('#onResize() should modify the height value of the FormGroup', () => {
        component.createDrawingForm.patchValue({ height: 0 });
        window.dispatchEvent(new Event('resize'));
        expect(component.createDrawingForm.controls[height].value).toEqual(window.innerHeight);
    });

    it('#onResize() should not modify the width value of the FormGroup if #isWidthModified is true', () => {
        component.isWidthModified = true;
        component.createDrawingForm.patchValue({ width: 0 });
        window.dispatchEvent(new Event('resize'));
        expect(component.createDrawingForm.controls[width].value).toEqual(0);
    });

    it('#onResize() should not modify the height value of the FormGroup if #isHeightModified is true', () => {
        component.isHeightModified = true;
        component.createDrawingForm.patchValue({ height: 0 });
        window.dispatchEvent(new Event('resize'));
        expect(component.createDrawingForm.controls[height].value).toEqual(0);
    });

    it('#setIsWidthModifiedToTrue() should set #isWidthModified to true', () => {
        component.isWidthModified = false;
        component.setIsWidthChangedToTrue();
        expect(component.isWidthModified).toEqual(true);
    });

    it('#setIsHeightModifiedToTrue() should set #isHeightModified to true', () => {
        component.isHeightModified = false;
        component.setIsHeightChangedToTrue();
        expect(component.isHeightModified).toEqual(true);
    });

    it('a negative width value should set the #createDrawingForm to invalid', () => {
        component.createDrawingForm.patchValue({ width: -100 });
        expect(component.createDrawingForm.invalid).toBeTruthy();
    });

    it('a negative height value should set the #createDrawingForm to invalid', () => {
        component.createDrawingForm.patchValue({ height: -100 });
        expect(component.createDrawingForm.invalid).toBeTruthy();
    });

    it('a null width value should set the #createDrawingForm to invalid', () => {
        component.createDrawingForm.patchValue({ width: null });
        expect(component.createDrawingForm.invalid).toBeTruthy();
    });

    it('a null height value should set the #createDrawingForm to invalid', () => {
        component.createDrawingForm.patchValue({ width: null });
        expect(component.createDrawingForm.invalid).toBeTruthy();
    });

    it('a positive height and width value should set the #createDrawingForm to valid', () => {
        component.createDrawingForm.patchValue({ width: 100 });
        component.createDrawingForm.patchValue({ height: 100 });
        expect(component.createDrawingForm.invalid).toBeFalsy();
    });
});
