import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from 'src/app/models/httpResponse';
import { SavedDrawing } from 'src/app/models/saved-drawing';
import { ExportedDrawing } from 'src/app/models/exported-drawing';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    return this.http.post<HttpResponse>(`${SERVER_URL}${SAVE_DRAWING}`, drawing).pipe(catchError(this.handleError<HttpResponse>('saveDrawing')));
  }
  
  exportDrawing(drawing:ExportedDrawing){
    return this.http.post<HttpResponse>(`${SERVER_URL}${EXPORT_DRAWING}`,drawing).pipe(catchError(this.handleError<HttpResponse>('exportDrawing')));
  }

  getAllDrawings(){
    return this.http.get<Array<SavedDrawing>>(`${SERVER_URL}${GALLERY}`).pipe(catchError(this.handleError<Array<SavedDrawing>>('getAllDrawings')));
  }

  deleteDrawing(id:string){
    return this.http.delete<HttpResponse>(`${SERVER_URL}${GALLERY}/${DELETE}/${id}`).pipe(catchError(this.handleError<HttpResponse>('deleteDrawing')));
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
        return of(result as T);
    };
}
}
