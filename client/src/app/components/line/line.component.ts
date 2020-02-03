import { Component, OnInit } from '@angular/core';
import { LineService } from './../../services/line/line.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  constructor(private lineService: LineService) { 
    this.lineService.thicknessObs.subscribe((thickness: number) => { 
      this.thickness = thickness;
    });
  }
    
  thickness: number;

  ngOnInit() {
    this.lineService.ngOnInit();
  }

  ngOnDestroy() {
    this.lineService.ngOnDestroy();
  }

  setThickness($event: Event){
    if ($event.target) {
      this.lineService.setThickness(parseInt((<HTMLInputElement>$event.target).value));
    }
  }
}
