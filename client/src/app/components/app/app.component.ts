import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Message } from '../../../../../common/communication/message';
// import { IndexService } from '../../services/index/index.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
}
