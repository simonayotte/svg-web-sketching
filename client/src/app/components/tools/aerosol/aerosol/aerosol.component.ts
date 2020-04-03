import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-aerosol',
  templateUrl: './aerosol.component.html',
  styleUrls: ['./aerosol.component.scss']
})
export class AerosolComponent implements OnInit {

  constructor() { }

  @Input('thickness') thickness: string;
  @Input('emissionRate') emissionRate: string;

  @Output() thicknessChange = new EventEmitter();
  @Output() textureChange = new EventEmitter();
  @Output() emissionRateChange = new EventEmitter();

  ngOnInit() {
  }

  setThickness(event: any) {
    this.thicknessChange.emit(event.target.value);
  }

  setEmissionRate(event: any) {
    this.emissionRateChange.emit(event.target.value);
  }

}
