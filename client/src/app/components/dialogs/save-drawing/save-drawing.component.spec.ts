import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { SaveDrawingComponent } from './save-drawing.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material';
import { DrawStore } from 'src/app/store/draw-store';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { PreviewImageComponent } from '../preview-image/preview-image.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;
  let fb:FormBuilder = new FormBuilder();
  const NAME_STRING = 'name';
  const TAGS_STRING = 'tags';
  const dialogMock = {
    close: () => {
        /*empty function*/
    },
    open: () => {
      
    },
  };
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [SaveDrawingComponent],
        imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule,OverlayModule, MatDialogModule,BrowserModule,BrowserAnimationsModule],
        providers: [
            {provide: MatDialogRef, useValue:  dialogMock },
            {provide: MatDialog, useValue: dialogMock},
            DrawStore,
            SaveDrawingService
        ],
    }).compileComponents();
    let store: DrawStore = TestBed.get(DrawStore);

    store.setCanvasHTML(document.createElement('canvas'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //clear the tags array before each test
    for(let i = 0; i < component.tags.length; i++){
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
    expect(component.tags.at(0).value[0]).toEqual('');
  });

  it('#addTag() should not add a tag if #tags is invalid', () => {
    component.saveDrawingForm.controls[TAGS_STRING].setErrors({'incorrect': true});
    component.addTag();
    expect(component.tags.length).toEqual(0);
    component.saveDrawingForm.controls[TAGS_STRING].setErrors(null);
  });

  it('#getTagsValues() should set #tagStringArray to be contain all the values in the #tags form array', () => {
    component.tags.push(fb.control(['Cat']));
    component.tags.push(fb.control(['Dog']));
    component.tags.push(fb.control(['Park']));
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cat','Dog','Park'])
  });
  
  it('#removeTags(index) should remove the third tag of tags', () => {
    component.tags.push(fb.control(['Cat']));
    component.tags.push(fb.control(['Dog']));
    component.tags.push(fb.control(['Park']));
    component.removeTag(2);
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cat','Dog'])
  });

  it('#removeTags(index) should remove the first tag of tags', () => {
    component.tags.push(fb.control(['Sun']));
    component.tags.push(fb.control(['Cloud']));
    component.tags.push(fb.control(['Red']));
    component.tags.push(fb.control(['Orange']));
    component.removeTag(0);
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cloud','Red','Orange'])
  });

  it('after adding 5 tags in #tags, calling #removeTags(index) should set the length of #tags to 4', () => {
    component.tags.push(fb.control(['Soccer']));
    component.tags.push(fb.control(['Field']));
    component.tags.push(fb.control(['Ball']));
    component.tags.push(fb.control(['Goal']));
    component.tags.push(fb.control(['Green']));
    component.removeTag(3);
    component.getTagsValues();
    expect(component.tags.length).toEqual(4);
  });

  it('#submit() should call #setDataURL of saveDrawingService', async(inject([SaveDrawingService], (saveDrawingService: SaveDrawingService) => {
    spyOn(saveDrawingService,'setDataURL').and.callThrough();
    component.submit();
    expect(saveDrawingService.setDataURL).toHaveBeenCalledWith(saveDrawingService.setImgBackgroundColor());
  })));

  it('#submit() should call #setImgName of  saveDrawingService', async(inject([SaveDrawingService], (saveDrawingService: SaveDrawingService) => {
    spyOn(saveDrawingService,'setImgName').and.callThrough();
    component.submit();
    expect(saveDrawingService.setImgName).toHaveBeenCalledWith(component.saveDrawingForm.controls[NAME_STRING].value);
  })));

  it('#submit() should call #setTags of  saveDrawingService', async(inject([SaveDrawingService], (saveDrawingService: SaveDrawingService) => {
    spyOn(saveDrawingService,'setTags').and.callThrough();
    component.submit();
    expect(saveDrawingService.setTags).toHaveBeenCalled();
  })));

  it('#submit() should open the PreviewImage dialog', () => {
    spyOn(component.dialog,'open').and.callThrough();
    component.submit();
    expect(component.dialog.open).toHaveBeenCalledWith(PreviewImageComponent)
  });




});
