import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateDrawingStateService {
private isWidthModified:boolean = false;
private isHeightModified:boolean = false; 
private isRGB:boolean = false;
private isHEX:boolean = true;
  constructor() { }
}
