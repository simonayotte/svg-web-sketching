import { Component, OnInit, HostListener} from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  private isCreateDrawingOpen:boolean = false;
  constructor(public dialog: MatDialog) { }
  
  ngOnInit() {
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(CreateDrawingComponent)
    this.isCreateDrawingOpen = true;

    dialogRef.afterClosed().subscribe(result => {
      this.isCreateDrawingOpen = false; // Pizza!
    });
  }

  @HostListener('document:keydown', ['$event'])
  openModal(event:KeyboardEvent){
    console.log(event.code)
    if ( event.code == 'KeyO' && event.ctrlKey) {
     event.preventDefault();
     event.stopPropagation();
     if (!this.isCreateDrawingOpen){
      this.openDialog();
     }
    }
  }
}


