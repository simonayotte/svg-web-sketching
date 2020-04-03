import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingGalleryComponent } from './drawing-gallery.component';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DrawStore } from 'src/app/store/draw-store';
import { GalleryService } from 'src/app/services/gallery-service/gallery.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { DrawingStartedDialogComponent } from '../drawing-started-dialog/drawing-started-dialog.component';

fdescribe('DrawingGalleryComponent', () => {
  let component: DrawingGalleryComponent;
  let fixture: ComponentFixture<DrawingGalleryComponent>;
  let fb:FormBuilder = new FormBuilder();
  let store:DrawStore;
  let galleryService:GalleryService
  let httpService:HttpService
  const dialogMock = {
    close: () => {
        /*empty function*/
    },
    open: () => {
    },
  };
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [DrawingGalleryComponent],
        imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule,OverlayModule, MatDialogModule,BrowserModule,BrowserAnimationsModule],
        providers: [
            {provide: MatDialogRef, useValue:  dialogMock },
            {provide: MatDialog, useValue: dialogMock},
            HttpService,
            DrawStore,
            GalleryService
        ],
    }).compileComponents();
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingGalleryComponent);
    component = fixture.componentInstance;
    httpService = TestBed.get(HttpService);
    galleryService = TestBed.get(GalleryService);
    fixture.detectChanges();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    //clear the tags array before each test
    for(let i = 0; i < component.tags.length; i++){
      component.tags.removeAt(i);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should call #setIsKeyHandlerActive() of the store', () => {
    spyOn(store,'setIsKeyHandlerActive');
    component.ngOnInit();
    expect(store.setIsKeyHandlerActive).toHaveBeenCalledWith(false);
  });

  it('#ngOnInit() should call #updateGallery()', () => {
    spyOn(component,'updateGallery');
    component.ngOnInit();
    expect(component.updateGallery)
  });

  it('#ngOnDestroy() should call #setIsKeyHandlerActive() of the store', () => {
    spyOn(store,'setIsKeyHandlerActive');
    component.ngOnDestroy();
    expect(store.setIsKeyHandlerActive).toHaveBeenCalledWith(true);
  })

  it('#addTag() should increase the size of #tags form array from 0 to 1', () => {
    component.addTag();
    expect(component.tags.length).toEqual(1);
  });

  it('#addTag() should add an empty tag', () => {
    component.addTag();
    expect(component.tags.at(0).value).toEqual('');
  });

  it('#getTagsValues() should set #tagStringArray to be contain all the values in the #tags form array', () => {
    component.tags.push(fb.control('Cat'));
    component.tags.push(fb.control('Dog'));
    component.tags.push(fb.control('Park'));
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cat','Dog','Park'])
  });
  
  it('#removeTags(2) should remove the third tag of tags', () => {
    component.tags.push(fb.control('Cat'));
    component.tags.push(fb.control('Dog'));
    component.tags.push(fb.control('Park'));
    component.removeTag(2);
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cat','Dog'])
  });

  it('#removeTags(0) should remove the first tag of tags', () => {
    component.tags.push(fb.control('Sun'));
    component.tags.push(fb.control('Cloud'));
    component.tags.push(fb.control('Red'));
    component.tags.push(fb.control('Orange'));
    component.removeTag(0);
    component.getTagsValues();
    expect(component.tagStringArray).toEqual(['Cloud','Red','Orange'])
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

  it('#updateGallery() should call #getAllDrawings() of httpService', () => {
    spyOn(httpService, 'getAllDrawings');
    component.updateGallery();
    expect(httpService.getAllDrawings).toHaveBeenCalled();
  });

  it('#updateGallery() should call #setDrawings() of galleryService', (done:DoneFn) => {
    spyOn(galleryService, 'setDrawings');
    component.updateGallery().then(()=>{
      expect(galleryService.setDrawings).toHaveBeenCalled();
      done();
    });
  });

  it('#toggleTrashColor() should set #trashColor to #ff8c00 if #trashColor is black', () => {
    component.trashColor = 'black';
    component.toggleTrashColor();
    expect(component.trashColor).toEqual('#ff8c00');
  });

  it('#toggleTrashColor() should set #trashColor to black if #trashColor is #ff8c00', () => {
    component.trashColor = '#ff8c00';
    component.toggleTrashColor();
    expect(component.trashColor).toEqual('black');
  });

  it('#toggleTrashColor() should set #loadColor to black', () => {
    component.toggleTrashColor();
    expect(component.loadColor).toEqual('black');
  })

  it('#toggleLoadColor() should set #loadColor to #ff8c00 if #loadColor is black', () => {
    component.loadColor = 'black';
    component.toggleLoadColor();
    expect(component.loadColor).toEqual('#ff8c00');
  });

  it('#toggleLoadColor() should set #loadColor to black if #loadColor is #ff8c00', () => {
    component.loadColor = '#ff8c00';
    component.toggleLoadColor();
    expect(component.loadColor).toEqual('black');
  });


  it('#toggleLoadColor() should set #trashColor to black', () => {
    component.toggleLoadColor();
    expect(component.trashColor).toEqual('black');
  });

  it('if #loadColor is #ff8c00 and svgs of svgState is empty, #loadDrawing() should call #loadDrawing() of galleryService should be called', () => {
    spyOn(galleryService,'loadDrawing').and.callThrough();
    component.loadColor = '#ff8c00';
    store.emptySvg();
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(galleryService.loadDrawing).toHaveBeenCalledWith(drawing);
  });

  it('if #loadColor is #ff8c00 and svgs of svgState is empty,calling #loadDrawing() should close the dialog', () => {
    spyOn(component.dialogRef,'close').and.callThrough();
    component.loadColor = '#ff8c00';
    store.emptySvg();
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('if #loadColor is #ff8c00 and svgs of svgState is not empty, #loadDrawing() should call #setDrawingToLoad() of galleryService should be called', () => {
    spyOn(galleryService,'setDrawingToLoad').and.callThrough();
    component.loadColor = '#ff8c00';
    let rect:SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    store.pushSvg(rect);
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(galleryService.setDrawingToLoad).toHaveBeenCalledWith(drawing);
  });

  it('if #loadColor is #ff8c00 and svgs of svgState is not empty, #loadDrawing() should call #setDidGalleryOpen() of galleryService should be called', () => {
    spyOn(galleryService,'setDidGalleryOpen').and.callThrough();
    component.loadColor = '#ff8c00';
    let rect:SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    store.pushSvg(rect);
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(galleryService.setDidGalleryOpen).toHaveBeenCalledWith(true);
  });

  it('if #loadColor is #ff8c00 and svgs of svgState is not empty, #loadDrawing() should close the dialog', () => {
    spyOn(component.dialogRef,'close').and.callThrough();
    component.loadColor = '#ff8c00';
    let rect:SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    store.pushSvg(rect);
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('if #loadColor is #ff8c00 and svgs of svgState is not empty, #loadDrawing() should open the drawing started dialog', () => {
    spyOn(component.dialog,'open').and.callThrough();
    component.loadColor = '#ff8c00';
    let rect:SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    store.pushSvg(rect);
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(component.dialog.open).toHaveBeenCalledWith(DrawingStartedDialogComponent);
  });

  it('if #loadColor is black and svgs of svgState is empty, #loadDrawing() should not call #loadDrawing() of galleryService should not be called', () => {
    spyOn(galleryService,'loadDrawing').and.callThrough();
    component.loadColor = 'black'
    store.emptySvg();
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(galleryService.loadDrawing).not.toHaveBeenCalledWith(drawing);
  });

  it('if #loadColor is black and svgs of svgState is empty, #loadDrawing() should not close the dialog', () => {
    spyOn(component.dialogRef,'close').and.callThrough();
    component.loadColor = 'black'
    store.emptySvg();
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(component.dialogRef.close).not.toHaveBeenCalled();
  });

  it('if #loadColor is black and svgs of svgState is not empty, #loadDrawing() should not call #setDrawingToLoad() of galleryService should not be called', () => {
    spyOn(galleryService,'setDrawingToLoad').and.callThrough();
    component.loadColor = 'black'
    let rect:SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    store.pushSvg(rect);
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(galleryService.setDrawingToLoad).not.toHaveBeenCalledWith(drawing);
  });

  it('if #loadColor is black and svgs of svgState is not empty, #loadDrawing() should not call #setDidGalleryOpen() of galleryService should not be called', () => {
    spyOn(galleryService,'setDidGalleryOpen').and.callThrough();
    component.loadColor = 'black'
    let rect:SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    store.pushSvg(rect);
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(galleryService.setDidGalleryOpen).not.toHaveBeenCalledWith(true);
  });

  it('if #loadColor is black and svgs of svgState is not empty, #loadDrawing() should not close the dialog', () => {
    spyOn(component.dialogRef,'close').and.callThrough();
    component.loadColor = 'black'
    let rect:SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    store.pushSvg(rect);
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(component.dialogRef.close).not.toHaveBeenCalled();
  });

  it('if #loadColor is black and svgs of svgState is not empty, #loadDrawing() should not open the drawing started dialog', () => {
    spyOn(component.dialog,'open').and.callThrough();
    component.loadColor = 'black'
    let rect:SVGGraphicsElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    store.pushSvg(rect);
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.loadDrawing(drawing);
    expect(component.dialog.open).not.toHaveBeenCalledWith(DrawingStartedDialogComponent);
  });

  it('if #trashColor is #ff8c00, #deleteDrawing should call #deleteDrawing() of httpService', ()=>{
    spyOn(httpService,'deleteDrawing').and.callThrough();
    component.trashColor = '#ff8c00'
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.deleteDrawing(drawing);
    expect(httpService.deleteDrawing).toHaveBeenCalledWith(drawing._id);
  });

  it('if #trashColor is #ff8c00, #deleteDrawing should call #updateGallery', (done: DoneFn) => {
    const spy = spyOn(component, 'updateGallery');
    component.trashColor = '#ff8c00';
    let drawing = new SavedDrawing('test', ['testtag'], 'testdataurl', [], 100, 100, [1, 2, 3]);
    component.deleteDrawing(drawing).then(() => {
        expect(spy).toHaveBeenCalled();
        done();
    });
});


  it('if #trashColor is black, #deleteDrawing should not call #deleteDrawing() of httpService', () =>{
    spyOn(httpService,'deleteDrawing');
    component.trashColor = '#black'
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.deleteDrawing
    expect(httpService.deleteDrawing).not.toHaveBeenCalledWith(drawing);
  });

  it('if #trashColor is black, #deleteDrawing should mot call #updateGallery', (done:DoneFn)=>{
    spyOn(component,'updateGallery')
    component.trashColor = '#black'
    let drawing = new SavedDrawing('test',['testtag'],'testdataurl',[],100,100,[1,2,3])
    component.deleteDrawing(drawing).then(()=>{
      expect(component.updateGallery).not.toHaveBeenCalled()
      done()
    })
  })

  it('#filterDrawings() should call #getTagsValues', ()=>{
    spyOn(component,'getTagsValues').and.callThrough();
    component.filterDrawings();
    expect(component.getTagsValues).toHaveBeenCalled();
  });

  it('#if #tagStringArray is not empty and doesnt contain an empty string, #filterDrawings() of galleryService should be called', ()=>{
    spyOn(galleryService,'filterDrawings').and.callThrough();
    component.tags.push(fb.control('tagtest'));
    component.filterDrawings();
    expect(galleryService.filterDrawings).toHaveBeenCalledWith(component.tagStringArray, component.allDrawingsInDb);
  });

  it('#if #filterDrawings() of galleryService return an empty array, #noFilteredDrawingFound should be true', ()=>{
    component.tags.push(fb.control('notagfound'));
    component.filterDrawings();
    expect(component.noFilteredDrawingFound).toBe(true);
  });

  it('#if #filterDrawings() of galleryService does not return an empty array, #noFilteredDrawingFound should be false', ()=>{
    let drawing = new SavedDrawing('test',['tag'],'testdataurl',[],100,100,[1,2,3])
    component.tags.push(fb.control('tag'));
    component.allDrawingsInDb.push(drawing);
    component.filterDrawings();
    component.allDrawingsInDb.pop();
    expect(component.noFilteredDrawingFound).toBe(false);
  });

  it('if #tagStringArray is empty, #setDrawings() of galleryService should be called', ()=> {
    spyOn(galleryService,'setDrawings').and.callThrough();
    component.filterDrawings();
    expect(galleryService.setDrawings).toHaveBeenCalledWith(component.allDrawingsInDb);
  });

  it('if #tagStringArray is empty, #noFilteredDrawingFound should be false', ()=> {
    component.filterDrawings();
    expect(component.noFilteredDrawingFound).toEqual(false);
  });

  it('if #tagStringArray contains an empty string, #setDrawings() of galleryService should be called', ()=> {
    spyOn(galleryService,'setDrawings').and.callThrough();
    component.tags.push(fb.control(''));
    component.tags.push(fb.control('truck'));
    component.filterDrawings();
    expect(galleryService.setDrawings).toHaveBeenCalledWith(component.allDrawingsInDb);
  });

  it('if #tagStringArray contains an empty string, #noFilteredDrawingFound should be false', ()=> {
    component.tags.push(fb.control(''));
    component.tags.push(fb.control('blue'));
    component.filterDrawings();
    expect(component.noFilteredDrawingFound).toEqual(false);
  });
});
