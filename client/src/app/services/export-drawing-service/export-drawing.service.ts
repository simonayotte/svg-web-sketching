import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportDrawingService {

  constructor() { }

  private exportName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  exportNameObs: Observable<string> = this.exportName.asObservable();

  private type: BehaviorSubject<string> = new BehaviorSubject<string>('');
  typeObs: Observable<string> = this.type.asObservable()

  private dataURL: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dataURLObs: Observable<string> = this.dataURL.asObservable();

  setExportName(exportName:string):void{
    this.exportName.next(exportName);
  }

  setType(type:string):void{
    this.type.next(type);
  }

  setDataURL(dataURL:string): void{
    this.dataURL.next(dataURL);
  }

  getExportName():string{
    return this.exportName.value;
  }

  getType():string{
    return this.type.value;
  }

  getDataURL():string{
    return this.dataURL.value;
  }

}
