import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent {

  constructor() {
    this.toleranceChange = new EventEmitter();
   }
 
   @Input('tolerance') tolerance: string;
 
   @Output() toleranceChange: EventEmitter<unknown>;
 
   /* tslint:disable:no-any */
   setTolerance(event: any): void {
     this.toleranceChange.emit(event.target.value);
   }
}
