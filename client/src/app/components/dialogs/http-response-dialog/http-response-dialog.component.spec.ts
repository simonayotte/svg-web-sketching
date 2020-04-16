import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpResponseDialogComponent } from './http-response-dialog.component';

describe('HttpResponseDialogComponent', () => {
  let component: HttpResponseDialogComponent;
  let fixture: ComponentFixture<HttpResponseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpResponseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
