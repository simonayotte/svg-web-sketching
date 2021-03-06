import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { AppModule } from 'src/app/app.module';
import { DrawModule } from 'src/app/modules/draw.module';
import { DrawPageComponent } from './draw-page.component';

describe('DrawPageComponent', () => {
    let component: DrawPageComponent;
    let fixture: ComponentFixture<DrawPageComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [DrawModule, MatDialogModule, AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
