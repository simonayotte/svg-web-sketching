import { Component, OnInit, OnDestroy } from '@angular/core';
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
        this.rectangleService.setThickess(parseInt((<HTMLInputElement>$event.target).value));
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
