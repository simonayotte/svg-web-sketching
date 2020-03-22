import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Drawing } from '../../../../../common/models/drawing';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor() { }

  private drawings: BehaviorSubject<Array<Drawing>> = new BehaviorSubject<Array<Drawing>>([]);
  drawingsObs: Observable<Array<Drawing>> = this.drawings.asObservable();

  setDrawings(drawings: Array<Drawing>){
    this.drawings.next(drawings);
  }
}
