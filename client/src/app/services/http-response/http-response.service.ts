import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpResponseService {

  private message: BehaviorSubject<string> = new BehaviorSubject<string>('');
  messageObs: Observable<string> = this.message.asObservable();

  setMessage(value: string): void {
    this.message.next(value);
  }

  getMessage(): string {
    return this.message.value;
  }
}
