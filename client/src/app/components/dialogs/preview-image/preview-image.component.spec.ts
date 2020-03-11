import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { PreviewImageComponent } from './preview-image.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DrawStore } from 'src/app/store/draw-store';

describe('PreviewImageComponent', () => {
  let component: PreviewImageComponent;
  let fixture: ComponentFixture<PreviewImageComponent>;
  const dialogMock = {
    close: () => {
        /*empty function*/
    },
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [PreviewImageComponent],
        imports: [FormsModule, ReactiveFormsModule],
        providers: [
            {
                provide: MatDialogRef,
                useValue: { dialogMock },
            },
            DrawStore
        ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setPreviewImgDimension should set #previewWidth to be equal to the canvas width if the canvas width is smaller than 300 px', async(inject([DrawStore], (drawStore: DrawStore) => {
    drawStore.setCanvasWidth(150);
    component.setPreviewImgDimension()
    expect(component.previewWidth).toBe(150);
  })));

  it('#setPreviewImgDimension should set #previewHeight to be equal to the canvas height if the canvas width is smaller than 300 px', async(inject([DrawStore], (drawStore: DrawStore) => {
    drawStore.setCanvasHeight(200);
    component.setPreviewImgDimension()
    expect(component.previewHeight).toBe(200);
  })));
  
});
