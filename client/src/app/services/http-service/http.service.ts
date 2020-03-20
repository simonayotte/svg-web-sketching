import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from 'src/app/models/httpResponse';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { ExportedDrawing } from 'src/app/models/exported-drawing';

const SERVER_URL: string = 'http://localhost:3000/'
const SAVE_DRAWING: string = 'savedrawing';
const EXPORT_DRAWING: string = 'exportdrawing';

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
}
