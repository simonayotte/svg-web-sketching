import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormValuesName } from 'src/app/models/enums';
import { DrawingHandler } from 'src/app/services/drawing-handler/drawing-handler.service';
import { SaveDrawingService } from 'src/app/services/save-drawing-service/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { PreviewImageComponent } from '../preview-image/preview-image.component';
import { SaveDrawingComponent } from './save-drawing.component';

// tslint:disable:no-magic-numbers
// tslint:disable:max-line-length

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;
  const fb: FormBuilder = new FormBuilder();
  let store: DrawStore;
  let drawingHandler: DrawingHandler;
  let saveDrawingService: SaveDrawingService;
  const dialogMock = {
    close: () => {
        return;
    },
    open: () => {
      return;
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [SaveDrawingComponent],
        imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, OverlayModule, MatDialogModule, BrowserModule, BrowserAnimationsModule],
        providers: [
            {provide: MatDialogRef, useValue:  dialogMock },
            {provide: MatDialog, useValue: dialogMock},
            SaveDrawingService,
            DrawStore,
            DrawingHandler
        ],
    }).compileComponents();
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawingComponent);
    component = fixture.componentInstance;
    drawingHandler = TestBed.get(DrawingHandler);
    saveDrawingService = TestBed.get(SaveDrawingService);
    fixture.detectChanges();
    // clear the tags array before each test
    for (let i = 0; i < component.tags.length; i++) {
      component.tags.removeAt(i);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#addTag() should increase the size of #tags form array from 0 to 1', () => {
    component.addTag();
    expect(component.tags.length).toEqual(1);
  });

  it('#addTag() should add an empty tag', () => {
    component.addTag();
    expect(component.tags.at(0).value).toEqual('');
  });

  it('#addTag() should not add a tag if #tags is invalid', () => {
    component.saveDrawingForm.controls[FormValuesName.Tags].setErrors({incorrect: true});
    component.addTag();
    expect(component.tags.length).toEqual(0);
    component.saveDrawingForm.controls[FormValuesName.Tags].setErrors(null);
  });

  it('#getTagsValues() should set #tagStringArray to be contain all the values in the #tags form array', () => {
    component.tags.push(fb.control('Cat'));
    component.tags.push(fb.control('Dog'));
    component.tags.push(fb.control('Park'));
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cat', 'Dog', 'Park']);
  });

  it('#removeTags(2) should remove the third tag of tags', () => {
    component.tags.push(fb.control('Cat'));
    component.tags.push(fb.control('Dog'));
    component.tags.push(fb.control('Park'));
    component.removeTag(2);
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cat', 'Dog']);
  });

  it('#removeTags(0) should remove the first tag of tags', () => {
    component.tags.push(fb.control('Sun'));
    component.tags.push(fb.control('Cloud'));
    component.tags.push(fb.control('Red'));
    component.tags.push(fb.control('Orange'));
    component.removeTag(0);
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cloud', 'Red', 'Orange']);
  });

  it('after adding 5 tags in #tags, calling #removeTags(3) should set the length of #tags to 4', () => {
    component.tags.push(fb.control('Soccer'));
    component.tags.push(fb.control('Field'));
    component.tags.push(fb.control('Ball'));
    component.tags.push(fb.control('Goal'));
    component.tags.push(fb.control('Green'));
    component.removeTag(3);
    component.getTagsValues();
    expect(component.tags.length).toEqual(4);
  });

  it('#submit() should call #prepareDrawingExportation() of DrawingHandler', () => {
    spyOn(drawingHandler, 'prepareDrawingExportation').and.callThrough();
    component.submit();
    expect(drawingHandler.prepareDrawingExportation).toHaveBeenCalledWith('png');
  });

  it('#submit() should call #setImgName of  saveDrawingService', () => {
    spyOn(saveDrawingService, 'setImgName').and.callThrough();
    component.submit();
    expect(saveDrawingService.setImgName).toHaveBeenCalledWith(component.saveDrawingForm.controls[FormValuesName.Name].value);
  });

  it('#submit() should call #getTagsValues()', () => {
    spyOn(component, 'getTagsValues').and.callThrough();
    component.submit();
    expect(component.getTagsValues).toHaveBeenCalled();
  });

  it('#submit() should call #setTags of  saveDrawingService', () => {
    spyOn(saveDrawingService, 'setTags').and.callThrough();
    component.submit();
    expect(saveDrawingService.setTags).toHaveBeenCalled();
  });

  it('#submit() should open the PreviewImage dialog', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.submit();
    expect(component.dialog.open).toHaveBeenCalledWith(PreviewImageComponent);
  });
});
