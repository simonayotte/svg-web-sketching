import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';


import { routes } from '../environments/routes';

import { DrawPageComponent } from '../app/components/draw-page/draw-page.component';
import { CreateDrawingComponent } from '../app/components/create-drawing/create-drawing.component';
import { HomePageComponent } from './components/home-page/home-page.component';
@NgModule({
    declarations: [AppComponent, DrawPageComponent, CreateDrawingComponent, HomePageComponent],
    imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes),ReactiveFormsModule,FormsModule,ColorPickerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
