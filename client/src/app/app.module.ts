import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './components/app/app.component';
import { DrawPageComponent } from './components/draw-page/draw-page.component';
import { RouterModule } from '@angular/router';
import { routes } from '../environments/routes';
import { BrushComponent } from './components/brush/brush.component';
import { GuideComponent } from './components/guide/guide.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { CreateDrawingComponent } from '../app/components/create-drawing/create-drawing.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PencilComponent } from './components/pencil/pencil.component'
import { RectangleComponent } from './components/rectangle/rectangle.component';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorComponent } from './components/color/color.component';
import { DrawingStartedDialogComponent } from './components/drawing-started-dialog/drawing-started-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        DrawPageComponent,
        CreateDrawingComponent,
        GuideComponent,
        BrushComponent,
        HomePageComponent,
        ColorComponent,
        RectangleComponent,
        PencilComponent,
        DrawingStartedDialogComponent
    ],
    imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes), ReactiveFormsModule, FormsModule, ColorPickerModule, MatDialogModule,BrowserAnimationsModule],
    providers: [],
    entryComponents: [CreateDrawingComponent,DrawingStartedDialogComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
