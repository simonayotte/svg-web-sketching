import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveDrawingService {

  constructor() { }

  private imgName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  imgNameObs: Observable<string> = this.imgName.asObservable();

  private tags: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  tagsObs: Observable<Array<string>> = this.tags.asObservable()

  setImgName(imgName:string): void{
    this.imgName.next(imgName);
  }

  setTags(tags:Array<string>): void{
    this.tags.next(tags);
  }

  getImgName():string{
    return this.imgName.value;
  }

  getTags():Array<string>{
    return this.tags.value;
  }
}
