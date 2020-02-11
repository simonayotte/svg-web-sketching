import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RectangleService } from 'src/app/services/rectangle/rectangle.service';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit, OnDestroy {

  constructor(private rectangleService: RectangleService) {
    this.rectangleService.thicknessObs.subscribe((thickness: number) => {
        this.thickness = thickness;
    });
}
@HostListener('document:keydown', ['$event'])
  changeSquareRectangle(event: KeyboardEvent){
    switch(event.shiftKey){
        case true:
        {
        console.log("ShiftKey pressed")
        if(!this.rectangleService.getshiftDown()){
            this.rectangleService.setshiftDown(true);
            }
        break;
        }
        case false:
        {
            if(this.rectangleService.getshiftDown()){
                this.rectangleService.setshiftDown(false);
                break;}
        }
    } 
  }

  @HostListener('document:keyup', ['$event'])
  changeRectangleSquare(event: KeyboardEvent){
    switch(event.shiftKey){
        case true:
        {
        if(!this.rectangleService.getshiftDown()){
            this.rectangleService.setshiftDown(true);
        break;}
        }
        case false:
        {
            if(this.rectangleService.getshiftDown()){
                this.rectangleService.setshiftDown(false);
                break;}
        }
    } 
  }
rectangleType: string = 'outline only';
thickness: number;

ngOnInit() {
    this.rectangleService.ngOnInit();
}

ngOnDestroy() {
    this.rectangleService.ngOnDestroy();
}
setThickness($event: Event) {
    if ($event.target) {
        this.rectangleService.setThickess(parseInt(($event.target as HTMLInputElement).value, 10));
    }
}

setRectangleType(rectangleType: string) {
    if (
        rectangleType === 'outline only' ||
        rectangleType === 'fill only' ||
        rectangleType === 'outline and fill'
    ) {
        this.rectangleService.setRectangleType(rectangleType);
        this.rectangleType = rectangleType;
    }
}

}
