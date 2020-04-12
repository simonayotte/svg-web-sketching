import { OverlayModule } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material';
import { GuideComponent } from 'src/app/components/guide/guide.component';
import { HomePageComponent } from './home-page.component';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let continueDrawingService: ContinueDrawingService;
  const dialogMock = {
    close: () => {/*empty function*/}
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageComponent, GuideComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {dialogMock}
        },
      MatDialog],
      imports: [OverlayModule, MatDialogModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    continueDrawingService = TestBed.get(ContinueDrawingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#continueDrawing() should call #setIsContinueDrawing() of the continueDrawingService', ()=> {
    spyOn(continueDrawingService, 'setIsContinueDrawing');
    component.continueDrawing();
    expect(continueDrawingService.setIsContinueDrawing).toHaveBeenCalledWith(true);
  })
});
