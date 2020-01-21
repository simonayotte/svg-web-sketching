import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { RouterModule } from '@angular/router';

import { routes } from '../environments/routes';

import { DrawPageComponent } from '../app/components/draw-page/draw-page.component';
@NgModule({
    declarations: [AppComponent, DrawPageComponent],
    imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
