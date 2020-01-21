import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IndexService } from '../../services/index/index.service';
import { DrawPageComponent } from './draw-page.component';
import SpyObj = jasmine.SpyObj;

describe('DrawPageComponent', () => {
    let indexServiceSpy: SpyObj<IndexService>;

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [DrawPageComponent],
            providers: [{ provide: IndexService, useValue: indexServiceSpy }],
        });
    }));
});
