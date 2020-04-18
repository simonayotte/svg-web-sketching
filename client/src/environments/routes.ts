import { HomePageComponent } from 'src/app/components/home-page/home-page.component';
import { DrawPageComponent } from '../app/components/draw-page/draw-page.component';
export const routes = [
    { path: 'draw', component: DrawPageComponent },
    { path: '', component: HomePageComponent },
];
