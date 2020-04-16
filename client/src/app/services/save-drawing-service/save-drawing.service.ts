import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveDrawingService {

  private imgName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  imgNameObs: Observable<string> = this.imgName.asObservable();

  private tags: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  tagsObs: Observable<string[]> = this.tags.asObservable();

  setImgName(imgName: string): void {
    this.imgName.next(imgName);
  }

  setTags(tags: string[]): void {
    this.tags.next(tags);
  }

  getImgName(): string {
    return this.imgName.value;
  }

  getTags(): string[] {
    return this.tags.value;
  }
}
