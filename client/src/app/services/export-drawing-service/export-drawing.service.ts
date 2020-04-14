import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportDrawingService {

  private exportName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  exportNameObs: Observable<string> = this.exportName.asObservable();

  private type: BehaviorSubject<string> = new BehaviorSubject<string>('');
  typeObs: Observable<string> = this.type.asObservable();

  setExportName(exportName: string): void {
    this.exportName.next(exportName);
  }

  setType(type: string): void {
    this.type.next(type);
  }

  getExportName(): string {
    return this.exportName.value;
  }

  getType(): string {
    return this.type.value;
  }
}
