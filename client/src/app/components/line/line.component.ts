import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { LineService } from './../../services/line/line.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit, OnDestroy {

  constructor(private lineService: LineService) { 
    this.lineService.thicknessObs.subscribe((thickness: number) => { 
      this.thickness = thickness;
    });
    
    this.lineService.junctionPointThicknessObs.subscribe((junctionPointThickness: number) =>{
      this.junctionPointThickness = junctionPointThickness;
    })
  }
    
  thickness: number;
  lineHasJunction: boolean = true;
  junctionPointThickness: number;

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

  setJunctionPointThickness($event: Event) {
    if ($event.target) {
      this.lineService.setJunctionPointThickness(parseInt((<HTMLInputElement>$event.target).value));
    }
  }

  setJunctionType(lineHasJunction: boolean) {
    this.lineService.setJunctionType(lineHasJunction);
    this.lineHasJunction = lineHasJunction;
  }

  @HostListener('document:keydown.escape', ['$event'])
    cancelLine(event: KeyboardEvent){
      this.lineService.cancelLine();
    }

  @HostListener('document:keydown.backspace', ['$event'])
    cancelSegment(event: KeyboardEvent){
      this.lineService.cancelSegment();
    }

  @HostListener('document:keydown.shift', ['$event'])
    alignLine(event: KeyboardEvent){
      //TODO: Remove ConsoleLog after testing
      console.log('shift keydown');
      this.lineService.setShiftKeyDown(true);
    }

  @HostListener('document:keyup.shift', ['$event'])
    freeLine(event: KeyboardEvent) {
      //TODO: Remove ConsoleLog after testing
      console.log('shift keyup');
      this.lineService.setShiftKeyDown(false);
    }




}

