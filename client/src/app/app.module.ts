import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CreateDrawingComponent } from './components/dialogs/create-drawing-dialog/create-drawing.component';
import { routes } from '../environments/routes';
import { AppComponent } from './components/app/app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DrawModule } from './modules/draw.module';
import { DrawingStartedDialogComponent } from './components/dialogs/drawing-started-dialog/drawing-started-dialog.component';

@NgModule({
    declarations: [AppComponent, CreateDrawingComponent, HomePageComponent, DrawingStartedDialogComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule,
        OverlayModule,
        DrawModule,
    ],
    providers: [],
    entryComponents: [CreateDrawingComponent, DrawingStartedDialogComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
