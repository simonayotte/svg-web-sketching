import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExportedDrawing } from 'src/app/models/exported-drawing';
import { HttpResponse } from 'src/app/models/http-response';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { DrawStore } from 'src/app/store/draw-store';
import { HttpService } from './http.service';

// tslint:disable:max-line-length
// Pour les fail
// tslint:disable:no-unused-expression

describe('HttpService', () => {
  let service: HttpService;
  let store: DrawStore;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(HttpService);
    store = TestBed.get(DrawStore);
    store.setDrawSvg(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#saveDrawing(drawing) with valid parameters should return a succesful http reponse', () => {
    const expectedResponse: HttpResponse = {status: '200', message: 'Image sauvegardée avec succès!'};
    const drawing: SavedDrawing = new SavedDrawing('TestImage', ['Test1', 'Test2'], 'TestDataURL', [], 0, 0, [0, 0, 0]);
    service.saveDrawing(drawing).subscribe((data) => {
      expect(data).toEqual(expectedResponse)
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.flush(expectedResponse);
  });

  it('#saveDrawing(drawing) with an empty name should return an error', () => {
    const expectedResponse = {status: '400', message: 'Erreur:Le nom est requis. Image non sauvegardée'};
    const drawing: SavedDrawing = new SavedDrawing('', ['Test1', 'Test2'], 'TestDataURL', [], 0, 0, [0, 0, 0]);
    service.saveDrawing(drawing).subscribe((err) => {
      expect(err).toEqual(expectedResponse)
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.flush(expectedResponse);
  });

  it('#saveDrawing(drawing) with special characters in the tags should return an error', () => {
    const expectedResponse = {status: '400', message: "Erreur:Les étiquettes ne doivent pas contenir de caractères spéciaux ou d'espaces. Image non sauvegardée"};
    const drawing: SavedDrawing = new SavedDrawing('', ['Test1@@@@!!!!', 'Test2'], 'TestDataURL', [], 0, 0, [0, 0, 0]);
    service.saveDrawing(drawing).subscribe((err) => {
      expect(err).toEqual(expectedResponse)
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.flush(expectedResponse);
  });

  it('#saveDrawing(drawing) with whitespace in the tags should return an error', () => {
    const expectedResponse = {status: '400', message: "Erreur:Les étiquettes ne doivent pas contenir de caractères spéciaux ou d'espaces. Image non sauvegardée"};
    const drawing: SavedDrawing = new SavedDrawing('', ['Test 1', 'Test2'], 'TestDataURL', [], 0, 0, [0, 0, 0]);
    service.saveDrawing(drawing).subscribe((err) => {
      expect(err).toEqual(expectedResponse)
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.flush(expectedResponse);
  });

  it('#saveDrawing(drawing) should handle errors correctly', () => {
    const drawing: SavedDrawing = new SavedDrawing('', ['Test 1', 'Test2'], 'TestDataURL', [], 0, 0, [0, 0, 0]);
    service.saveDrawing(drawing).subscribe((err) => {
      expect(err).toBeUndefined()
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/savedrawing');
    expect(req.request.method).toEqual('POST');
    req.error(new ErrorEvent('Random error occured'));
  });

  it('#exportDrawing(drawing) should return a successful httpResponse', () => {
    const expectedResponse: HttpResponse = {status: '200', message: 'Image exportée avec succès!'};
    const drawing: ExportedDrawing = new ExportedDrawing('TestImage', 'jpeg', 'abc@polymtl.ca','one', 'dataurl');
    service.exportDrawing(drawing).subscribe((response) => {
      expect(response).toEqual(expectedResponse)
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/exportdrawing');
    expect(req.request.method).toEqual('POST');
    req.flush(expectedResponse);
  });

  it('#exportDrawing(drawing) should handle errors correctly', () => {
    const drawing: ExportedDrawing = new ExportedDrawing('TestImage', 'jpeg', 'abc@polymtl.ca','one', 'dataurl');
    service.exportDrawing(drawing).subscribe((err) => {
      expect(err).toBeUndefined()
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/exportdrawing');
    expect(req.request.method).toEqual('POST');
    req.error(new ErrorEvent('Random error occured'));
  });

  it('getAllDrawings() should return the expected drawings', () => {
    const drawing1: SavedDrawing = new SavedDrawing('1', ['Test 1', 'Test2'], 'TestDataURL', [], 0, 0, [0, 0, 0]);
    const drawing2: SavedDrawing = new SavedDrawing('2', ['Test 2', 'Test2'], 'TestDataURL', [], 0, 0, [0, 0, 0]);
    const drawing3: SavedDrawing = new SavedDrawing('3', ['Test 3', 'Test2'], 'TestDataURL', [], 0, 0, [0, 0, 0]);
    const expectedDrawings: SavedDrawing[] = [drawing1, drawing2, drawing3];
    service.getAllDrawings().subscribe((response) => {
      expect(response).toEqual(expectedDrawings)
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/gallery');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedDrawings);
  });

  it('getAllDrawings() should handle errors correctly', () => {
    service.getAllDrawings().subscribe((response) => {
      expect(response).toBeUndefined()
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/gallery');
    expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('Random error occured'));
  });

  it('deleteDrawing(id) should return a succesful response', () => {
    const expectedResponse = {status: '200', message: 'Dessin supprimé avec succès!'};
    service.deleteDrawing('idtodelete').subscribe((response) => {
      expect(response).toEqual(expectedResponse)
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/gallery/delete/idtodelete');
    expect(req.request.method).toEqual('DELETE');
    req.flush(expectedResponse);
  });

  it('deleteDrawing(id) should handle errors correctly', () => {
    service.deleteDrawing('idtodelete').subscribe((response) => {
      expect(response).toBeUndefined()
    , fail; });
    const req = httpTestingController.expectOne('http://localhost:3000/gallery/delete/idtodelete');
    expect(req.request.method).toEqual('DELETE');
    req.error(new ErrorEvent('Random error occured'));
  });
});
