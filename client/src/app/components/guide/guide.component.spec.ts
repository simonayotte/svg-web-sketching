import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideComponent } from './guide.component';

describe('GuideComponent', () => {
  let component: GuideComponent;
  let fixture: ComponentFixture<GuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should collapse selected category', () => {
    const nativeEl = fixture.debugElement.nativeElement;
    component.collapse("outils");
    expect(nativeEl.getElementById("outils-list").style.display == "block").toBeTruthy();
    component.collapse("outils");
    expect(nativeEl.getElementById("outils-list").style.display == "none").toBeTruthy();
  });
});
