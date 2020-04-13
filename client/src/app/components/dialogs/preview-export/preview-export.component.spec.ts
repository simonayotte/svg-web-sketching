import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { defer, Observable } from 'rxjs';
import { HttpResponse } from 'src/app/models/httpResponse';
import { SafeUrlPipe } from 'src/app/pipes/safe-url.pipe';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { DrawStore } from 'src/app/store/draw-store';
import { PreviewExportComponent } from './preview-export.component';

export function fakeAsyncResponse<T>(data: T): Observable<T> {
  return defer(() => Promise.resolve(data));
}

const httpServiceStub = {
    exportDrawing(): Observable<HttpResponse> {
        return fakeAsyncResponse({ status: '200', message: 'Image exportée avec succès!' });
    },
};

describe('PreviewExportComponent', () => {
  let component: PreviewExportComponent;
  let fixture: ComponentFixture<PreviewExportComponent>;
  let store: DrawStore;
  let httpService: HttpService;
  let exportDrawingService: ExportDrawingService;
  const dialogMock = {
    close: () => {
        /*empty function*/
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [PreviewExportComponent, SafeUrlPipe],
        imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, BrowserAnimationsModule],
        providers: [
              {provide: MatDialogTitle, useValue: {}},
              {provide: MatDialogRef, useValue: dialogMock},
              {provide: MAT_DIALOG_DATA, useValue: []},
              {provide: HttpService, useValue: httpServiceStub},
            DrawStore,
            ExportDrawingService,
        ],
    }).compileComponents();
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewExportComponent);
    component = fixture.componentInstance;
    httpService = TestBed.get(HttpService);
    exportDrawingService = TestBed.get(ExportDrawingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#exportDrawing() should call #getExportName() of exportDrawingService', () => {
    spyOn(exportDrawingService, 'getExportName').and.callThrough();
    component.exportDrawing();
    expect(exportDrawingService.getExportName).toHaveBeenCalled();
  });

  it('#exportDrawing() should call #getType() of exportDrawingService', () => {
    spyOn(exportDrawingService, 'getType').and.callThrough();
    component.exportDrawing();
    expect(exportDrawingService.getType).toHaveBeenCalled();
  });

  it('#exportDrawing() should call #exportDrawing() of httpService', () => {
    spyOn(httpService, 'exportDrawing').and.callThrough();
    component.exportDrawing();
    expect(httpService.exportDrawing).toHaveBeenCalled();
  });

  it('#exportDrawing() should call #window.alert() in the promise', (done: DoneFn) => {
    let message: string;
    httpServiceStub.exportDrawing().subscribe((data) => {
      message = data.message;
    });
    spyOn(window, 'alert');
    component.exportDrawing().then(() => {
      expect(window.alert).toHaveBeenCalledWith(message);
      done();
    });
  });

});
