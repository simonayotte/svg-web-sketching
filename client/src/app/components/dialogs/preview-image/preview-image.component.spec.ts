import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { defer, Observable } from 'rxjs';
import { HttpResponse } from 'src/app/models/http-response';
import { HttpService } from 'src/app/services/http-service/http.service';
import { SaveDrawingService } from 'src/app/services/save-drawing-service/save-drawing.service';
import { DrawStore } from 'src/app/store/draw-store';
import { PreviewImageComponent } from './preview-image.component';

const fakeAsyncResponse = (data: HttpResponse) => {
    return defer(() => Promise.resolve(data));
};

const httpServiceStub = {
    saveDrawing(): Observable<HttpResponse> {
        return fakeAsyncResponse({ status: '200', message: 'Image sauvegardée avec succès!' });
    },
};
describe('PreviewImageComponent', () => {
  let component: PreviewImageComponent;
  let store: DrawStore;
  let fixture: ComponentFixture<PreviewImageComponent>;
  let httpService: HttpService;
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
        declarations: [PreviewImageComponent],
        imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, BrowserAnimationsModule],
        providers: [
              {provide: MatDialogTitle, useValue: {}},
              {provide: MatDialogRef, useValue: dialogMock},
              {provide: MAT_DIALOG_DATA, useValue: []},
              {provide: HttpService, useValue: httpServiceStub},
              {provide: MatDialog, useValue: dialogMock},
            DrawStore,
            SaveDrawingService,
        ],
    }).compileComponents();
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewImageComponent);
    component = fixture.componentInstance;
    httpService = TestBed.get(HttpService);
    saveDrawingService = TestBed.get(SaveDrawingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getSvgsHTML() should set #svgsHTML to be equal an array of string equal to the outerHTML of the svgs that are drawn', () => {
    const ellipsis: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    const rect: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const line: SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    store.pushSvg(ellipsis);
    store.pushSvg(rect);
    store.pushSvg(line);
    const svgsHTML: string[] = [ellipsis.outerHTML, rect.outerHTML, line.outerHTML];
    component.getSvgsHTML();
    expect(component.svgsHTML).toEqual(svgsHTML);
  });

  it('#saveDrawing() should call #getSvgsHTML()', () => {
    spyOn(component, 'getSvgsHTML').and.callThrough();
    component.saveDrawing();
    expect(component.getSvgsHTML).toHaveBeenCalled();
  });

  it('#saveDrawing() should call #saveDrawing() of httpService', () => {
    spyOn(httpService, 'saveDrawing').and.callThrough();
    component.saveDrawing();
    expect(httpService.saveDrawing).toHaveBeenCalled();
  });

  it('#saveDrawing() should call #getImgName() of saveDrawingService', () => {
    spyOn(saveDrawingService, 'getImgName').and.callThrough();
    component.saveDrawing();
    expect(saveDrawingService.getImgName).toHaveBeenCalled();
  });

  it('#saveDrawing() should call #getTags() of saveDrawingService', () => {
    spyOn(saveDrawingService, 'getTags').and.callThrough();
    component.saveDrawing();
    expect(saveDrawingService.getTags).toHaveBeenCalled();
  });

  it('#saveDrawing() should close the dialog in the promise', (done: DoneFn) => {
    spyOn(component.dialogRef, 'close');
    component.saveDrawing().then(() => {
      expect(component.dialogRef.close).toHaveBeenCalled();
      done();
    });
  });

  it('#saveDrawing() should set #buttonDisabled to false in the promise', (done: DoneFn) => {
    component.saveDrawing().then(() => {
      expect(component.buttonDisabled).toEqual(false);
      done();
    });
  });

  it('saveDrawing() should set #buttonDisabled to true', () => {
    component.saveDrawing();
    expect(component.buttonDisabled).toEqual(true);
  });
});
