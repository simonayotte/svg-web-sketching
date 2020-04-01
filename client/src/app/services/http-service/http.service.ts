import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExportedDrawing } from 'src/app/models/exported-drawing';
import { HttpResponse } from 'src/app/models/httpResponse';
import { SavedDrawing } from 'src/app/models/saved-drawing';

const SERVER_URL = 'http://localhost:3000/';
const SAVE_DRAWING = 'savedrawing';
const EXPORT_DRAWING = 'exportdrawing';
const GALLERY = 'gallery';
const DELETE = 'delete';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  saveDrawing(drawing: SavedDrawing) {
    return this.http.post<HttpResponse>(`${SERVER_URL}${SAVE_DRAWING}`, drawing).pipe(catchError(this.handleError<HttpResponse>('saveDrawing')));
  }

  exportDrawing(drawing: ExportedDrawing) {
    return this.http.post<HttpResponse>(`${SERVER_URL}${EXPORT_DRAWING}`, drawing).pipe(catchError(this.handleError<HttpResponse>('exportDrawing')));
  }

  getAllDrawings() {
    return this.http.get<SavedDrawing[]>(`${SERVER_URL}${GALLERY}`).pipe(catchError(this.handleError<SavedDrawing[]>('getAllDrawings')));
  }

  deleteDrawing(id: string) {
    return this.http.delete<HttpResponse>(`${SERVER_URL}${GALLERY}/${DELETE}/${id}`).pipe(catchError(this.handleError<HttpResponse>('deleteDrawing')));
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
        return of(result as T);
    };
}
}
