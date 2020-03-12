import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PreviewImageComponent } from './preview-image.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material';
import { DrawStore } from 'src/app/store/draw-store';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PreviewImageComponent', () => {
  let component: PreviewImageComponent;
  let store:DrawStore;
  let fixture: ComponentFixture<PreviewImageComponent>;
  const dialogMock = {
    close: () => {
        /*empty function*/
    },
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [PreviewImageComponent],
        imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, BrowserAnimationsModule],
        providers: [
              {provide: MatDialogTitle, useValue: {}},
              {provide: MatDialogRef, useValue: dialogMock},
              {provide: MAT_DIALOG_DATA, useValue: []},
            DrawStore,
            SaveDrawingService
        ],
    }).compileComponents();
    store = TestBed.get(DrawStore);

    store.setCanvasHTML(document.createElement('canvas'));
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#saveDrawing() should call #saveDrawing of the saveDrawingService', async(inject([SaveDrawingService], (saveDrawingService: SaveDrawingService) => {
    spyOn(saveDrawingService,'saveDrawing').and.callThrough();
    component.saveDrawing()
    expect(saveDrawingService.saveDrawing).toHaveBeenCalled();
  })));

  it('#saveDrawing() should close the dialog', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.saveDrawing()
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
  
});
