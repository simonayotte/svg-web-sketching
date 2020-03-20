import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewExportComponent } from './preview-export.component';

describe('PreviewExportComponent', () => {
  let component: PreviewExportComponent;
  let fixture: ComponentFixture<PreviewExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
