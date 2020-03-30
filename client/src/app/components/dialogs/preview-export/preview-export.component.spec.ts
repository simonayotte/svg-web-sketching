import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewExportComponent } from './preview-export.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DrawStore } from 'src/app/store/draw-store';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { SafeUrlPipe } from 'src/app/pipes/safe-url.pipe';

describe('PreviewExportComponent', () => {
  let component: PreviewExportComponent;
  let fixture: ComponentFixture<PreviewExportComponent>;
  let store:DrawStore;
  let httpService:HttpService;
  let exportDrawingService:ExportDrawingService
  const dialogMock = {
    close: () => {
        /*empty function*/
    },
  };
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [PreviewExportComponent, SafeUrlPipe],
        imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, BrowserAnimationsModule],
        providers: [
              {provide: MatDialogTitle, useValue: {}},
              {provide: MatDialogRef, useValue: dialogMock},
              {provide: MAT_DIALOG_DATA, useValue: []},
            DrawStore,
            ExportDrawingService,
            HttpService
        ],
    }).compileComponents();
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewExportComponent);
    component = fixture.componentInstance;
    httpService = TestBed.get(HttpService)
    exportDrawingService = TestBed.get(ExportDrawingService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#exportDrawing() should call #getExportName() of exportDrawingService', ()=> {
    spyOn(exportDrawingService,'getExportName').and.callThrough();
    component.exportDrawing()
    expect(exportDrawingService.getExportName).toHaveBeenCalled();
  })
  
  it('#exportDrawing() should call #getType() of exportDrawingService', ()=> {
    spyOn(exportDrawingService,'getType').and.callThrough();
    component.exportDrawing()
    expect(exportDrawingService.getType).toHaveBeenCalled();
  })

  it('#exportDrawing() should call #exportDrawing() of httpService', ()=> {
    spyOn(httpService,'exportDrawing').and.callThrough();
    component.exportDrawing()
    expect(httpService.exportDrawing).toHaveBeenCalled();
  })
});
