// import { ElementRef } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { MatDialogModule } from '@angular/material';
// import { By } from '@angular/platform-browser';
// import { BrushComponent } from 'src/app/components/tools/brush/brush.component';
// import { ColorComponent } from 'src/app/components/tools/color/color.component';
// import { DrawPageComponent } from 'src/app/components/draw-page/draw-page.component';
// import { GuideComponent } from 'src/app/components/guide/guide.component';
// import { PencilComponent } from 'src/app/components/tools/pencil/pencil.component';
// import { RectangleComponent } from 'src/app/components/tools/rectangle/rectangle.component';
// import { RectangleService } from 'src/app/services/tools/rectangle/rectangle.service';
// import { LineComponent } from '../line/line.component';

// describe('RectangleComponent', () => {
//     let component: RectangleComponent;
//     let drawStateService: DrawStateService;
//     let fixture: ComponentFixture<RectangleComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [BrushComponent, DrawPageComponent, GuideComponent, PencilComponent, RectangleComponent, ColorComponent, LineComponent],
//             providers: [DrawStateService, RectangleService],
//             imports: [FormsModule, MatDialogModule],
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         drawStateService = TestBed.get(DrawStateService);
//         const drawPageFixture: ComponentFixture<DrawPageComponent> = TestBed.createComponent(DrawPageComponent);
//         const canvasRef = new ElementRef(drawPageFixture.debugElement.nativeElement.querySelector('.canvas'));
//         drawStateService.setCanvasRef(canvasRef);
//         drawStateService.setCanvasContext(canvasRef.nativeElement.getContext('2d'));
//         fixture = TestBed.createComponent(RectangleComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should correctly call setRectangleType when cliking on a type button', () => {
//         const setRectangleTypeSpy = spyOn(component, 'setRectangleType');
//         const button = fixture.debugElement.query(By.css('.rectangle-style-box'));
//         button.triggerEventHandler('click', {});
//         fixture.detectChanges();
//         expect(setRectangleTypeSpy).toHaveBeenCalledTimes(1);
//     });

//     it('setRectangleType should call rectangleService.setRectangleType', () => {
//         const service: RectangleService = TestBed.get(RectangleService);
//         const serviceSpy = spyOn(service, 'setRectangleType');
//         component.setRectangleType('fill only');
//         expect(serviceSpy).toHaveBeenCalled();
//     });

//     it('should correctly call setThickness when using the slider', () => {
//         const setThicknessSpy = spyOn(component, 'setThickness');
//         const slider = fixture.debugElement.query(By.css('.slider'));
//         slider.triggerEventHandler('input', {});
//         fixture.detectChanges();
//         expect(setThicknessSpy).toHaveBeenCalledTimes(1);
//     });

//     it('should correctly call changeSquareToRectangle when pressing shift', () => {
//         const setThicknessSpy = spyOn(component, 'changeSquareToRectangle');
//         const testEventDown = new KeyboardEvent('keydown', {
//             key: 'Shift',
//         });
//         document.dispatchEvent(testEventDown);
//         fixture.detectChanges();
//         expect(setThicknessSpy).toHaveBeenCalledTimes(1);
//         const testEventUp = new KeyboardEvent('keyup', {
//             key: 'Shift',
//         });
//         document.dispatchEvent(testEventUp);
//         fixture.detectChanges();
//         expect(setThicknessSpy).toHaveBeenCalledTimes(2);
//     });
// });
