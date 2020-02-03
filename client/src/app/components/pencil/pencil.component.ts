import { PencilService } from './../../services/pencil/pencil.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss']
})

export class PencilComponent implements OnInit {

  constructor(private pencilService: PencilService) { 
    this.pencilService.thicknessObs.subscribe((thickness: number) => {
      this.thickness = thickness;
    });
  }

  thickness: number;
    
  ngOnInit() {
    this.pencilService.ngOnInit();
  }

  ngOnDestroy() {
    this.pencilService.ngOnDestroy();
  }

  setThickness($event: Event) {
    if ($event.target) {
        this.pencilService.setThickess(parseInt((<HTMLInputElement>$event.target).value));
    }
}
}
