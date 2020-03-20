import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveDrawingService {

  constructor() { }

  private dataURL: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dataURLObs: Observable<string> = this.dataURL.asObservable();

  private imgName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  imgNameObs: Observable<string> = this.imgName.asObservable();

  private tags: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  tagsObs: Observable<Array<string>> = this.tags.asObservable()

  setDataURL(dataURL:string): void{
    this.dataURL.next(dataURL);
  }

  setImgName(imgName:string): void{
    this.imgName.next(imgName);
  }

  setTags(tags:Array<string>): void{
    this.tags.next(tags);
  }

  getDataURL():string{
    return this.dataURL.value;
  }

  getImgName():string{
    return this.imgName.value;
  }

  getTags():Array<string>{
    return this.tags.value;
  }
}
