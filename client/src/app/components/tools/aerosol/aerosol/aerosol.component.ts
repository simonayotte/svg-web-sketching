import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-aerosol',
  templateUrl: './aerosol.component.html',
  styleUrls: ['./aerosol.component.scss']
})
export class AerosolComponent implements OnInit {

  constructor() { }

  @Input('thickness') thickness: string;

  @Output() thicknessChange = new EventEmitter();
  @Output() textureChange = new EventEmitter();

  ngOnInit() {
  }

  setThickness(event: any) {
    this.thicknessChange.emit(event.target.value);
  }

}
