import { TestBed } from '@angular/core/testing';

import { DrawingHandler } from './drawing-handler.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { DrawStore } from 'src/app/store/draw-store';

describe('SaveDrawingService', () => {
  let service: DrawingHandler;
  let httpTestingController: HttpTestingController;
  let store: DrawStore;
  beforeEach(() => {
             TestBed.configureTestingModule({
              imports: [HttpClientTestingModule]
             });
             service = TestBed.get(DrawingHandler);
             httpTestingController = TestBed.get(HttpTestingController);
             store = TestBed.get(DrawStore);

             store.setCanvasHTML(document.createElement('canvas'));
         });

  afterEach(() => {
  //code taken from https://medium.com/better-programming/testing-http-requests-in-angular-with-httpclienttestingmodule-3880ceac74cf
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setImgName(name) should set the #imgName to the given name', () => {
    service.setImgName('Image');
    expect(service.getImgName()).toBe('Image');
  });

  it('#setDataURL(dataURL) should set the #dataURL to the given name', () => {
    service.setDataURL('imageURL');
    expect(service.getDataURL()).toBe('imageURL');  
  });

  it('#setTags(tags) should set the #tags to the given name', () => {
    service.setTags(['Sea','Beach','Waves']);
    expect(service.getTags()).toEqual(['Sea','Beach','Waves']);
  });


  it('#saveDrawing(drawing) with valid parameters should return a succesful http reponse', () => {
    let drawing:SavedDrawing = new SavedDrawing('TestImage',['Test1','Test2'],'TestDataURL');
    //code taken from https://medium.com/better-programming/testing-http-requests-in-angular-with-httpclienttestingmodule-3880ceac74cf
    service.saveDrawing(drawing).subscribe(data => expect(data).toEqual({status:'200',message:'Image sauvegardée avec succès!'}))
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.flush({status:'200',message:'Image sauvegardée avec succès!'});
  });

  it('#saveDrawing(drawing) with an empty name should return an error', () => {
    let drawing:SavedDrawing = new SavedDrawing('',['Test1','Test2'],'TestDataURL');
    //code taken from https://medium.com/better-programming/testing-http-requests-in-angular-with-httpclienttestingmodule-3880ceac74cf
    service.saveDrawing(drawing).subscribe(err => expect(err).toEqual({status:'400',message:'Erreur:Le nom est requis. Image non sauvegardée'}))
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.flush({status:'400',message:'Erreur:Le nom est requis. Image non sauvegardée'});
  });

  it('#saveDrawing(drawing) with special characters in the tags should return an error', () => {
    let drawing:SavedDrawing = new SavedDrawing('',['Test1@@@@!!!!','Test2'],'TestDataURL');
    //code taken from https://medium.com/better-programming/testing-http-requests-in-angular-with-httpclienttestingmodule-3880ceac74cf
    service.saveDrawing(drawing).subscribe(err => expect(err).toEqual({status:'400',message:"Erreur:Les étiquettes ne doivent pas contenir de caractères spéciaux ou d'espaces. Image non sauvegardée"}))
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.flush({status:'400',message:"Erreur:Les étiquettes ne doivent pas contenir de caractères spéciaux ou d'espaces. Image non sauvegardée"});
  });

  it('#saveDrawing(drawing) with whitespace in the tags should return an error', () => {
    let drawing:SavedDrawing = new SavedDrawing('',['Test 1','Test2'],'TestDataURL');
    //code taken from https://medium.com/better-programming/testing-http-requests-in-angular-with-httpclienttestingmodule-3880ceac74cf
    service.saveDrawing(drawing).subscribe(err => expect(err).toEqual({status:'400',message:"Erreur:Les étiquettes ne doivent pas contenir de caractères spéciaux ou d'espaces. Image non sauvegardée"}))
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.flush({status:'400',message:"Erreur:Les étiquettes ne doivent pas contenir de caractères spéciaux ou d'espaces. Image non sauvegardée"});
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to the canvas width if the canvas width is smaller than 300 px', () => {
    store.setCanvasWidth(150);
    service.setPreviewImgWidth()
    expect(service.getPreviewWidth()).toBe(150);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to the canvas height if the canvas height is smaller than 300 px', () => {
    store.setCanvasHeight(200);
    service.setPreviewImgHeight()
    expect(service.getPreviewHeight()).toBe(200);
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to 300px if the canvas width is larger than the canvas height and larger than 300px', ()=> {
    store.setCanvasHeight(500);
    store.setCanvasWidth(1000);
    service.setPreviewImgWidth()
    expect(service.getPreviewWidth()).toBe(300);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to 300px if the canvas height is larger than the canvas width and larger than 300px', ()=> {
    store.setCanvasHeight(1000);
    store.setCanvasWidth(500);
    service.setPreviewImgHeight()
    expect(service.getPreviewHeight()).toBe(300);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to 150px if the canvas height is half the size of the canvas width and larger than 300px', ()=> {
    store.setCanvasHeight(400);
    store.setCanvasWidth(800);
    service.setPreviewImgHeight()
    expect(service.getPreviewHeight()).toBe(150);
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to 150px if the canvas height is half the size of the canvas width and larger than 300px', ()=> {
    store.setCanvasHeight(800);
    store.setCanvasWidth(400);
    service.setPreviewImgWidth()
    expect(service.getPreviewWidth()).toBe(150);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to 150px if the canvas height is half the size of the canvas width and larger than 300px', ()=> {
    store.setCanvasHeight(350);
    store.setCanvasWidth(700);
    service.setPreviewImgHeight()
    expect(service.getPreviewHeight()).toBe(150);
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to 150px if the canvas height is half the size of the canvas width and larger than 300px', ()=> {
    store.setCanvasHeight(650);
    store.setCanvasWidth(325);
    service.setPreviewImgWidth()
    expect(service.getPreviewWidth()).toBe(150);
  });

  it('#setPreviewImgHeight() should set #previewHeight to be equal to 100px if the canvas height is a third of the size of the canvas width and larger than 300px', ()=> {
    store.setCanvasHeight(310);
    store.setCanvasWidth(930);
    service.setPreviewImgHeight()
    expect(service.getPreviewHeight()).toBe(100);
  });

  it('#setPreviewImgWidth() should set #previewWidth to be equal to 100px if the canvas width is a third of the size of the canvas height and larger than 300px', () => {
    store.setCanvasHeight(915);
    store.setCanvasWidth(305);
    service.setPreviewImgWidth()
    expect(service.getPreviewWidth()).toBe(100);
  });
});
