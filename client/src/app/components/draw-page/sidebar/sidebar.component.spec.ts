import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SidebarComponent } from './sidebar.component';
import { MatDialogModule } from '@angular/material';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [MatDialogModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ellipsis button should be active if selected tool is Ellipse', () => {
        component.tool = 'Ellipse';
        fixture.detectChanges();
        let button = fixture.debugElement.query(By.css('.fa-circle'));
        expect(button.classes.active).toBeTruthy();
    });

    it('#changeTool should emit #toolChange ', () => {
        const spy = spyOn(component.toolChange, 'emit');

        component.changeTool('Pinceau');
        expect(spy).toHaveBeenCalledWith('Pinceau');
    });
});
