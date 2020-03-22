import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from 'src/app/models/httpResponse';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { ExportedDrawing } from 'src/app/models/exported-drawing';
import { Drawing } from '../../../../../common/models/drawing';

const SERVER_URL: string = 'http://localhost:3000/'
const SAVE_DRAWING: string = 'savedrawing';
const EXPORT_DRAWING: string = 'exportdrawing';
const GALLERY: string = 'gallery'
const DELETE: string = 'delete'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { }

  saveDrawing(drawing:SavedDrawing){
    return this.http.post<HttpResponse>(`${SERVER_URL}${SAVE_DRAWING}`, drawing)
  }
  
  exportDrawing(drawing:ExportedDrawing){
    return this.http.post<HttpResponse>(`${SERVER_URL}${EXPORT_DRAWING}`,drawing)
  }

  getAllDrawings(){
    return this.http.get<Array<Drawing>>(`${SERVER_URL}${GALLERY}`)
  }

  deleteDrawing(id:string){
    return this.http.delete<HttpResponse>(`${SERVER_URL}${GALLERY}/${DELETE}/${id}`);
  }
}
