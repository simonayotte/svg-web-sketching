import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RectangleService } from 'src/app/services/rectangle/rectangle.service';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit, OnDestroy {

  rectangleType = 'outline only';
  thickness: number;
  constructor(private rectangleService: RectangleService) {
    this.rectangleService.thicknessObs.subscribe((thickness: number) => {
        this.thickness = thickness;
    });
}
@HostListener('document:keydown', ['$event'])
@HostListener('document:keyup', ['$event'])
  changeSquareToRectangle(event: KeyboardEvent) {
      if (event.shiftKey) {
        if (!this.rectangleService.getshiftDown()) {
            this.rectangleService.setshiftDown(true);
        }
      } else {
        if (this.rectangleService.getshiftDown()) {
            this.rectangleService.setshiftDown(false);
        }
      }
  }

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
