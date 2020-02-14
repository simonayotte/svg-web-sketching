import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateDrawingComponent } from 'src/app/components/create-drawing/create-drawing.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    private isCreateDrawingOpen = false;
    constructor(private dialog: MatDialog) {}
    ngOnInit() {
        /* Nothing needed in ngOnInit() */
    }
    openDialog(): void {
        const dialogRef = this.dialog.open(CreateDrawingComponent);
        this.isCreateDrawingOpen = true;

        dialogRef.afterClosed().subscribe(result => {
            this.isCreateDrawingOpen = false;
        });
    }

    @HostListener('document:keydown', ['$event'])
    openModal(event: KeyboardEvent) {
        console.log(event.code);
        if (event.code === 'KeyO' && event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            if (!this.isCreateDrawingOpen) {
                this.openDialog();
            }
        }
    }
}
