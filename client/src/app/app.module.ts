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
import { RectangleComponent } from './components/rectangle/rectangle.component';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 @NgModule({
    declarations: [AppComponent, DrawPageComponent, CreateDrawingComponent, GuideComponent, BrushComponent, HomePageComponent, RectangleComponent,],
    imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes), ReactiveFormsModule, FormsModule, ColorPickerModule, MatDialogModule,BrowserAnimationsModule],
    entryComponents: [CreateDrawingComponent],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
