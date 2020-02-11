import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideComponent } from './guide.component';
import { By } from '@angular/platform-browser';

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

  it('should correctly call displayTextSubject when cliking on a subject', () => {
    const displayTextSubjectSpy = spyOn(component,'displayTextSubject');
    const button = fixture.debugElement.query(By.css('.subject'));
    button.triggerEventHandler('click',{});
    fixture.detectChanges();
    expect(displayTextSubjectSpy).toHaveBeenCalledTimes(1);
  });

  it('should correctly call displayCategory when cliking on a category', () => {
    const displayCategorySpy = spyOn(component,'displayCategory');
    const button = fixture.debugElement.query(By.css('.category'));
    button.triggerEventHandler('click',{});
    fixture.detectChanges();
    expect(displayCategorySpy).toHaveBeenCalledTimes(1);
  });
});
