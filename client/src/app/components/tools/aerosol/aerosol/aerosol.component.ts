import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-aerosol',
  templateUrl: './aerosol.component.html',
  styleUrls: ['./aerosol.component.scss']
})
export class AerosolComponent {

  constructor() {
   this.thicknessChange = new EventEmitter();
   this.textureChange = new EventEmitter();
   this.emissionRateChange = new EventEmitter();
  }

  @Input('thickness') thickness: string;
  @Input('emissionRate') emissionRate: string;

  @Output() thicknessChange: EventEmitter<unknown>;
  @Output() textureChange: EventEmitter<unknown>;
  @Output() emissionRateChange: EventEmitter<unknown>;

  /* tslint:disable:no-any */
  setThickness(event: any): void {
    this.thicknessChange.emit(event.target.value);
  }

  setEmissionRate(event: any): void {
    this.emissionRateChange.emit(event.target.value);
  }

}
