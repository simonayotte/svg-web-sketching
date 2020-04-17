import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportDrawingService {
<<<<<<< HEAD
=======

>>>>>>> master
  private exportName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  exportNameObs: Observable<string> = this.exportName.asObservable();

  private type: BehaviorSubject<string> = new BehaviorSubject<string>('');
  typeObs: Observable<string> = this.type.asObservable();

  private email: BehaviorSubject<string> = new BehaviorSubject<string>('');
  emailObs: Observable<string> = this.email.asObservable();

  private option: BehaviorSubject<string> = new BehaviorSubject<string>('');
  optionObs:Observable<string> = this.option.asObservable();

  constructor() { }

  setExportName(exportName: string): void {
    this.exportName.next(exportName);
  }

  setType(type: string): void {
    this.type.next(type);
  }

  setEmail(email: string): void {
    this.email.next(email);
  }

  setOption(option: string):void {
    this.option.next(option);
  }


  getExportName(): string {
    return this.exportName.value;
  }

  getType(): string {
    return this.type.value;
  }

  getEmail(): string{
    return this.email.value;
  }

  getOption():string {
   return this.option.value;
  }

  
}
