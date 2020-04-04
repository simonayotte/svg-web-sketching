import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Tools } from 'src/app/models/enums';
import { SidebarComponent } from './sidebar.component';

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
        component.tool = Tools.Ellipsis;
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.fa-circle'));
        expect(button.classes.active).toBeTruthy();
    });

    it('#changeTool should emit #toolChange ', () => {
        const spy = spyOn(component.toolChange, 'emit');

        component.changeTool(Tools.Brush);
        expect(spy).toHaveBeenCalledWith(Tools.Brush);
    });
});
