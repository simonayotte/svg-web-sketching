import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PreviewImageComponent } from './preview-image.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material';
import { DrawStore } from 'src/app/store/draw-store';
import { SaveDrawingService } from 'src/app/services/save-drawing-service/save-drawing.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from 'src/app/services/http-service/http.service';

describe('PreviewImageComponent', () => {
  let component: PreviewImageComponent;
  let store:DrawStore;
  let fixture: ComponentFixture<PreviewImageComponent>;
  let httpService: HttpService;
  let saveDrawingService: SaveDrawingService
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
            SaveDrawingService,
            HttpService
        ],
    }).compileComponents();
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewImageComponent);
    component = fixture.componentInstance;
    httpService = TestBed.get(HttpService)
    saveDrawingService = TestBed.get(SaveDrawingService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getSvgsHTML() should set #svgsHTML to be equal an array of string equal to the outerHTML of the svgs that are drawn', () => {
    let ellipsis:SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    let rect:SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    let line:SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    store.pushSvg(ellipsis);
    store.pushSvg(rect);
    store.pushSvg(line);
    let svgsHTML:Array<string> = [ellipsis.outerHTML, rect.outerHTML, line.outerHTML] 
    component.getSvgsHTML();
    expect(component.svgsHTML).toEqual(svgsHTML);
  })

  it('#saveDrawing() should call #getSvgsHTML()', () => {
    spyOn(component,'getSvgsHTML').and.callThrough();
    component.saveDrawing()
    expect(component.getSvgsHTML).toHaveBeenCalled();
  });

  it('#saveDrawing() should call #saveDrawing() of httpService', () => {
    spyOn(httpService, 'saveDrawing').and.callThrough();;
    component.saveDrawing()
    expect(httpService.saveDrawing).toHaveBeenCalled()
  });

  it('#saveDrawing() should call #getImgName() of saveDrawingService', () => {
    spyOn(saveDrawingService, 'getImgName').and.callThrough();;
    component.saveDrawing()
    expect(saveDrawingService.getImgName).toHaveBeenCalled()
  });

  it('#saveDrawing() should call #getTags() of saveDrawingService', () => {
    spyOn(saveDrawingService, 'getTags').and.callThrough();;
    component.saveDrawing()
    expect(saveDrawingService.getTags).toHaveBeenCalled()
  });

  it('#saveDrawing() should close the dialog in the promise', () => {
    spyOn(component.dialogRef, 'close').and.callThrough();
    component.saveDrawing().then(()=>{
      expect(component.dialogRef.close).toHaveBeenCalled();
    })
  });

  it('saveDrawing() should set #buttonDisabled to true', () => {
    component.saveDrawing();
    expect(component.buttonDisabled).toEqual(true);
  })
});
