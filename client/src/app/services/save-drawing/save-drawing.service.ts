import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Drawing } from '../../../../../common/models/drawing'
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from 'src/app/models/httpResponse';

const BASE_URL: string = 'http://localhost:3000/savedrawing'


@Injectable({
  providedIn: 'root'
})
export class SaveDrawingService {
  private dataURL: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dataURLObs: Observable<string> = this.dataURL.asObservable();

  private imgName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  imgNameObs: Observable<string> = this.imgName.asObservable();

  private tags: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  tagsObs: Observable<Array<string>> = this.tags.asObservable()

  constructor(private http:HttpClient) { }

  setDataURL(dataURL:string): void{
    this.dataURL.next(dataURL);
  }

  setImgName(imgName:string): void{
    this.imgName.next(imgName);
  }

  setTags(tags:Array<string>): void{
    this.tags.next(tags);
  }

  saveDrawing(){
    let drawing = new Drawing(this.imgName.getValue(), this.tags.getValue(), this.dataURL.getValue());
    return this.http.post<HttpResponse>(BASE_URL,drawing)
  }
}

